pipeline {
  agent any

  tools {
    nodejs 'Node18' // Ensure this is defined in Manage Jenkins -> Global Tool Configuration -> NodeJS
  }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '20'))
    // skipDefaultCheckout() // leave commented for now to keep default behavior simple
  }

  stages {
    stage('Checkout') {
      steps {
        // Explicit checkout ensures the workspace has the code
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: 'https://github.com/MURALISEETHALAM/playwright-automation.git',
            credentialsId: 'github-https-credentials'
          ]]
        ])
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
        bat 'npm ci'
        bat 'npx playwright install' // no --with-deps on Windows
      }
    }

    stage('Run Tests') {
      steps {
        // Ensure allure-playwright is enabled in your playwright.config.ts
        // reporter: [['line'], ['allure-playwright']]
        bat 'npx playwright test'
      }
    }

    stage('Allure Report') {
      steps {
        // Requires Allure Jenkins plugin + Allure Commandline configured
        allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'allure-results/**, test-results/**, playwright-report/**', allowEmptyArchive: true
    }
  }
}