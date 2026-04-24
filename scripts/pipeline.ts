

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fetchJiraIssue, saveStoryMarkdown } from "./generateWithJira.js";
import {
  saveCopilotPrompt,
  waitForRawJson,
  humanSelectionLoop,
  saveSplitFiles,
} from "./generateTestCases.js";
import { pushManualCases } from "./pushToTestmo.js";
import type { TestCase } from "./types.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);

// ── CLI args ──────────────────────────────────────────────────────────────────
const issueKey = process.argv[2];
const skipTestmo = process.argv.includes("--skip-testmo");

function stepHeader(n: number, label: string) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Step ${n}: ${label}`);
  console.log(`${"═".repeat(60)}`);
}

if (!issueKey) {
  console.error("❌ Usage: npx tsx scripts/pipeline.ts SCRUM-5 [--skip-testmo]");
  process.exit(1);
}

console.log(`\n🚀 QA Pipeline — ${issueKey}`);
console.log(`   Skip Testmo push: ${skipTestmo}`);

// ── Step 1: Fetch Jira story ──────────────────────────────────────────────────
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

// ── Step 2: Save Copilot prompt ───────────────────────────────────────────────
stepHeader(2, "Generate test cases (Copilot + human review)");

const { promptOutputPath, rawOutputPath } = saveCopilotPrompt(issueKey);
console.log(`✅ AI prompt saved → ${promptOutputPath}`);
console.log("👉 Open this file in VS Code and use Copilot Chat");

// ── Step 3: Wait for Copilot JSON, then human classify ───────────────────────
const rawCases = await waitForRawJson(rawOutputPath, issueKey);
const classified = await humanSelectionLoop(rawCases, issueKey);

if (classified.length === 0) {
  console.log("\n⚠️  All test cases were skipped. Exiting.");
  process.exit(0);
}

saveSplitFiles(issueKey, classified);

// ── Step 4: Push manual cases to Testmo ──────────────────────────────────────
const manualPath = path.join(process.cwd(), "testcases", `${issueKey}-manual.json`);
const manualCases: TestCase[] = classified.filter((tc) => tc.type === "manual");

if (skipTestmo) {
  stepHeader(4, "Push to Testmo [SKIPPED — --skip-testmo flag]");
  console.log(`   Run manually: npx tsx scripts/pushToTestmo.ts testcases\\${issueKey}-manual.json`);
} else {
  stepHeader(4, "Push manual cases to Testmo");

  if (manualCases.length === 0) {
    console.log("ℹ️  No manual cases to push.");
  } else {
    try {
      await pushManualCases(manualCases);
    } catch (err: any) {
      console.warn("⚠️  Testmo push failed (non-fatal):", err.message);
      console.warn(`   Retry: npx tsx scripts/pushToTestmo.ts testcases\\${issueKey}-manual.json`);
    }
  }
}

// ── Step 5: MCP instructions ──────────────────────────────────────────────────
stepHeader(5, "MCP self-healing loop — paste this into Copilot Chat");

const automatedCases = classified.filter((tc) => tc.type === "automated");

if (automatedCases.length === 0) {
  console.log("ℹ️  No automated cases — MCP loop not needed.");
} else {
  console.log(`
  playwright-qa-mcp must be running. Then paste this prompt:
  ┌─────────────────────────────────────────────────────────────┐
  │  Using playwright-qa-mcp tools:                              │
  │                                                              │
  │  1. Read testcases\\${issueKey}-automated.json               │
  │     using the read_file tool                                 │
  │  2. Run generate_playwright_script for ${issueKey} and write
        automated test scripts inside stage folder of tests and 
        follow the current test pattern and practice used in 
        other test scripts of same folder                        │
  │  3. Run tests with run_playwright_tests                      │
  │  4. If PASS → report done and summarise                      │
  │  5. If FAIL:                                                 │
  │     a. Read failing file with read_file                      │
  │     b. Fix only the broken part                              │
  │     c. Write full fixed file with write_file                 │
  │     d. Run tests again                                       │
  │  6. Repeat until all pass (max 5 iterations)                 │
  │  7. Summarise all changes made                               │
  └─────────────────────────────────────────────────────────────┘
`);
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log("🏁 Pipeline complete.\n");
console.log("   Files created this run:");
console.log(`   • prompts\\${issueKey}.md`);
console.log(`   • prompts\\${issueKey}-ai-input.md`);
console.log(`   • testcases\\${issueKey}.json`);
console.log(`   • testcases\\${issueKey}-manual.json`);
console.log(`   • testcases\\${issueKey}-automated.json`);
