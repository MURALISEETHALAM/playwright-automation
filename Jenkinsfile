pipeline {
  agent any
  options { timestamps() }

  // Optional: set these as Jenkins job env vars if behind proxy
  environment {
    // HTTP_PROXY = 'http://proxy-host:8080'
    // HTTPS_PROXY = 'http://proxy-host:8080'
    // NO_PROXY = 'localhost,127.0.0.1,.yourcompany.local'
  }

  stages {
    stage('Checkout') {
      steps {
        echo 'Checking out SCM...'
        checkout scm
        sh 'echo "Workspace: $(pwd)"; ls -la || true'
      }
    }

    stage('Install JDK 17 (if needed)') {
      when {
        expression { sh(script: 'java -version >/dev/null 2>&1', returnStatus: true) != 0 }
      }
      steps {
        echo 'Installing OpenJDK 17...'
        sh '''
          set -eux
          if ! command -v sudo >/dev/null 2>&1; then
            apt-get update
            apt-get install -y openjdk-17-jre-headless
          else
            sudo apt-get update
            sudo apt-get install -y openjdk-17-jre-headless
          fi
          java -version
        '''
      }
    }

    stage('Configure npm proxy (optional)') {
      when { expression { return env.HTTP_PROXY || env.HTTPS_PROXY } }
      steps {
        echo 'Configuring npm proxy...'
        sh '''
          set -eux
          if [ -n "${HTTP_PROXY:-}" ]; then npm config set proxy "$HTTP_PROXY"; fi
          if [ -n "${HTTPS_PROXY:-}" ]; then npm config set https-proxy "$HTTPS_PROXY"; fi
          npm config get proxy || true
          npm config get https-proxy || true
        '''
      }
    }

    stage('Install Dependencies') {
      steps {
        echo 'Installing npm dependencies...'
        sh '''
          set -eux
          if [ -f package-lock.json ]; then
            npm ci
          else
            npm install
          fi
        '''
      }
    }

    stage('Install Playwright Browsers + Deps') {
      steps {
        echo 'Installing Playwright browsers & OS deps...'
        sh 'npx playwright install --with-deps'
      }
    }

    stage('Run Playwright Tests (do not fail build)') {
      steps {
        echo 'Running Playwright tests...'
        sh '''
          set +e
          npx playwright test
          EXIT_CODE=$?
          echo "Playwright exit code: $EXIT_CODE"
          set -e
        '''
      }
    }

    stage('Generate Allure Report (static)') {
      steps {
        echo 'Generating Allure static report...'
        sh '''
          set +e
          npx allure generate ./allure-results --clean -o ./allure-report
          true
          set -e
        '''
      }
    }
  }

  post {
    always {
      echo 'Publishing Allure results & archiving static report...'
      // Requires Allure Jenkins Plugin + Allure Commandline tool configured under Manage Jenkins -> Tools
      allure([
        includeProperties: false,
        jdk: '',
        results: [[path: 'allure-results']]
      ])

      archiveArtifacts artifacts: 'allure-report/**', fingerprint: true, allowEmptyArchive: true
    }
  }
}