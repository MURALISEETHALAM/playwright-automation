pipeline {
  agent any
  options { timestamps() }

  stages {
    stage('Probe') {
      steps {
        echo "Hello from Jenkins on ${env.NODE_NAME}"
        // Try Linux command first; if not present, try Windows
        sh 'uname -a || ver || true'
      }
    }
  }

  post {
    always {
      echo 'Post block executed'
    }
  }
}