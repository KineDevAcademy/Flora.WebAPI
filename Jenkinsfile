// Common Defs
println "BUILD_TAG: " + BUILD_TAG
println "BRANCH_NAME: " + BRANCH_NAME
println "JOB_NAME: " + JOB_NAME
println "JOB_BASE_NAME " + JOB_BASE_NAME
println "BUILD_NUMBER: " + BUILD_NUMBER

GIT_SERVER = 'https://git.logrypr.com.br'
GIT_USER_CREDENTIALS = 'cicd-username'
NEXUS_USER_CREDENTIALS = 'uploader-username'
APP_NAME = 'flora.api'
DEV_PATH = 'flora'
BUILD_TARGET = ['dev', 'hom']
DEPLOY_TARGET = ['hom']
DEPLOY_FILES = "hello" // Don't put environment dependent files here
ARTIFACT_SERVER = "https://nexus.logrypr.com.br/repository/flora/${APP_NAME}/"
//

switch(JOB_BASE_NAME) {
  case 'dev':
    ENVIRONMENT = 'dev'
    DEPLOY_SERVER = 'debian-frontend'
    APP_PATH = '/var/www/html/'
    RELEASE_PATH = '/data/release/node'
    TEMP_PATH="/data/temp/${ENVIRONMENT}"
    SITE_URL = "https://flora.finance/"
  break
  case 'hom':
    ENVIRONMENT = 'hom'
    DEPLOY_SERVER = 'debian-frontend'
    APP_PATH = '/var/www/html/'
    RELEASE_PATH = '/data/release/node'
    TEMP_PATH="/data/temp/${ENVIRONMENT}"
    SITE_URL = "https://flora.finance"
  break
}

//
// Do not edit after this line
//

 node('debian-frontend') {
    if (BRANCH_NAME in BUILD_TARGET) {
      wipeAllFiles()
      prepareSCM()
      sonarQuality()
      startBuild()
    }
}

def wipeAllFiles() {
    stage('Clean Workspace') {
      cleanWs()
    }
}

def prepareSCM() {
    stage('Get Sources') {
      git([url: "${GIT_SERVER}/${DEV_PATH}/${APP_NAME}.git", branch: "${BRANCH_NAME}", credentialsId: "${GIT_USER_CREDENTIALS}"])
    }
}

def sonarQuality() {
    stage('Check Quality') {
      withSonarQubeEnv('SonarQube EunaRede') {
        sh "/opt/sonar-scanner/bin/sonar-scanner"
      }
    }

    stage("Quality Gate") {
      timeout(time: 5, unit: 'MINUTES') {
        def qualityGate = waitForQualityGate()
        if (qualityGate.status != 'OK') {
          error "O código não está de acordo com as regras do Sonar: ${qualityGate.status}"
        }
      }
    }
}

def startBuild() {
    stage("Build the code") {
      sh """
      export PATH=$PATH:/var/lib/jenkins/.nvm/versions/node/v10.24.1/bin
      npm install
      npm start
      """
    }
}
