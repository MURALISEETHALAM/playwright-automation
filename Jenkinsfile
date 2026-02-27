pipeline {
  agent any

  // tools { nodejs 'Node18' } // Optional: if using NodeJS plugin

  environment {
    // For caching browsers across builds:
    // PLAYWRIGHT_BROWSERS_PATH = '.playwright-browsers'
    // PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1'
  }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '25'))
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Verify Node & NPM') {
      steps {
        sh 'node -v'
        sh 'npm -v'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'if [ -f package-lock.json ]; then npm ci; else npm install; fi'
        sh 'npm ls @playwright/test || npm i -D @playwright/test'
      }
    }

    stage('Install Playwright Browsers + Deps') {
      steps {
        // Install Playwright browsers and system deps (Linux-only flag)
        sh 'npx playwright install --with-deps'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npx playwright test --reporter=list,junit'
      }
      post {
        always {
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
    success { echo '✅ Playwright tests passed.' }
    failure { echo '❌ Playwright tests failed.' }
  }
}