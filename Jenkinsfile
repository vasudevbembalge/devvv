pipeline {
    agent any

    stages {

        stage('Build Backend Image') {
            steps {
                bat 'docker build -t machinetest-backend ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat 'docker build -t machinetest-frontend ./frontend/frontend-proj'
            }
        }

        stage('Run Backend Container') {
            steps {
                bat 'docker rm -f machinetest-backend-run || exit 0'
                bat 'docker run -d --name machinetest-backend-run -p 4000:4000 machinetest-backend'
            }
        }

        stage('Run Frontend Container') {
            steps {
                bat 'docker rm -f machinetest-frontend-run || exit 0'
                bat 'docker run -d --name machinetest-frontend-run -p 3000:5173 machinetest-frontend'
            }
        }

        stage('Check Containers') {
            steps {
                bat 'docker ps'
            }
        }
    }
}