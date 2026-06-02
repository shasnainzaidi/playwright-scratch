import fs from "fs";
import path from "path";
import * as readline from "readline";
import { fileURLToPath } from "url";
import type { TestCase, TestType } from "./types.js";

export type { TestCase, TestType };

const __filename = fileURLToPath(import.meta.url);

// ── Step 1: Save Copilot prompt file ─────────────────────────────────────────
export function saveCopilotPrompt(
  issueKey: string
): { promptOutputPath: string; rawOutputPath: string } {
  const storyPath = path.join(process.cwd(), "prompts", `${issueKey}.md`);
  const promptTemplatePath = path.join(process.cwd(), "prompts", "test-generation-prompt.md");

  if (!fs.existsSync(storyPath)) {
    console.error(`❌ Story file not found: ${storyPath}`);
    console.error(`   Run first: npx tsx scripts/generateWithJira.ts ${issueKey}`);
    process.exit(1);
  }

  if (!fs.existsSync(promptTemplatePath)) {
    const defaultPrompt = `You are a senior QA engineer. Given the Jira story below, generate test cases.

Return ONLY a valid JSON array — no markdown, no explanation, no code fences.

Each item must follow this exact format:
[
  {
    "id": "{STORY_KEY}-TC-01",
    "title": "concise test case title",
    "priority": "high | medium | low",
    "preconditions": "what must be true before this test runs",
    "steps": [
      { "step": "user action", "expected": "expected system response" }
    ],
    "tags": ["smoke", "regression", "api", "ui", "auth"]
  }
]

Rules:
- Do NOT include a "type" field — the human will classify manual vs automated
- Generate between 6 and 12 test cases
- Cover: happy path, edge cases, negative tests, boundary values
- Steps must be clear enough for a junior tester to follow`;

    fs.mkdirSync(path.join(process.cwd(), "prompts"), { recursive: true });
    fs.writeFileSync(promptTemplatePath, defaultPrompt, "utf-8");
    console.log(`📝 Created prompt template → ${promptTemplatePath}\n`);
  }

  const story = fs.readFileSync(storyPath, "utf-8");
  const template = fs.readFileSync(promptTemplatePath, "utf-8");
  const finalPrompt = `${template}\n\n---\n\n${story}`;

  const promptOutputPath = path.join(process.cwd(), "prompts", `${issueKey}-ai-input.md`);
  fs.writeFileSync(promptOutputPath, finalPrompt, "utf-8");

  const testcasesDir = path.join(process.cwd(), "testcases");
  if (!fs.existsSync(testcasesDir)) fs.mkdirSync(testcasesDir, { recursive: true });

  const rawOutputPath = path.join(testcasesDir, `${issueKey}-raw.json`);
  return { promptOutputPath, rawOutputPath };
}

// ── Step 2: Wait for user to save Copilot JSON ───────────────────────────────
export async function waitForRawJson(
  rawOutputPath: string,
  issueKey: string
): Promise<any[]> {
  const relativePath = path.relative(process.cwd(), rawOutputPath);

  console.log("\n┌──────────────────────────────────────────────────────────────┐");
  console.log("│  COPILOT STEP — do this now:                                  │");
  console.log("│                                                                │");
  console.log(`│  1. Open:  prompts\\${issueKey}-ai-input.md`.padEnd(65) + "│");
  console.log("│  2. Copy the entire file content                               │");
  console.log("│  3. Paste into GitHub Copilot Chat in VS Code                  │");
  console.log("│  4. Copy the JSON array Copilot gives back                     │");
  console.log(`│  5. Save it to:  ${relativePath}`.padEnd(65) + "│");
  console.log("│  6. Come back here and press ENTER                             │");
  console.log("└──────────────────────────────────────────────────────────────┘\n");

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise<void>((resolve) => {
    rl.question("⏳ Press ENTER once you have saved the Copilot JSON...", () => {
      rl.close();
      resolve();
    });
  });

  if (!fs.existsSync(rawOutputPath)) {
    console.error(`\n❌ File not found: ${rawOutputPath}`);
    console.error("   Save the Copilot JSON output there and run again.");
    process.exit(1);
  }

  const raw = fs.readFileSync(rawOutputPath, "utf-8");
  const cleaned = raw.replace(/^```(?:json)?\s*/im, "").replace(/```\s*$/im, "").trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("\n❌ File does not contain valid JSON.");
    console.error("   Copy only the JSON array from Copilot — no extra text.");
    process.exit(1);
  }

  const cases: any[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.testCases)
    ? parsed.testCases
    : [];

  if (cases.length === 0) {
    console.error("\n❌ JSON is valid but contains no test cases.");
    process.exit(1);
  }

  console.log(`\n✅ Loaded ${cases.length} test case(s) from Copilot.\n`);
  return cases;
}

// ── Step 3: Human A/M/S classification loop ──────────────────────────────────
export async function humanSelectionLoop(
  cases: any[],
  issueKey: string
): Promise<TestCase[]> {
  console.log("┌──────────────────────────────────────────────────────────────┐");
  console.log("│  HUMAN REVIEW — Classify each test case                       │");
  console.log("│  A = Automated  |  M = Manual  |  S = Skip                   │");
  console.log("└──────────────────────────────────────────────────────────────┘");

  const isRawMode = process.stdin.isTTY === true;
  if (isRawMode) {
    (process.stdin as any).setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
  }

  const classified: TestCase[] = [];

  for (let i = 0; i < cases.length; i++) {
    const tc = cases[i];
    const tcId: string = tc.id ?? `${issueKey}-TC-${String(i + 1).padStart(2, "0")}`;

    console.log(`\n${"─".repeat(62)}`);
    console.log(`  [${i + 1}/${cases.length}]  ${tcId}`);
    console.log(`  Title    : ${tc.title}`);
    console.log(`  Priority : ${String(tc.priority ?? "medium").toUpperCase()}`);
    if (tc.preconditions) console.log(`  Pre-cond : ${tc.preconditions}`);

    const steps: any[] = Array.isArray(tc.steps) ? tc.steps : [];
    if (steps.length > 0) {
      console.log(`  Steps (${steps.length}):`);
      steps.slice(0, 3).forEach((s: any, idx: number) => {
        console.log(`    ${idx + 1}. ${s.step}`);
        console.log(`       ↳ ${s.expected}`);
      });
      if (steps.length > 3) console.log(`       ... +${steps.length - 3} more`);
    }

    const tags: string[] = Array.isArray(tc.tags) ? tc.tags : [];
    if (tags.length > 0) console.log(`  Tags     : ${tags.join(", ")}`);

    const lower = String(tc.title ?? "").toLowerCase();
    const autoWords = ["login", "submit", "valid", "error", "redirect", "api", "register", "search", "filter"];
    const looksAuto =
      autoWords.some((w) => lower.includes(w)) ||
      tags.some((t) => ["api", "regression", "smoke"].includes(t));
    console.log(`\n  💡 Suggestion: ${looksAuto ? "[A] Automated" : "[M] Manual"}`);

    const choice = await new Promise<TestType>((resolve) => {
      process.stdout.write("\n  Your choice [A / M / S]: ");

      if (!isRawMode) {
        const rl2 = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl2.once("line", (line) => {
          rl2.close();
          const k = line.trim().toLowerCase();
          resolve(k === "a" ? "automated" : k === "m" ? "manual" : "skip");
        });
        return;
      }

      const onKey = (key: string) => {
        const k = key.toLowerCase();
        if (k === "\u0003") { process.stdout.write("\n"); process.exit(0); }
        if (k === "a") {
          process.stdout.write("→ Automated\n");
          process.stdin.removeListener("data", onKey);
          resolve("automated");
        } else if (k === "m") {
          process.stdout.write("→ Manual\n");
          process.stdin.removeListener("data", onKey);
          resolve("manual");
        } else if (k === "s") {
          process.stdout.write("→ Skip\n");
          process.stdin.removeListener("data", onKey);
          resolve("skip");
        } else {
          process.stdout.write("\n  ⚠️  Press A, M, or S: ");
        }
      };
      process.stdin.on("data", onKey);
    });

    if (choice !== "skip") {
      classified.push({
        id: tcId,
        title: String(tc.title ?? "Untitled"),
        type: choice,
        priority: (["high", "medium", "low"].includes(tc.priority)
          ? tc.priority
          : "medium") as "high" | "medium" | "low",
        preconditions: String(tc.preconditions ?? ""),
        steps: steps.map((s: any) => ({
          step: String(s.step ?? ""),
          expected: String(s.expected ?? ""),
        })),
        tags,
        automationNotes: String(tc.automationNotes ?? ""),
      });
    }
  }

  if (isRawMode) {
    (process.stdin as any).setRawMode(false);
    process.stdin.pause();
  }

  return classified;
}

// ── Step 4: Save split files ──────────────────────────────────────────────────
export function saveSplitFiles(issueKey: string, cases: TestCase[]): void {
  const dir = path.join(process.cwd(), "testcases");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const manual = cases.filter((tc) => tc.type === "manual");
  const automated = cases.filter((tc) => tc.type === "automated");

  fs.writeFileSync(path.join(dir, `${issueKey}.json`), JSON.stringify(cases, null, 2), "utf-8");
  fs.writeFileSync(path.join(dir, `${issueKey}-manual.json`), JSON.stringify(manual, null, 2), "utf-8");
  fs.writeFileSync(path.join(dir, `${issueKey}-automated.json`), JSON.stringify(automated, null, 2), "utf-8");

  console.log("\n✅ Files saved:");
  console.log(`   All       → testcases\\${issueKey}.json            (${cases.length} total)`);
  console.log(`   Manual    → testcases\\${issueKey}-manual.json     (${manual.length} cases)`);
  console.log(`   Automated → testcases\\${issueKey}-automated.json  (${automated.length} cases)`);
  console.log(`\n▶  Push manual to Testmo:`);
  console.log(`   npx tsx scripts/pushToTestmo.ts testcases\\${issueKey}-manual.json`);
  console.log(`\n▶  Automated cases → paste MCP prompt in Copilot Chat`);
}

// ── CLI guard — ONLY runs when this file is the direct entry point ────────────
// When pipeline.ts imports this file, this block is completely skipped.
// When you run `npx tsx scripts/generateTestCases.ts SCRUM-5` directly, it runs.
const isMain = process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  const issueKey = process.argv[2];

  if (!issueKey) {
    console.error("❌ Usage: npx tsx scripts/generateTestCases.ts SCRUM-5");
    process.exit(1);
  }

  const { promptOutputPath, rawOutputPath } = saveCopilotPrompt(issueKey);
  console.log(`✅ AI prompt saved → ${promptOutputPath}`);
  console.log("👉 Open this file in VS Code and use Copilot Chat");
  console.log("\n=== EXPECTED OUTPUT === JSON ===");

  const rawCases = await waitForRawJson(rawOutputPath, issueKey);
  const classified = await humanSelectionLoop(rawCases, issueKey);

  if (classified.length === 0) {
    console.log("\n⚠️  All test cases were skipped. Nothing saved.");
    process.exit(0);
  }

  saveSplitFiles(issueKey, classified);
}
