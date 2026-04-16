**Playwright AI-Driven Test Automation Framework**

This project is a modern, scalable test automation framework built using Playwright + TypeScript, enhanced with AI-assisted test generation and Test Management integration.

It demonstrates a complete QA pipeline:

Jira → Structured Story → AI Prompt → Test Cases (Manual + Automation) → TestMo → Playwright Execution → CI (Jenkins)

The goal is to reduce manual effort, improve consistency, and accelerate test creation using AI while maintaining production-level structure and control.
Designed to support:

UI authentication via Email

API authentication via Phone

Parallel execution

Visual testing capability

Storage-state based session reuse

CI-ready configuration

Allure & HTML reporting

This framework follows modern automation architecture practices focused on speed, stability, and maintainability.

**Key Features**
✅ Playwright-based UI automation (Chromium)
✅ Environment-driven execution using .env
✅ Tag-based execution (@smoke, @regression)
✅ Authentication reuse via storage state
✅ AI-assisted test generation (GitHub Copilot)
✅ Jira integration (story extraction via API)
✅ Automated Test Case creation in TestMo
✅ CI-ready architecture (Jenkins compatible)
✅ Scalable and modular folder structure

**Tech Stack**
Tool	Purpose
Playwright	End-to-end test automation
TypeScript	Type safety & maintainability
Dotenv	Secure environment configuration
Allure Reporter	Advanced reporting
HTML Reporter	Built-in Playwright report

**Initial Project Setup**
1. Clone Repository
git clone <https://github.com/shasnainzaidi/playwright-scratch>
cd playwright-ts-framework
2.  Install Dependencies
npm install
npx playwright install
3. Run Tests
npx playwright test
4. Configure Environment

Create .env file:

# Jira
JIRA_BASE_URL=https://hasnainz.atlassian.net
JIRA_EMAIL
JIRA_API_TOKEN

# TestMo
TESTMO_BASE_URL=https://playwrighttest.testmo.net
TESTMO_API_TOKEN

**Framework Architecture**
playwright-ts-framework/ 
 tests/ 
    ├── setup/ # Authentication setup
    ├── visuals/ # Visual test cases 
    ├── stage/ # Stage-specific scenarios 
         └── *.spec.ts # Feature-based test files
 pages/ # Page Object Models 
 test-data/ # Test data files
 prompts/ # AI prompts & Jira exports 
 scripts/ # Automation scripts (Jira, TestMo)
 playwright.config.ts # Core framework configuration 
 .env # Environment variables 
 package.json # Dependencies & scripts 
 Jenkinsfile # CI pipeline


**Authentication Strategy**

This framework uses Playwright Storage State to eliminate repeated logins and drastically reduce execution time.

Flow:
✅ Email Authentication (UI)

Login once via UI.

Save session:

playwright/.auth/emailAuth.json


Reuse session across tests.

✅ Phone Authentication (API)

Uses token-based login via API to generate authenticated browser context.

Benefits:

Faster execution

No UI dependency

Ideal for CI pipelines

⚡ Parallel Execution

Projects are configured to allow isolated execution:

chromium-public → tests without login

chromium-email → UI authenticated tests

chromium-phone → API authenticated tests

Authentication setup runs automatically using project dependencies.

▶ Running Tests
Run All Tests
npx playwright test

Run Email Tests Only
npx playwright test --project=chromium-email

Run Phone Tests Only
npx playwright test --project=chromium-phone

Run in Headed Mode
npx playwright test --headed

Debug Mode
npx playwright test --debug

**Reporting**
HTML Report
npx playwright show-report

Allure Report
allure serve allure-results


**Visual Testing**

Playwright supports automatic visual comparison against baseline images.

Example:

await expect(page).toHaveScreenshot('homepage.png');


On first run → baseline is created.
Subsequent runs → compared for regressions.

Ideal for detecting unintended UI changes.

⭐ Best Practices Implemented

✅ Page Object Model
✅ Storage state reuse
✅ Environment isolation
✅ Parallel execution
✅ API + UI hybrid strategy
✅ Secure secrets management
✅ CI-friendly retries
✅ Failure artifacts (trace/video/screenshots)

# Playwright AI QA Pipeline

An end-to-end test automation pipeline that connects Jira, GitHub Copilot, Testmo, and a self-healing MCP server to automate the full QA workflow — from story to passing Playwright test.

---

## How it all fits together

```
Jira Story (SCRUM-5)
       │
       │  npx tsx scripts/generateWithJira.ts SCRUM-5
       ▼
prompts/SCRUM-5.md          ← Story exported as Markdown
       │
       │  npx tsx scripts/generateTestCases.ts SCRUM-5
       ▼
Copilot Chat (you paste & copy JSON)
       │
       ▼
Human review in terminal  ← You press A / M / S for each test case
       │
       ├──────────────────────────────────────┐
       ▼                                      ▼
testcases/SCRUM-5-manual.json      testcases/SCRUM-5-automated.json
       │                                      │
       │  npx tsx scripts/pushToTestmo.ts     │  MCP server in Copilot Chat
       ▼                                      ▼
Testmo (manual test cases)         Playwright .spec.ts
                                   Run → Fail → Fix → Re-run (loop)
                                           │
                                           ▼
                                   All tests pass → Human review → Merge
```

---

## Prerequisites

### 1. Install tsx (one-time)

Your project uses `"type": "module"` and `"module": "NodeNext"` in tsconfig.  
`ts-node` does not support this combination. `tsx` does.

```powershell
npm install --save-dev tsx
```

### 2. Environment variables

Create a `.env` file in your project root:

```env
# Jira
JIRA_BASE_URL=https://your-org.atlassian.net
JIRA_EMAIL=you@yourcompany.com
JIRA_API_TOKEN=your_jira_api_token

# Testmo
TESTMO_BASE_URL=https://your-org.testmo.net
TESTMO_API_TOKEN=your_testmo_token
TESTMO_PROJECT_ID=1
TESTMO_GROUP_ID=1
TESTMO_REPOSITORY_ID=1

# Playwright
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

### 3. File structure

Place these files in your `scripts/` folder:

```
scripts/
  types.ts               ← Shared TypeScript types (do not edit)
  generateWithJira.ts    ← Fetches story from Jira
  generateTestCases.ts   ← Saves Copilot prompt + human A/M/S loop
  pushToTestmo.ts        ← Pushes manual cases to Testmo
  pipeline.ts            ← Runs all steps in sequence
```

---

## Running scripts individually

### Step 1 — Fetch Jira story

```powershell
npx tsx scripts/generateWithJira.ts SCRUM-5
```

**What it does:** Calls the Jira API, parses the story description (including Acceptance Criteria and Notes), and saves it as a readable Markdown file.

**Output:**
```
prompts/SCRUM-5.md
```

---

### Step 2 — Generate test cases via Copilot + human review

```powershell
npx tsx scripts/generateTestCases.ts SCRUM-5
```

**What it does:**

1. Reads `prompts/SCRUM-5.md` and combines it with the prompt template
2. Saves the combined prompt to `prompts/SCRUM-5-ai-input.md`
3. **Pauses** and shows you instructions to paste into Copilot Chat
4. You paste the prompt into Copilot → copy the JSON it returns → save to `testcases/SCRUM-5-raw.json`
5. Press ENTER in the terminal
6. The **human review loop** starts — for each test case you see:
   - ID, title, priority, preconditions, steps
   - A suggestion (Automated or Manual) based on keywords
   - Press **A** (automated), **M** (manual), or **S** (skip)
7. Files are saved automatically

**Output:**
```
testcases/SCRUM-5.json            ← all classified cases
testcases/SCRUM-5-manual.json     ← your M choices
testcases/SCRUM-5-automated.json  ← your A choices
```

**Copilot prompt template** is auto-created at `prompts/test-generation-prompt.md` on first run. Edit it to match your team's style.

---

### Step 3 — Push manual cases to Testmo

```powershell
npx tsx scripts/pushToTestmo.ts testcases\SCRUM-5-manual.json
```

**What it does:** Reads the manual test cases JSON and uploads them to Testmo via the API. Handles batching (20 per request) and retries on rate-limit errors.

**Output:** Test cases appear in Testmo under the configured project/repository/group.

---

### Step 4 — MCP self-healing loop (in Copilot Chat)

After automated cases are saved, paste this prompt into Copilot Chat in VS Code (with the `playwright-qa-mcp` server running):

```
Using playwright-qa-mcp tools:

1. Read testcases\SCRUM-5-automated.json using the read_file tool
2. Run generate_playwright_script for SCRUM-5
3. Run the tests with run_playwright_tests
4. If PASS → report done and summarise
5. If FAIL:
   a. Read the failing file with read_file
   b. Fix only the broken part
   c. Write the full fixed file with write_file
   d. Run tests again
6. Repeat until all pass (max 5 iterations)
7. Summarise all changes made
```

---

## Running the full pipeline (combined)

```powershell
npx tsx scripts/pipeline.ts SCRUM-5
```

This runs all steps in sequence in one command:
- Fetches Jira story
- Saves and opens Copilot prompt
- Waits for you to paste JSON and press ENTER
- Shows human A/M/S review loop
- Pushes manual cases to Testmo
- Prints the MCP prompt to paste into Copilot

**Skip Testmo push:**
```powershell
npx tsx scripts/pipeline.ts SCRUM-5 --skip-testmo
```

---

## npm script shortcuts (optional)

Add to `package.json` scripts:

```json
"scripts": {
  "jira": "tsx scripts/generateWithJira.ts",
  "testcases": "tsx scripts/generateTestCases.ts",
  "push-testmo": "tsx scripts/pushToTestmo.ts",
  "pipeline": "tsx scripts/pipeline.ts"
}
```

Then run:
```powershell
npm run jira SCRUM-5
npm run testcases SCRUM-5
npm run push-testmo testcases\SCRUM-5-manual.json
npm run pipeline SCRUM-5
```

---

## Files produced per story

| File | Contents | Used by |
|------|----------|---------|
| `prompts/SCRUM-5.md` | Jira story in Markdown | Copilot prompt input |
| `prompts/SCRUM-5-ai-input.md` | Full prompt for Copilot | You paste this |
| `testcases/SCRUM-5-raw.json` | Raw Copilot output | Intermediate, can delete |
| `testcases/SCRUM-5.json` | All classified cases | Reference |
| `testcases/SCRUM-5-manual.json` | Manual cases only | Pushed to Testmo |
| `testcases/SCRUM-5-automated.json` | Automated cases only | MCP → Playwright |
| `tests/SCRUM-5.spec.ts` | Generated Playwright test | MCP loop fixes this |

---
Author
Hasnain — Senior SQA Analyst

Automation-focused QA engineer with expertise in building scalable testing frameworks and improving release confidence through intelligent automation.

