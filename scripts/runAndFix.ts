import { execSync } from "child_process";
import fs from "fs";

const MAX_RETRIES = 4;

function runTests() {
  console.log("🚀 Running Playwright tests...");
  try {
   execSync("npx playwright test --reporter=json", {
  stdio: "inherit"
});
    
  } catch (e) {
    console.log("⚠️ Tests failed (expected)");
  }
}

function analyzeFailures(): any[] {
  const path = "test-results/results.json";

  if (!fs.existsSync(path)) {
    console.log("❌ No results.json found");
    return [];
  }

  let raw = fs.readFileSync(path, "utf-8");

  // 🔥 Remove any non-JSON garbage before parsing
  const firstBrace = raw.indexOf("{");
  if (firstBrace > 0) {
    raw = raw.slice(firstBrace);
  }

  const data = JSON.parse(raw);

  const failures: any[] = [];

  function walk(suite: any) {
    if (suite.tests) {
      for (const test of suite.tests) {
        if (test.results) {
          for (const result of test.results) {
            if (result.status === "failed") {
              failures.push({
                title: test.title,
                error: result.error?.message,
                file: result.error?.location?.file
              });
            }
          }
        }
      }
    }

    if (suite.suites) {
      suite.suites.forEach(walk);
    }
  }

  walk(data);

  return failures;
}

function generateFixPrompt(failures: any[]) {
  let prompt = `
You are a senior QA automation engineer.

Fix the failing Playwright tests.

Failures:
`;

  failures.forEach((f, i) => {
    prompt += `
${i + 1}. Test: ${f.title}
Error: ${f.error}
File: ${f.file}
`;
  });

  prompt += `
Instructions:
- Fix selectors
- Fix waits
- Improve stability
- Do NOT break passing tests

Return updated code only.
`;

  fs.writeFileSync("prompts/fix-prompt.md", prompt);

  console.log("🧠 Fix prompt generated → prompts/fix-prompt.md");
}

function waitForUserFix() {
  console.log("\n⏳ Apply fixes using Copilot, then press ENTER...");
  process.stdin.once("data", () => {});
}

async function main() {
  for (let i = 1; i <= MAX_RETRIES; i++) {
    console.log(`\n🔁 Iteration ${i}`);

    runTests();

    const failures = analyzeFailures();

    console.log(`❌ Failures found: ${failures.length}`);

    if (failures.length === 0) {
      console.log("✅ All tests passed!");
      return;
    }

    generateFixPrompt(failures);

    waitForUserFix();
  }

  console.log("⚠️ Max retries reached. Manual intervention needed.");
}

main();