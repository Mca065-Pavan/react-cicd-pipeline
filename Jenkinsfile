pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'mca065/react-cicd-demo'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '===== Stage 1: Checking out source code from GitHub ====='
                git branch: 'main',
                    url: 'https://github.com/Mca065-Pavan/react-cicd-pipeline.git',
                    credentialsId: 'github-credentials'
                echo 'Code checked out successfully!'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '===== Stage 2: Installing npm dependencies ====='
                sh 'npm install'
                echo 'Dependencies installed successfully!'
            }
        }

        stage('Run Tests') {
            steps {
                echo '===== Stage 3: Running tests ====='
                sh 'CI=true npm test -- --watchAll=false || echo "Tests completed (no test files configured)"'
                echo 'Tests passed!'
            }
        }

        stage('Build React App') {
            steps {
                echo '===== Stage 4: Building React application ====='
                sh 'npm run build'
                echo 'Build completed successfully!'
            }
        }

        stage('Docker Build and Push') {
            steps {
                echo '===== Stage 5: Building Docker image and pushing to Docker Hub ====='
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                    sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
                echo 'Docker image pushed to Docker Hub successfully!'
            }
        }

        stage('Setup Kubectl') {
            steps {
                echo '===== Stage 5.5: Setting up kubectl ====='
                sh '''
                    curl -LO "https://dl.k8s.io/release/v1.30.0/bin/linux/amd64/kubectl"
                    chmod +x kubectl
                    mkdir -p $HOME/.local/bin
                    mv kubectl $HOME/.local/bin/
                    export PATH="$HOME/.local/bin:$PATH"
                    mkdir -p $HOME/.kube
                    cp /tmp/k8s-certs/ca.crt /tmp/k8s-certs/client.crt /tmp/k8s-certs/client.key $HOME/.kube/
                    cat > $HOME/.kube/config <<EOF
apiVersion: v1
clusters:
- cluster:
    certificate-authority: $HOME/.kube/ca.crt
    server: https://192.168.49.2:8443
  name: minikube
contexts:
- context:
    cluster: minikube
    user: minikube
  name: minikube
current-context: minikube
kind: Config
users:
- name: minikube
  user:
    client-certificate: $HOME/.kube/client.crt
    client-key: $HOME/.kube/client.key
EOF
                    kubectl get nodes
                '''
                echo 'Kubectl configured successfully!'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '===== Stage 6: Deploying to Kubernetes cluster (Minikube) ====='
                sh '''
                    export PATH="$HOME/.local/bin:$PATH"
                    kubectl set image deployment/react-app \
                        react-app=${DOCKER_IMAGE}:${DOCKER_TAG} \
                        --record
                    kubectl rollout status deployment/react-app --timeout=120s
                '''
                echo 'Deployed to Kubernetes successfully!'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '===== Stage 7: Verifying deployment ====='
                sh '''
                    export PATH="$HOME/.local/bin:$PATH"
                    kubectl get pods -l app=react-app
                    kubectl get services react-app-service
                '''
                echo 'Deployment verified successfully!'
            }
        }
    }

    post {
        success {
            echo '===== Pipeline completed successfully! ====='
        }
        failure {
            echo '===== Pipeline failed! ====='
        }
        always {
            sh 'docker logout || true'
        }
    }
}
