pipeline {
  agent any

  environment {
    # If you need proxy, set here, e.g.:
    # HTTP_PROXY = 'http://proxy:8080'
    # HTTPS_PROXY = 'http://proxy:8080'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install JDK 17 (if needed)') {
      when {
        expression { return sh(script: 'java -version >/dev/null 2>&1 || echo NOJAVA', returnStatus: true) != 0 }
      }
      steps {
        sh '''
          sudo apt-get update
          sudo apt-get install -y openjdk-17-jre-headless
          java -version
        '''
      }
    }

    stage('Install Dependencies') {
      steps {
        sh '''
          npm ci || npm install
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
        // Run tests but keep pipeline green like `|| true`
        sh '''
          set +e
          npx playwright test
          echo "Exit code: $?"
          set -e
        '''
      }
    }

    stage('Generate Allure Report') {
      steps {
        // Use local dev dependency: allure-commandline (optional)
        // If not installed, you can do: npm i -D allure-commandline --no-save
        sh '''
          npx allure generate ./allure-results --clean -o ./allure-report || true
        '''
      }
    }
  }

  post {
    always {
      // Publish via Allure Plugin (reads allure-results, not the generated site)
      allure([
        includeProperties: false,
        jdk: '',
        results: [[path: 'allure-results']]
      ])

      // Also archive the static site (optional)
      archiveArtifacts artifacts: 'allure-report/**', fingerprint: true, allowEmptyArchive: true
    }
  }
}