pipeline {
    agent any



    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/shasnainzaidi/playwright-scratch.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install'
            }
        }

        stage('Run Smoke Tests') {
            steps {
                bat 'npx playwright test --project=smoke'
            }
        }

        stage('Run Regression Tests') {
            when {
                branch 'main'
            }
            steps {
                bat 'npx playwright test --project=regression'
            }
        }

        stage('Publish HTML Report') {
            steps {
                publishHTML([
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report'
                ])
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}