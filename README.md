**Playwright TypeScript Automation Framework**

A scalable, production-ready UI and API automation framework built using Playwright + TypeScript, designed to support:

**UI authentication via Email

API authentication via Phone

Parallel execution

Visual testing capability

Storage-state based session reuse

CI-ready configuration

Allure & HTML reporting**

This framework follows modern automation architecture practices focused on speed, stability, and maintainability.

**Tech Stack**
Tool	Purpose
Playwright	End-to-end test automation
TypeScript	Type safety & maintainability
Dotenv	Secure environment configuration
Allure Reporter	Advanced reporting
HTML Reporter	Built-in Playwright report

🛠 Initial Project Setup
1️⃣ Clone Repository
git clone <https://github.com/shasnainzaidi/playwright-scratch>
cd playwright-ts-framework
2️⃣ Install Dependencies
npm install
npx playwright install
3️⃣ Run Tests
npx playwright test


🏗 Framework Architecture
playwright-ts-framework/
│
├── tests/
    ├── setup/
      ├── emailAuth.setup.ts     → UI login session creation
      ├── apiAuth.setup.ts       → API login session creation
├── EmailLogin.spec.ts
├── Visual.spec.ts
├── pages/
    ├── LoginPage.ts
├── scripts/
├── prompts/
├── .env
├── playwright.config.ts
├── tsconfig.json


🔐 Authentication Strategy

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

▶️ Running Tests
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

📊 Reports
HTML Report
npx playwright show-report

Allure Report
allure serve allure-results


👁 Visual Testing

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

🤖 Jira Story Integration
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

Future Enhancements

CI/CD pipeline integration (GitHub Actions / Jenkins)

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

