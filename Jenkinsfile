pipeline {
  agent { label 'built-in' }     // uses your Windows Built-In node (label seen in your screenshot)
  options { timestamps() }
  stages {
    stage('Probe') {
      steps {
        echo "About to run on: ${env.NODE_NAME}"
        bat 'ver & echo USER=%USERNAME% & echo WORKDIR=%CD% & dir'
      }
    }
  }
}