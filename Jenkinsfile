pipeline {
    agent any

    tools {
        nodejs "Node18"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'YOUR_REPO_URL'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Auth Setup') {
            steps {
                sh 'npx playwright test --project=email-auth'
                sh 'npx playwright test --project=phone-auth'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test'
            }
        }

        stage('Allure Report') {
            steps {
                allure includeProperties: false,
                       jdk: '',
                       results: [[path: 'allure-results']]
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**'
        }
    }
}
