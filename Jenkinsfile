pipeline {
  agent any
  options { timestamps() }

  stages {

    stage('Checkout') {
      steps {
        echo "Checking out code..."
        checkout scm
        powershell 'Write-Host "WORKSPACE = $pwd"; Get-ChildItem -Force'
      }
    }

    stage('Install Node Modules') {
      steps {
        powershell '''
          Write-Host "Installing dependencies..."
          if (Test-Path package-lock.json) {
            npm ci
          } else {
            npm install
          }
        '''
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        powershell '''
          Write-Host "Installing Playwright browsers..."
          npx playwright install
        '''
      }
    }

    stage('Run Playwright Tests') {
      steps {
        powershell '''
          Write-Host "Running Playwright tests..."
          $global:LASTEXITCODE = 0
          npx playwright test
          if ($LASTEXITCODE -ne 0) {
            Write-Host "Tests failed but continuing pipeline."
            $global:LASTEXITCODE = 0
          }
        '''
      }
    }

    stage('Generate Allure Report') {
      steps {
        powershell '''
          Write-Host "Generating Allure report..."
          npx allure generate ./allure-results --clean -o ./allure-report
          if ($LASTEXITCODE -ne 0) {
            Write-Host "Allure generation had issues but continuing."
            $global:LASTEXITCODE = 0
          }
        '''
      }
    }
  }

  post {
    always {
      echo "Publishing Allure Results..."

      allure([
        includeProperties: false,
        jdk: '',
        results: [[path: 'allure-results']]
      ])

      archiveArtifacts artifacts: 'allure-report/**', fingerprint: true, allowEmptyArchive: true
    }
  }
}