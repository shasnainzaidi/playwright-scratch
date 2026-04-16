/**
 * mcp-server/index.ts
 *
 * MCP server that gives Copilot/Claude tools to:
 *   1. Run Playwright tests
 *   2. Read test files
 *   3. Write (fix) test files
 *   4. Generate Playwright scripts from test case JSON
 *   5. List available test files
 *
 * Register in .vscode/mcp.json or use with Claude Desktop.
 *
 * Start: npx ts-node mcp-server/index.ts
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

// ── Server init ───────────────────────────────────────────────────────────────

const server = new Server(
  { name: "playwright-qa-mcp", version: "2.0.0" },
  { capabilities: { tools: {} } }
);

// ── Tool definitions ──────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "run_playwright_tests",
      description:
        "Run Playwright tests. Returns stdout + stderr combined so you can read pass/fail output and error details. Specify a file to run one test, or leave blank to run all.",
      inputSchema: {
        type: "object",
        properties: {
          testFile: {
            type: "string",
            description: "Relative path to a specific test file (e.g. tests/SCRUM-5.spec.ts). Omit to run all tests.",
          },
          headed: {
            type: "boolean",
            description: "Run in headed mode (shows browser). Default false.",
          },
          grep: {
            type: "string",
            description: "Filter tests by name/pattern (passed to --grep).",
          },
        },
      },
    },
    {
      name: "read_file",
      description: "Read the contents of a file. Use this to inspect a failing test before fixing it.",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "Relative file path." },
        },
        required: ["path"],
      },
    },
    {
      name: "write_file",
      description:
        "Write content to a file. Use this to save a fixed version of a failing test. Always write the COMPLETE file, not just the changed lines.",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "Relative file path." },
          content: { type: "string", description: "Full file content to write." },
        },
        required: ["path", "content"],
      },
    },
    {
      name: "list_test_files",
      description: "List all Playwright test files in the tests/ directory.",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "generate_playwright_script",
      description:
        "Generate a Playwright TypeScript test script from a test cases JSON file. Reads testcases/{storyKey}-automated.json and writes tests/{storyKey}.spec.ts.",
      inputSchema: {
        type: "object",
        properties: {
          storyKey: {
            type: "string",
            description: "The Jira story key, e.g. SCRUM-5.",
          },
          baseUrl: {
            type: "string",
            description: "Base URL for the app under test. Falls back to PLAYWRIGHT_BASE_URL env var.",
          },
        },
        required: ["storyKey"],
      },
    },
    {
      name: "read_test_results",
      description:
        "Read the latest Playwright JSON test results (from playwright-report/results.json). Returns a structured summary of passed, failed, and skipped tests.",
      inputSchema: { type: "object", properties: {} },
    },
  ],
}));

// ── Tool handlers ─────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;

  // ── run_playwright_tests ──────────────────────────────────────────────────
  if (name === "run_playwright_tests") {
    const parts = ["npx playwright test"];
    if (args.testFile) parts.push(String(args.testFile));
    if (args.headed) parts.push("--headed");
    if (args.grep) parts.push(`--grep "${args.grep}"`);
    parts.push("--reporter=list,json");
    parts.push("2>&1");

    const cmd = parts.join(" ");

    try {
      const { stdout } = await execAsync(cmd, { cwd: process.cwd(), timeout: 120_000 });
      return { content: [{ type: "text", text: `✅ Tests passed.\n\n${stdout}` }] };
    } catch (e: any) {
      const output = (e.stdout ?? "") + (e.stderr ?? "");
      return {
        content: [{ type: "text", text: `❌ Tests failed.\n\n${output}` }],
        isError: true,
      };
    }
  }

  // ── read_file ─────────────────────────────────────────────────────────────
  if (name === "read_file") {
    const filePath = String(args.path);
    if (!existsSync(filePath)) {
      return { content: [{ type: "text", text: `❌ File not found: ${filePath}` }], isError: true };
    }
    const content = readFileSync(filePath, "utf-8");
    return { content: [{ type: "text", text: content }] };
  }

  // ── write_file ────────────────────────────────────────────────────────────
  if (name === "write_file") {
    const filePath = String(args.path);
    writeFileSync(filePath, String(args.content), "utf-8");
    return { content: [{ type: "text", text: `✅ File written: ${filePath}` }] };
  }

  // ── list_test_files ───────────────────────────────────────────────────────
  if (name === "list_test_files") {
    const testsDir = path.join(process.cwd(), "tests");
    if (!existsSync(testsDir)) {
      return { content: [{ type: "text", text: "No tests/ directory found." }] };
    }
    const files = readdirSync(testsDir)
      .filter((f) => f.endsWith(".spec.ts") || f.endsWith(".test.ts"))
      .map((f) => `tests/${f}`);
    const text = files.length ? files.join("\n") : "No test files found in tests/";
    return { content: [{ type: "text", text }] };
  }

  // ── generate_playwright_script ────────────────────────────────────────────
  if (name === "generate_playwright_script") {
    const storyKey = String(args.storyKey);
    const baseUrl = String(args.baseUrl ?? process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000");
    const casesPath = path.join(process.cwd(), "testcases", `${storyKey}-automated.json`);

    if (!existsSync(casesPath)) {
      return {
        content: [{ type: "text", text: `❌ No automated test cases found at ${casesPath}. Run generateTestCases.ts first.` }],
        isError: true,
      };
    }

    const cases = JSON.parse(readFileSync(casesPath, "utf-8"));
    const script = buildPlaywrightScript(storyKey, baseUrl, cases);

    const outDir = path.join(process.cwd(), "tests");
    if (!existsSync(outDir)) require("fs").mkdirSync(outDir, { recursive: true });

    const outPath = path.join(outDir, `${storyKey}.spec.ts`);
    writeFileSync(outPath, script, "utf-8");

    return { content: [{ type: "text", text: `✅ Playwright script generated → ${outPath}\n\nContent:\n${script}` }] };
  }

  // ── read_test_results ─────────────────────────────────────────────────────
  if (name === "read_test_results") {
    const resultsPath = path.join(process.cwd(), "playwright-report", "results.json");
    if (!existsSync(resultsPath)) {
      return { content: [{ type: "text", text: "No results.json found. Run tests first with --reporter=json." }] };
    }

    const raw = JSON.parse(readFileSync(resultsPath, "utf-8"));
    const summary = {
      passed: raw.stats?.expected ?? 0,
      failed: raw.stats?.unexpected ?? 0,
      skipped: raw.stats?.skipped ?? 0,
      duration: `${((raw.stats?.duration ?? 0) / 1000).toFixed(1)}s`,
      failures: (raw.suites ?? [])
        .flatMap((s: any) => s.specs ?? [])
        .filter((spec: any) => spec.ok === false)
        .map((spec: any) => ({
          title: spec.title,
          error: spec.tests?.[0]?.results?.[0]?.error?.message ?? "Unknown error",
        })),
    };

    return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
  }

  return { content: [{ type: "text", text: `❌ Unknown tool: ${name}` }], isError: true };
});

// ── Playwright script builder ─────────────────────────────────────────────────

function buildPlaywrightScript(storyKey: string, baseUrl: string, cases: any[]): string {
  const blocks = cases.map((tc: any) => {
    const steps = (tc.steps ?? [])
      .map((s: any, i: number) => `    // Step ${i + 1}: ${s.step}\n    // Expected: ${s.expected}`)
      .join("\n");

    const tag = tc.priority === "high" ? "@smoke" : "@regression";

    return `  test('${tc.id} - ${tc.title.replace(/'/g, "\\'")}', async ({ page }) => {
    // Preconditions: ${tc.preconditions || "None"}
    // Tags: ${[...(tc.tags ?? []), tag].join(", ")}
    // Automation notes: ${tc.automationNotes || "None"}

${steps}

    // TODO: Implement Playwright selectors and assertions
    // Replace the placeholder steps below with real locators

    await page.goto('${baseUrl}');
    // await page.locator('[data-testid="..."]').click();
    // await expect(page.locator('...')).toBeVisible();
  });`;
  });

  return `import { test, expect } from "@playwright/test";

/**
 * Auto-generated Playwright tests for ${storyKey}
 * Generated: ${new Date().toISOString()}
 *
 * DO NOT EDIT manually — regenerate with:
 *   npx ts-node scripts/generateTestCases.ts ${storyKey}
 * Then fix with MCP server until passing.
 */

test.describe('${storyKey}', () => {
  test.beforeEach(async ({ page }) => {
    // Common setup — adjust as needed
    await page.goto('${baseUrl}');
  });

${blocks.join("\n\n")}
});
`;
}

// ── Start server ──────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  process.stderr.write("🚀 playwright-qa-mcp server running\n");
});
