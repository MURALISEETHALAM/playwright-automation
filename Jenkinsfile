pipeline {
  agent any

  tools {
    nodejs 'Node18'            // Configure this name in Global Tool Configuration
    // Optional: JDK for Allure if needed
  }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    // If you use npm config or proxies, set here
    // PLAYWRIGHT_BROWSERS_PATH = "${env.WORKSPACE}/.cache/ms-playwright"
  }

  stages {
    stage('Checkout') {
      steps {
        // If you prefer to skip default checkout, add: options { skipDefaultCheckout() }
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: 'https://github.com/MURALISEETHALAM/playwright-automation.git',
            credentialsId: 'github-https-credentials' // username + PAT (not SSH)
          ]]
        ])
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'node -v || echo "Node should be provided by Jenkins NodeJS tool"'
        bat 'npm ci'
        // If this is the first time or on fresh agents:
        bat 'npx playwright install --with-deps'
      }
    }

    stage('Run Tests') {
      steps {
        // Ensure your Playwright config is set to output allure-results
        // either via reporter config or CLI args (see Option B below)
        bat 'npx playwright test'
      }
    }

    stage('Allure Report') {
      steps {
        // Publish allure-results from workspace
        allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'allure-results/**, test-results/**, playwright-report/**', allowEmptyArchive: true
      junit 'test-results/**/*.xml' // if you also produce JUnit XML
    }
  }
}