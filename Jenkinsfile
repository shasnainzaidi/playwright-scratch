
pipeline {

    agent any

    
    environment {

        CI = 'true'
        AE_URL = credentials('AE_URL')
        BASE_URL = credentials('BASE_URL')
        NODE_VERSION = '18'
        ALLURE_RESULTS = 'allure-results'
        PLAYWRIGHT_REPORT_DIR = 'playwright-report'
        TEST_RESULTS_DIR      = 'test-results'
        BUILD_LABEL = "Stage Tests — ${env.BRANCH_NAME} #${env.BUILD_NUMBER}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timeout(time: 45, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()

    }
    triggers {
        githubPush()
    }
    stages {
        stage('Checkout') {
            steps {
                echo "📥 Checking out ${env.BRANCH_NAME} @ ${env.GIT_COMMIT?.take(8)}"
                checkout scm
                echo "📁 Workspace: ${env.WORKSPACE}"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                bat 'npm ci'
                // Confirm tsx is available (used by your pipeline scripts)
                bat 'npx tsx --version'
            }
        }


        stage('Install Playwright Browsers') {
            steps {
                echo '🌐 Installing Chromium browser...'

                bat 'npx playwright install chromium --with-deps'
            }
        }

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
            post {
                always {
                    echo '📋 Test execution complete — proceeding to reports'
                }
            }
        }


        stage('Generate Allure Report') {
            steps {
                echo '📊 Generating Allure report...'
                bat '''
                    if exist allure-report rmdir /s /q allure-report
                    allure generate allure-results --clean -o allure-report
                '''
            }
        }

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

    post {

        // ── On success ───────────────────────────────────────────────────────
        success {
            echo '✅ All stage tests passed.'

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
