pipeline {
    agent any

    stages {

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t machinetest-backend ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t machinetest-frontend ./frontend/frontend-proj'
            }
        }

        stage('Run Backend Container') {
            steps {
                sh 'docker run -d -p 5000:5000 machinetest-backend'
            }
        }

        stage('Run Frontend Container') {
            steps {
                sh 'docker run -d -p 3000:3000 machinetest-frontend'
            }
        }

        stage('Check Containers') {
            steps {
                sh 'docker ps'
            }
        }
    }
}