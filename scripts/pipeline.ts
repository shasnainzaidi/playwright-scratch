import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { fetchJiraIssue, saveStoryMarkdown } from "./generateWithJira.js"; // .js required
import { pushManualCases } from "./pushToTestmo.js";                        // .js required
import type { TestCase } from "./types.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── CLI args ──────────────────────────────────────────────────────────────────
const issueKey = process.argv[2];
const skipTestmo = process.argv.includes("--skip-testmo");

function stepHeader(n: number, label: string) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Step ${n}: ${label}`);
  console.log("═".repeat(60));
}

if (!issueKey) {
  console.error("❌ Usage: npx tsx scripts/pipeline.ts SCRUM-5 [--skip-testmo]");
  process.exit(1);
}

console.log(`\n🚀 QA Pipeline — ${issueKey}`);
console.log(`   Skip Testmo: ${skipTestmo}`);

// ── Step 1: Fetch Jira ────────────────────────────────────────────────────────
stepHeader(1, "Fetch Jira story");
try {
  const story = await fetchJiraIssue(issueKey);
  const mdPath = saveStoryMarkdown(story);
  console.log(`✅ Story saved → ${mdPath}`);
  console.log(`   "${story.summary}"`);
} catch (err: any) {
  console.error("❌ Jira fetch failed:", err.response?.data || err.message);
  process.exit(1);
}

// ── Step 2: Generate & classify test cases ────────────────────────────────────
// Runs generateTestCases.ts as a child process with inherited stdio so the
// interactive A/M/S keypress loop owns stdin cleanly.
stepHeader(2, "Generate & classify test cases (Copilot + human review)");

const generateScript = path.join(__dirname, "generateTestCases.ts");
const result = spawnSync("npx", ["tsx", generateScript, issueKey], {
  stdio: "inherit",
  shell: true,
  cwd: process.cwd(),
});

if (result.status !== 0) {
  console.error("❌ Test case generation failed or was cancelled.");
  process.exit(1);
}

// ── Step 3: Push manual cases to Testmo ──────────────────────────────────────
const manualPath = path.join(process.cwd(), "testcases", `${issueKey}-manual.json`);

if (skipTestmo) {
  stepHeader(3, "Push to Testmo [SKIPPED]");
  console.log(`   Run manually: npx tsx scripts/pushToTestmo.ts testcases\\${issueKey}-manual.json`);
} else {
  stepHeader(3, "Push manual cases to Testmo");

  if (!fs.existsSync(manualPath)) {
    console.warn(`⚠️  No manual cases file at ${manualPath} — nothing to push.`);
  } else {
    let manualCases: TestCase[] = [];
    try {
      const parsed = JSON.parse(fs.readFileSync(manualPath, "utf-8"));
      manualCases = Array.isArray(parsed) ? parsed : [];
    } catch {
      console.error("❌ Could not parse manual cases JSON.");
      process.exit(1);
    }

    if (manualCases.length === 0) {
      console.log("ℹ️  0 manual cases — nothing to push.");
    } else {
      try {
        await pushManualCases(manualCases);
      } catch (err: any) {
        console.warn("⚠️  Testmo push failed (non-fatal):", err.message);
        console.warn(`   Retry: npx tsx scripts/pushToTestmo.ts testcases\\${issueKey}-manual.json`);
      }
    }
  }
}

// ── Step 4: MCP instructions ──────────────────────────────────────────────────
stepHeader(4, "MCP self-healing loop — next action");

const automatedPath = path.join(process.cwd(), "testcases", `${issueKey}-automated.json`);
let automatedCount = 0;
if (fs.existsSync(automatedPath)) {
  try {
    automatedCount = JSON.parse(fs.readFileSync(automatedPath, "utf-8")).length;
  } catch { /* ignore */ }
}

if (automatedCount === 0) {
  console.log("ℹ️  No automated cases — MCP loop not needed.");
} else {
  console.log(`
  Paste this into Copilot Chat (playwright-qa-mcp must be running):
  ┌─────────────────────────────────────────────────────────────┐
  │  Using playwright-qa-mcp tools:                              │
  │                                                              │
  │  1. Read testcases\\${issueKey}-automated.json with read_file│
  │  2. Run generate_playwright_script for ${issueKey}           │
  │  3. Run the tests with run_playwright_tests                  │
  │  4. If PASS → report done and summarise                      │
  │  5. If FAIL:                                                 │
  │     a. Read the file with read_file                          │
  │     b. Fix only what is broken                               │
  │     c. Write the full fixed file with write_file             │
  │     d. Run tests again                                       │
  │  6. Repeat until all pass (max 5 iterations)                 │
  │  7. Summarise all changes made                               │
  └─────────────────────────────────────────────────────────────┘
`);
}

console.log("🏁 Pipeline complete.\n");
console.log("   Files created:");
console.log(`   • prompts\\${issueKey}.md`);
console.log(`   • prompts\\${issueKey}-ai-input.md`);
console.log(`   • testcases\\${issueKey}.json`);
console.log(`   • testcases\\${issueKey}-manual.json`);
console.log(`   • testcases\\${issueKey}-automated.json`);
