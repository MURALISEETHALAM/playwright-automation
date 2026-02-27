pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '25'))
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Verify Node & NPM') {
      steps {
        bat 'node -v'
        bat 'npm -v'
      }
    }

    stage('Install Dependencies') {
      steps {
        // Reproducible install if you have package-lock.json
        bat 'if exist package-lock.json (npm ci) else (npm install)'
        // Ensure Playwright Test is present
        bat 'npm ls @playwright/test || npm i -D @playwright/test'
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        // For Windows, no --with-deps
        bat 'npx playwright install'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        // If reporters are already set in playwright.config, you can drop --reporter here
        bat 'npx playwright test --reporter=list,junit'
      }
      post {
        always {
          // Adjust the test results path if your config writes elsewhere
          junit testResults: 'test-results/**/*.xml', allowEmptyResults: true
          archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true, onlyIfSuccessful: false
        }
      }
    }

    stage('Publish HTML Report') {
      when { expression { fileExists('playwright-report/index.html') } }
      steps {
        publishHTML(target: [
          reportDir: 'playwright-report',
          reportFiles: 'index.html',
          reportName: 'Playwright Report',
          keepAll: true,
          alwaysLinkToLastBuild: true,
          allowMissing: true
        ])
      }
    }
  }

  post {
    success { echo 'Playwright tests passed.' }
    failure { echo 'Playwright tests failed. Check console & reports.' }
    always  { echo "Build completed at: ${new Date()}" }
  }
}