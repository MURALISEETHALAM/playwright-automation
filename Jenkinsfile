pipeline {
  agent any

  tools {
    nodejs 'Node18' // Ensure this name exists in Manage Jenkins -> Global Tool Configuration -> NodeJS
  }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '20'))
    skipDefaultCheckout() // prevent implicit checkout since we do an explicit checkout
  }

  environment {
    // Optional: cache Playwright browsers to speed up builds on the agent
    // PLAYWRIGHT_BROWSERS_PATH = "${env.WORKSPACE}\\.cache\\ms-playwright"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: 'https://github.com/MURALISEETHALAM/playwright-automation.git',
            credentialsId: 'github-https-credentials' // Username + PAT
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
        // On Windows, don't use --with-deps (Linux-only)
        bat 'npx playwright install'
      }
    }

    stage('Run Tests') {
      steps {
        // Ensure allure reporter is enabled in playwright.config.ts:
        // reporter: [['line'], ['allure-playwright']]
        // Or pass via CLI: bat 'npx playwright test --reporter=line,allure-playwright'
        bat 'npx playwright test'
      }
    }

    stage('Allure Report') {
      steps {
        // Requires Allure Jenkins plugin + Allure Commandline configured in Global Tool Configuration
        allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'allure-results/**, test-results/**, playwright-report/**', allowEmptyArchive: true
      // Uncomment if you also generate JUnit XML files:
      // junit 'test-results/**/*.xml'
    }
    failure {
      echo 'Build failed. Check console logs and artifacts for details.'
    }
  }
}