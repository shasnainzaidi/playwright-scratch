// ============================================================
// Jenkinsfile
// Place this file in the ROOT of your playwright-ts-framework
// repository alongside package.json
//
// What this pipeline does:
//   1. Pulls your code from GitHub on every push
//   2. Installs Node dependencies (npm ci)
//   3. Installs Chromium browser + OS dependencies
//   4. Runs ONLY your stage tests:
//        - ae-forms  (tests/stage/forms)
//        - ae-auth   (tests/stage/auth)
//        - stage     (tests/stage/ui)
//   5. Generates Allure report
//   6. Publishes HTML report inside Jenkins
//   7. Archives test artifacts (videos, screenshots, traces)
//   8. Sends email notification on failure
// ============================================================

pipeline {

    agent any

    // ── Environment variables ────────────────────────────────────────────────
    // All secrets come from Jenkins Credentials — never hardcoded here.
    // Non-secret values are set directly.
    environment {

        // CI flag — playwright.config.ts reads this to set retries:2, workers:2
        CI = 'true'

        // The stage base URL — matches AE_URL in your .env
        // Stored as a Jenkins Secret Text credential named AE_URL
        AE_URL = credentials('AE_URL')

        // Your app base URL (BASE_URL in .env)
        BASE_URL = credentials('BASE_URL')

        // Node version to use (matches your local setup)
        NODE_VERSION = '18'

        // Allure results folder — must match what allure-playwright writes to
        ALLURE_RESULTS = 'allure-results'

        // Report folder names
        PLAYWRIGHT_REPORT_DIR = 'playwright-report'
        TEST_RESULTS_DIR      = 'test-results'

        // Build display name shown in Jenkins UI
        BUILD_LABEL = "Stage Tests — ${env.BRANCH_NAME} #${env.BUILD_NUMBER}"
    }

    // ── Pipeline options ─────────────────────────────────────────────────────
    options {
        // Keep last 20 builds (adjust to your disk space)
        buildDiscarder(logRotator(numToKeepStr: '20'))

        // Fail entire build if it runs longer than 45 minutes
        // Stage tests across 3 projects can take time — adjust if needed
        timeout(time: 45, unit: 'MINUTES')

        // Prefix every log line with a timestamp — essential for debugging
        timestamps()

        // Prevent two builds of the same branch running at the same time
        // Avoids race conditions on shared test data
        disableConcurrentBuilds()

    }

    // ── Trigger — rebuild on every push to GitHub ────────────────────────────
    // Requires GitHub plugin + webhook configured on your repo
    // Webhook URL: http://YOUR-JENKINS-IP:8080/github-webhook/
    triggers {
        githubPush()
    }

    // ════════════════════════════════════════════════════════════════════════
    // STAGES
    // ════════════════════════════════════════════════════════════════════════
    stages {

        // ── Stage 1: Checkout ────────────────────────────────────────────────
        // Jenkins checks out the exact commit that triggered the build.
        // On a PR it checks out the merge commit automatically.
        stage('Checkout') {
            steps {
                echo "📥 Checking out ${env.BRANCH_NAME} @ ${env.GIT_COMMIT?.take(8)}"
                checkout scm
                // Print workspace path so you can SSH in and debug if needed
                echo "📁 Workspace: ${env.WORKSPACE}"
            }
        }

        // ── Stage 2: Install Node dependencies ───────────────────────────────
        // npm ci is used instead of npm install because:
        //   - It reads package-lock.json exactly (reproducible builds)
        //   - It always does a clean install (no leftover from last build)
        //   - It is faster than npm install in CI environments
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                bat 'npm ci'
                // Confirm tsx is available (used by your pipeline scripts)
                bat 'npx tsx --version'
            }
        }

        // ── Stage 3: Install Playwright Browsers ─────────────────────────────
        // Your config uses chromium only so we install only chromium.
        // --with-deps installs required Windows system libraries.
        // This is cached after the first run — subsequent runs are fast.
        stage('Install Playwright Browsers') {
            steps {
                echo '🌐 Installing Chromium browser...'
                // Only install chromium — matches browserName: chromium in config
                bat 'npx playwright install chromium --with-deps'
            }
        }

        // ── Stage 4: Run Stage Tests ─────────────────────────────────────────
        // Runs all three stage projects in one command.
        // --project flags target ONLY the stage projects from playwright.config.ts:
        //   ae-forms → tests/stage/forms
        //   ae-auth  → tests/stage/auth
        //   stage    → tests/stage/ui
        //
        // Note: auth-setup project is NOT included because stage projects
        // do not have auth-setup in their dependencies (confirmed from your config)
        //
        // || exit 0 at the end prevents Jenkins from immediately failing
        // when tests fail — we want to still publish reports before deciding
        // the build status. The actual pass/fail is set in the post section.
        stage('Run Stage Tests') {
            steps {
                echo '🧪 Running stage tests (ae-forms, ae-auth, stage)...'
                bat '''
                    npx playwright test ^
                        --project=ae-forms ^
                        --project=ae-auth ^
                        --project=stage ^
                        --reporter=html ^
                        --reporter=json ^
                        --reporter=allure-playwright ^
                        2>&1
                '''
            }
            // Even if tests fail, continue to report stages
            post {
                always {
                    echo '📋 Test execution complete — proceeding to reports'
                }
            }
        }

        // ── Stage 5: Generate Allure Report ──────────────────────────────────
        // Allure needs a second step to convert raw results into an HTML report.
        // allure-playwright writes raw JSON to allure-results/
        // allure generate converts that into a viewable HTML site
        //
        // Requires: Allure installed on Jenkins machine
        // Install: npm install -g allure-commandline
        stage('Generate Allure Report') {
            steps {
                echo '📊 Generating Allure report...'
                // Clean previous report then generate fresh
                bat '''
                    if exist allure-report rmdir /s /q allure-report
                    allure generate allure-results --clean -o allure-report
                '''
            }
        }

        // ── Stage 6: Publish HTML Reports ────────────────────────────────────
        // Makes both reports viewable as links on the Jenkins build page.
        // Requires: HTML Publisher plugin installed in Jenkins
        stage('Publish Reports') {
            steps {
                echo '📁 Publishing HTML reports to Jenkins...'

                // Playwright HTML report
                publishHTML(target: [
                    allowMissing         : true,
                    alwaysLinkToLastBuild: true,
                    keepAll              : true,
                    reportDir            : 'playwright-report',
                    reportFiles          : 'index.html',
                    reportName           : 'Playwright Report',
                    reportTitles         : 'Stage Test Results'
                ])

                // Allure HTML report
                publishHTML(target: [
                    allowMissing         : true,
                    alwaysLinkToLastBuild: true,
                    keepAll              : true,
                    reportDir            : 'allure-report',
                    reportFiles          : 'index.html',
                    reportName           : 'Allure Report',
                    reportTitles         : 'Allure Stage Results'
                ])
            }
        }

        // ── Stage 7: Archive Artifacts ────────────────────────────────────────
        // Saves screenshots, videos, traces, and JSON results as downloadable
        // attachments on the Jenkins build page.
        // Videos and screenshots are only generated on failure (per your config)
        // so this will only have content when tests fail — which is exactly when
        // you need them most.
        stage('Archive Artifacts') {
            steps {
                echo '🗄️ Archiving test artifacts...'
                archiveArtifacts(
                    artifacts: [
                        'test-results/**',       // JSON results + JUnit XML
                        'allure-results/**',     // Raw allure data
                        'allure-report/**',      // Generated allure HTML
                        'playwright-report/**',  // Playwright HTML report
                        'tests/stage/**/*.png',  // Screenshots on failure
                        'tests/stage/**/*.webm', // Videos on failure
                        'tests/stage/**/*.zip'   // Traces on failure
                    ].join(', '),
                    allowEmptyArchive: true,
                    fingerprint: true
                )
            }
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // POST — runs after all stages regardless of outcome
    // ════════════════════════════════════════════════════════════════════════
    post {

        // ── On success ───────────────────────────────────────────────────────
        success {
            echo '✅ All stage tests passed.'
            // Set build description visible in Jenkins build list
            script {
                currentBuild.description = "✅ Stage tests passed | ${env.BRANCH_NAME}"
            }
        }

        // ── On failure ───────────────────────────────────────────────────────
        failure {
            echo '❌ Stage tests FAILED.'
            script {
                currentBuild.description = "❌ Stage tests failed | ${env.BRANCH_NAME}"
            }

            // Email notification on failure
            // Requires: Email Extension plugin + SMTP configured in Jenkins
            // Manage Jenkins > System > Extended E-mail Notification
            emailext(
                subject: "❌ FAILED: Stage Tests — ${env.BRANCH_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2 style="color:red">Stage Tests Failed</h2>
                    <table>
                        <tr><td><b>Branch</b></td><td>${env.BRANCH_NAME}</td></tr>
                        <tr><td><b>Build</b></td><td>#${env.BUILD_NUMBER}</td></tr>
                        <tr><td><b>Commit</b></td><td>${env.GIT_COMMIT?.take(8)}</td></tr>
                        <tr><td><b>Duration</b></td><td>${currentBuild.durationString}</td></tr>
                    </table>
                    <br/>
                    <p>
                        <a href="${env.BUILD_URL}Playwright_20Report">
                            View Playwright Report
                        </a>
                        &nbsp;|&nbsp;
                        <a href="${env.BUILD_URL}Allure_20Report">
                            View Allure Report
                        </a>
                        &nbsp;|&nbsp;
                        <a href="${env.BUILD_URL}console">
                            View Console Output
                        </a>
                    </p>
                """,
                mimeType: 'text/html',
                to: 'your-team@yourcompany.com',
                attachLog: false
            )
        }

        // ── On unstable (some tests failed but build continued) ───────────────
        unstable {
            echo '⚠️ Build unstable — some tests failed.'
            script {
                currentBuild.description = "⚠️ Unstable | ${env.BRANCH_NAME}"
            }
        }

        // ── Always — clean workspace ─────────────────────────────────────────
        // Frees disk space after every build.
        // node_modules alone can be 500MB+ — cleaning is important on Windows.
        always {
            echo '🧹 Cleaning workspace...'
            cleanWs(
                cleanWhenSuccess: true,
                cleanWhenFailure: true,
                cleanWhenAborted: true,
                deleteDirs: true,
                // Keep the reports for the current build (already archived above)
                patterns: [[pattern: 'playwright-report/**', type: 'EXCLUDE'],
                           [pattern: 'allure-report/**', type: 'EXCLUDE']]
            )
        }
    }
}
