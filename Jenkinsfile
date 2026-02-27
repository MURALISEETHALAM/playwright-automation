pipeline {
  agent any

  tools {
    nodejs 'Node18' // Must exist in Manage Jenkins -> Global Tool Configuration -> NodeJS
  }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '20'))
    skipDefaultCheckout() // prevent implicit SCM checkout since we do an explicit one
  }

  environment {
    // Optional: cache Playwright browsers under workspace to speed up
    // PLAYWRIGHT_BROWSERS_PATH = "${env.WORKSPACE}\\.cache\\ms-playwright"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: 'https://github.com/MURALISEETHALAM/playwright-automation.git',
            credentialsId: 'github-https-credentials' // Username + PAT (not SSH)
          ]]
        ])
      }
    }

    stage('Verify Node & NPM') {
      steps {
        // Windows-friendly; 'sh' would fail
        bat 'node -v'
        bat 'npm -v'
      }
    }

    stage('Install Dependencies') {
      steps {
        // Clean reproducible install
        bat 'npm ci'

        // Install Playwright browsers (Windows: do NOT use --with-deps)
        bat 'npx playwright install'
      }
    }

    stage('Run Tests') {
      steps {
        // Ensure your Playwright config enables Allure reporter
        // (reporter: [['line'], ['allure-playwright']]) or pass via CLI below
        // Example using config reporters:
        bat 'npx playwright test'

        // If you prefer CLI reporters instead of config, use:
        // bat 'npx playwright test --reporter=line,allure-playwright'
      }
    }

    stage('Allure Report') {
      steps {
        // Publishes 'allure-results' if present
        allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
      }
    }
  }

  post {
    always {
      // Archive useful outputs. Allow empty to avoid build failures if folder missing.
      archiveArtifacts artifacts: 'allure-results/**, test-results/**, playwright-report/**', allowEmptyArchive: true

      // If you also output JUnit XML (e.g., via junit reporter or conversion), publish it:
      // junit 'test-results/**/*.xml'
    }
    failure {
      echo 'Build failed. Check console logs and artifacts for details.'
    }
  }
}
``