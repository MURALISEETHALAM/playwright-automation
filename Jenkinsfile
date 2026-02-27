pipeline {
  agent { label 'windows' }  // <-- Use the label you set in Step 1. If you didn't set one, use: agent any
  options { timestamps() }

  stages {

    stage('Checkout') {
      steps {
        echo "Checking out code..."
        checkout scm
        powershell 'Write-Host "WORKSPACE = $pwd"; Get-ChildItem -Force'
      }
    }

    stage('Install Dependencies') {
      steps {
        powershell '''
          Write-Host "Installing dependencies..."
          if (Test-Path package-lock.json) { npm ci } else { npm install }
        '''
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        powershell 'npx playwright install'
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
      // Requires Allure Jenkins Plugin installed & configured (Manage Jenkins → Plugins / Tools)
      allure([
        includeProperties: false,
        jdk: '',
        results: [[path: 'allure-results']]
      ])
      archiveArtifacts artifacts: 'allure-report/**', fingerprint: true, allowEmptyArchive: true
    }
  }
}