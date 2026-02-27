pipeline {
  agent any
  stages {
    stage('Smoke') {
      steps {
        echo 'If you see this, Jenkins is reading THIS Jenkinsfile from main.'
        bat 'echo Running on Windows && ver'
      }
    }
  }
}