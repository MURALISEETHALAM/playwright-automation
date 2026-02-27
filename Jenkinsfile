pipeline {
  agent any

  // If you use NodeJS plugin, uncomment and configure "Node18" in Global Tool Configuration.
  // tools { nodejs 'Node18' }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '25'))
  }

  stages {
    stage('Checkout') {
      steps {
        // If this Jenkinsfile is in the same repo, "checkout scm" is enough.
        checkout scm
      }
    }

    stage('Verify Node and NPM') {
      steps {
        bat 'node -v'
        bat 'npm -v'
      }
    }

    stage('Install Dependencies') {
      steps {
        // Prefer reproducible installs if you have package-lock.json
        bat 'if exist package-lock.json (npm ci) else (npm install)'
        // Ensure Playwright Test is installed (safe to run every time)
        bat 'npm ls @playwright/test || npm i -D @playwright/test'
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        // For Windows, do not use --with-deps
        bat 'npx playwright install'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        // If you configured reporters in playwright.config, you can drop the --reporter option.
        bat 'npx playwright test --reporter=list,junit'
      }
      post {
        always {
          // Adjust to your JUnit output path if set in playwright.config
          junit testResults: 'test-results/**/*.xml', allowEmptyResults: true
          // Archive HTML report if you generate it
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
    failure { echo 'Playwright tests failed. Check console and reports.' }
    always  { echo "Build completed at: ${new Date()}" }
  }
}
