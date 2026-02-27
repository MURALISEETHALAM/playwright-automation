pipeline {
    agent any

    tools {
        nodejs "NodeJS_18"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://bitbucket.org/playwright-automation-test/playwright-automation.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Install Playwright') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test || true'
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh 'npx allure generate ./allure-results --clean -o ./allure-report || true'
            }
        }

        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'allure-report/**'
            }
        }
    }
}