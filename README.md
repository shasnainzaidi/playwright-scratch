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

**AI Integration (GitHub Copilot)**
Why GitHub Copilot?

We selected GitHub Copilot because:

Seamless integration with VS Code
Free/student access options
Strong support for test generation
Context-aware suggestions
How It Works in This Project
Jira story is extracted into structured Markdown
A prompt template is combined with story content
Final prompt is opened in VS Code
Copilot generates:
✅ Manual Test Cases
✅ Playwright Automation Scripts
Example Workflow
SCRUM-5 → generateWithJira.ts → prompts/SCRUM-5.md
→ combine prompt → AI input file
→ Copilot generates test cases

**Jira Story Integration**
Fetch Story from Jira
node scripts/generateWithJira.ts SCRUM-3

This generates:

prompts/SCRUM-3.md

🧠 AI-Assisted Test Generation

Open the generated story file and use GitHub Copilot Chat to generate:

Manual Test Cases

Playwright Automation Scripts

Edge Cases & Validations

🏛 Architecture
Jira → Node API Script → Story Markdown → AI → Test Files

⚙ Technologies Used

Node.js (ESM)

Axios

Dotenv

Jira REST API

GitHub Copilot

**Test Case Generation (Manual + Automation)**
Step 1: Generate AI Prompt
node scripts/generatePrompt.ts SCRUM-5
Step 2: Use Copilot Chat
Open generated file in VS Code
Ask Copilot:
Generate detailed manual test cases in JSON
Generate Playwright test scripts
Output
Manual Test Cases (JSON)
[
  {
    "title": "Verify login with valid credentials",
    "steps": [
      { "step": "Enter email", "expected": "Email accepted" }
    ]
  }
]
Automation Tests
test('@smoke Login test', async ({ page }) => {
  await page.goto('/');
});
📊 TestMo Integration
Purpose

Automate test case creation in Test Management system.

Script Used
node scripts/PushToTestMo.js testcases.json
What It Does
Reads AI-generated JSON
Maps to TestMo format
Uploads test cases via API
Creates test cases in bulk

Future Enhancements

CI/CD pipeline integration (Jenkins)

Docker execution

Test tagging strategy

Data-driven testing

Contract testing

Lighthouse performance audits

Full automated AI test generation

CI/CD integration

Jenkins pipeline

Auto PR creation

MCP-based AI agents

Author

Hasnain — Senior SQA Analyst

Automation-focused QA engineer with expertise in building scalable testing frameworks and improving release confidence through intelligent automation.

