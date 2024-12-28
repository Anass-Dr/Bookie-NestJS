pipeline {
    agent any
    
    environment {
        EC2_HOST = 'ec2-3-72-61-57.eu-central-1.compute.amazonaws.com'
        EC2_USER = 'ubuntu'
        GITHUB_REPO = 'https://github.com/Anass-Dr/Bookie-NestJS.git'
        BRANCH = 'develop'
        DEPLOY_DIR = 'Bookie-NestJS'
    }

    stages {
        stage('Deploy to EC2') {
            steps {
                script {
                    def remote = [:]
                    remote.name = 'ec2-server'
                    remote.host = EC2_HOST
                    remote.user = EC2_USER
                    remote.allowAnyHosts = true
                    
                    // Use Jenkins credentials for SSH key
                    withCredentials([sshUserPrivateKey(credentialsId: 'BookieBackendEC2Key', keyFileVariable: 'identity')]) {
                        remote.identityFile = identity
                        
                        // SSH commands using the plugin syntax
                        sshCommand remote: remote, command: """
                            cd ${DEPLOY_DIR}
                            git pull origin ${BRANCH}
                            npm install
                            npm run build
                            pm2 restart nestjs-app
                        """
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Successfully deployed to EC2 instance'
        }
        failure {
            echo 'Deployment failed'
        }
    }
}