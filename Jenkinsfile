pipeline {
  agent any

  // Set proxy here if needed (uncomment and fill)
  environment {
    // HTTP_PROXY = 'http://proxy-host:8080'
    // HTTPS_PROXY = 'http://proxy-host:8080'
    // NO_PROXY = 'localhost,127.0.0.1,.yourcompany.local'
    // npm will also honor these env vars
  }

  options {
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install JDK 17 (if needed)') {
      when {
        // Check if java exists; if not, install openjdk-17
        expression { sh(script: 'java -version >/dev/null 2>&1 || echo NOJAVA', returnStatus: true) != 0 }
      }
      steps {
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
      when {
        expression { return env.HTTP_PROXY || env.HTTPS_PROXY }
      }
      steps {
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
        sh '''
          set -eux
          # Prefer reproducible installs
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
        sh 'npx playwright install --with-deps'
      }
    }

    stage('Run Playwright Tests (do not fail build)') {
      steps {
        // Keep pipeline green regardless of test failures (like `|| true`)
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
        // Ensure allure-commandline is available; if not in devDeps, this npx will still try
        sh '''
          set +e
          npx allure generate ./allure-results --clean -o ./allure-report
          # Do not fail if generation returns non-zero
          true
          set -e
        '''
      }
    }
  }

  post {
    always {
      // If you installed the Allure Jenkins Plugin and configured Allure Commandline (Manage Jenkins -> Tools),
      // this will publish the results directory and attach a nice report link to the build.
      allure([
        includeProperties: false,
        jdk: '',
        results: [[path: 'allure-results']]
      ])

      // Also archive the pre-generated static site (optional)
      archiveArtifacts artifacts: 'allure-report/**', fingerprint: true, allowEmptyArchive: true
    }
  }
}