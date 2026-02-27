pipeline {
  agent any
  stages {
    stage('DEBUG') {
      steps {
        echo "📌 DEBUG: This is the Jenkinsfile from MAIN branch!"
        bat "echo Hello from Jenkinsfile && dir"
      }
    }
  }
}