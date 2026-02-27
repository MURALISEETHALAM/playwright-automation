pipeline {
  agent any
  options { timestamps() }

  stages {
    stage('Checkout') {
      steps {
        echo 'Checking out code...'
        checkout scm
        powershell 'Write-Host "WORKSPACE = $pwd"; Get-ChildItem'
      }
    }

    stage('Install Node Modules') {
      steps {
        powershell '''
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
        powershell 'npx playwright install'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        powershell '''
          $global:LASTEXITCODE = 0
          npx playwright test
          if ($LASTEXITCODE -ne 0) {
            Write-Host "Tests failed but pipeline will not stop."
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
            Write-Host "Allure generation non-zero, continuing..."
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