import fs from "fs";
import path from "path";

/**
 * Extract failures from Playwright JSON report
 */
function extractFailures(suite, failures = []) {

  // ✅ Handle specs (THIS WAS MISSING)
  if (suite.specs) {
    for (const spec of suite.specs) {
      for (const test of spec.tests) {
        const testTitle = test.title || "Unnamed Test";

        if (test.results && test.results.length > 0) {
          const lastResult = test.results[test.results.length - 1];

          const failureStatuses = ["failed", "unexpected", "timedOut"];

          if (failureStatuses.includes(lastResult.status)) {
            failures.push({
              title: testTitle,
              status: lastResult.status,
              error: lastResult.error?.message || "No error message",
              file: lastResult.errorLocation?.file || "Unknown file",
              line: lastResult.errorLocation?.line || "N/A"
            });
          }
        }
      }
    }
  }

  // ✅ Recursively check nested suites
  if (suite.suites) {
    for (const child of suite.suites) {
      extractFailures(child, failures);
    }
  }

  return failures;
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Analyzing Playwright failures...");

  const reportPath = path.join("test-results", "results.json");

  if (!fs.existsSync(reportPath)) {
    console.error("❌ JSON report not found. Run Playwright tests first.");
    process.exit(1);
  }

  const raw = fs.readFileSync(reportPath, "utf-8");
  const report = JSON.parse(raw);

  let failures = [];

  if (report.suites) {
    for (const suite of report.suites) {
      extractFailures(suite, failures);
    }
  }

  console.log(`❌ Failures found: ${failures.length}`);

  if (failures.length === 0) {
    console.log("✅ No failures found. Nothing to analyze.");
    return;
  }

  /**
   * Build AI Prompt
   */
  let prompt = `
You are a Senior QA Automation Engineer.

Analyze the following Playwright test failures and provide:

1. Root cause of failure
2. Exact fix for the issue
3. Improved Playwright code
4. Suggest better locator strategy if needed
5. Mention if this is flaky test behavior

========================================
FAILURES
========================================
`;

  failures.forEach((f, i) => {
    prompt += `
----------------------------------------
Failure ${i + 1}

Test: ${f.title}
Status: ${f.status}
File: ${f.file}
Line: ${f.line}

Error:
${f.error}
`;
  });

  /**
   * Save output
   */
  const outputDir = path.join(process.cwd(), "prompts");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const outputPath = path.join(outputDir, "failure-analysis.md");

  fs.writeFileSync(outputPath, prompt);

  console.log(`🧠 AI prompt generated → ${outputPath}`);
  console.log("👉 Open this file in VS Code and use Copilot Chat");
}

main();