#!/usr/bin/env bash

FROM_BRANCH=true
BRANCH_NAME=may_debug_and_Docker_Start;
API_PORT=8081
FRONTEND_PORT=80
ALT_PORT=8080

portCheck(){
if [ -z "$(sudo netstat -tupln | grep 80)" ];
then
    echo notinuse;
else
    echo inuse;
fi
}

installDocker(){
    if hash docker 2>/dev/null; then
    echo "Docker present"
    else
        sudo apt-get update
        sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
   sudo apt-get update
   sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    fi
}

installDockerCompose(){
    if hash docker-compose 2>/dev/null; then
      echo "Docker Compose present"
    else
      sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
      sudo chmod +x /usr/local/bin/docker-compose
      echo docker-compose --version
    fi
}

checkoutRepo(){
git clone https://github.com/MyEtherWallet/simplex-api.git;
cd simplex-api;
if [ $FROM_BRANCH = "true" ]; then
  echo "Checking out branch ${BRANCH_NAME}"
  git checkout origin/${BRANCH_NAME};
  git checkout -b ${BRANCH_NAME};
fi
}


purgeDocker(){
  echo "Purging Prior Dockers"
    sudo docker stop $(sudo docker ps -a -q)
    sudo docker rm $(sudo docker images -a -q)
}


buildDockerImages(){
    echo $PWD
    cp ../.env ./
    cd api;
    cp ../.env ./
    sudo docker build --rm --tag=simplex-api .
    cd ../
    cd frontend;
    cp ../.env ./
    sudo docker build --rm --tag=simplex-frontend .
    cd ../
}

installDocker
installDockerCompose

if [ -f ".env" ]; then
  echo "env file exists"
  if [ -d "simplex-api" ]; then
    echo "exists"
    purgeDocker
    rm -rf ./simplex-api/
    checkoutRepo
    buildDockerImages
    sudo docker-compose up -d --remove-orphans
  else
    echo "does not exist"
    checkoutRepo
  fi
else
  echo "ERROR: failed to begin setup. .env file does not exist"
fi

