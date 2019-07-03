#!/usr/bin/env bash
#*********************************************************
# To use this script to setup the environment and service
# place it in the same directory as your .env file
#*********************************************************

# Setup options:
# Use a branch other than master
FROM_BRANCH=true
# The name of the branch to use
BRANCH_NAME=may_debug_and_Docker_Start;


# defaults
RESTART_VAR='false'
STOP_DOCKER='false'
FLAGGED='false'
PURGE_DOCKER='false'
REBUILD_RESTART='false'

POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -r|--restart)
    RESTART_VAR='true'
    FLAGGED='true'
    shift # past argument
    ;;
    -s|--stop-docker)
    STOP_DOCKER='true'
    FLAGGED='true'
    shift # past argument
    ;;
    -p|--purge-docker)
    PURGE_DOCKER='true'
    FLAGGED='true'
    shift # past argument
    ;;
    -b|--rebuild-restart-docker)
    REBUILD_RESTART='true'
    FLAGGED='true'
    shift # past argument
    ;;
    -h|--help)
    HELP='true'
    shift # past argument
    ;;
    --default)
    DEFAULT=YES
    shift # past argument
    ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

usage(){
echo "usage: setup.sh [optional flag]"
echo " flags: (Note: only one may be used at a time)"
echo " -r | --restart : stop docker and run docker-compose "
echo " -s | --stop-docker : stop all docker containers"
echo " -p | --purge-docker : stop and remove all docker containers"
echo " -b | --rebuild-restart-docker : remove docker containers, rebuild and run docker-compose"
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
      echo sudo docker-compose --version
    fi
}

checkoutRepo(){
echo "Checking out simplex-api"
git clone https://github.com/MyEtherWallet/simplex-api.git;
cd simplex-api;
if [ $FROM_BRANCH = "true" ]; then
  echo "Checking out branch ${BRANCH_NAME}"
  git checkout origin/${BRANCH_NAME};
  git checkout -b ${BRANCH_NAME};
fi
}

stopDocker(){
  echo "Stopping Docker Containers"
  #  sudo docker stop $(sudo docker ps -a -q)
  sudo docker stop "frontend"
  sudo docker stop "api"
  sudo docker stop "nginx"
  sudo docker stop "mongo_db"
}


purgeDocker(){
  stopDocker
  echo "Removing Docker Containers"
#  sudo docker rm $(sudo docker ps -a -q)
  sudo docker rm "frontend"
  sudo docker rm "api"
  sudo docker rm "nginx"
  sudo docker rm "mongo_db"
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
    sudo docker build --rm  --tag=simplex-frontend .
    cd ../
}

createDataDirectory(){
  if [ -d "dbdata" ]; then
    echo "data directory exists"
  else
    echo "making data directory"
    mkdir dbdata
  fi
}

if [ "$HELP" == 'true' ]; then
    usage
    exit 0
fi

installDocker
installDockerCompose

if [ "$RESTART_VAR" = 'true' ]; then

echo ${RESTART_VAR}
    stopDocker
    sudo docker-compose up -d --remove-orphans
fi

if [ "$REBUILD_RESTART" = 'true' ]; then
    purgeDocker
    cd simplex-api;
    buildDockerImages
    sudo docker-compose up -d --remove-orphans
fi

if [ "$STOP_DOCKER" == 'true' ]; then
stopDocker
fi

if [ "$PURGE_DOCKER" == 'true' ]; then
purgeDocker
fi

if [ "$FLAGGED" == 'true' ]; then
    exit 0
fi

echo "Will stop and remove Docker containers, clone repo, build and restart docker."
echo "Press any key to abort:"

read -t 3 -n 1 SHOULD_ABORT

if [ $? == 0 ]; then
    echo ' '
    echo "Aborting Setup"
    exit 0
fi

if [ -f ".env" ]; then
  echo "env file exists"
  createDataDirectory
  if [ -d "simplex-api" ]; then
    purgeDocker
    echo "prior simplex-api dir exists"
    rm -rf ./simplex-api/
    checkoutRepo
    buildDockerImages
    sudo docker-compose up -d --remove-orphans
  else
    echo "prior simplex-api dir does not exist"
    checkoutRepo
    buildDockerImages
    sudo docker-compose up -d --remove-orphans
  fi
else
  echo "ERROR: failed to begin setup. .env file does not exist"
fi



