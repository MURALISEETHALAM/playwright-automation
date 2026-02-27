pipeline {
  agent any

  tools {
    nodejs 'Node18' // Must exist under Manage Jenkins -> Global Tool Configuration -> NodeJS
  }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '20'))
    // skipDefaultCheckout() // optional; if you enable this, keep the explicit checkout stage
  }

  stages {
    stage('Checkout') {
      steps {
        // Uses your HTTPS + PAT credentials
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
        // On Windows, do NOT use --with-deps
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
        // Requires Allure Jenkins Plugin and Allure Commandline tool configured
        allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'allure-results/**, test-results/**, playwright-report/**', allowEmptyArchive: true
      // If you also emit JUnit XML, uncomment:
      // junit 'test-results/**/*.xml'
    }
    failure {
      echo 'Build failed. Check logs and archived artifacts.'
    }
  }
}