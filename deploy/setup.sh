#!/usr/bin/env bash
#*********************************************************
# To use this script to setup the environment and service
# place it in the same directory as your .env file
#*********************************************************

# Setup options:
GIT_URL=https://github.com/MyEtherWallet/simplex-api.git
DOCKER_COMPOSE_VERSION=1.24.0
ENV_FILE='.env'
CURRENCY_FILE='currencyConfig.js'

# GIT options
# Use a branch other than master
FROM_BRANCH=true
# The name of the branch to use
BRANCH_NAME=add-cad-and-jpy;

# defaults
RESTART_VAR='false'
STOP_DOCKER='false'
START_DOCKER='false'
FLAGGED='false'
PURGE_DOCKER='false'
PURGE_IMAGES='false'
REBUILD_RESTART='false'
RUN_ALL='false'
NO_CACHE='false'

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
    -st|--start-docker)
    START_DOCKER='true'
    FLAGGED='true'
    shift # past argument
    ;;
    -p|--purge-docker)
    PURGE_DOCKER='true'
    FLAGGED='true'
    shift # past argument
    ;;
    -pi|--purge-images)
    PURGE_IMAGES='true'
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
    -a|--all)
    RUN_ALL='true'
    FLAGGED='true'
    shift # past argument
    ;;
    --no-cache)
    NO_CACHE='true'
    echo "not using cache when building docker images"
    shift # past argument
    ;;
    --default)
    HELP='true' #DEFAULT=YES
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
echo " -st| --start-docker : start all docker containers"
echo " -p | --purge-docker : stop and remove all docker containers"
echo " -pi | --purge-images : purge all docker images not currently attached"
echo " -b | --rebuild-restart-docker : remove docker containers, rebuild and run docker-compose"
echo " -a | --all : run total setup or re-setup without asking for abort"
echo " --no-cache : don't use cache when building docker images"
echo "Running with no arguments initiates total setup or re-setup"
echo "Note: total setup/re-setup does not replace an existing database data directory."

}

runFromRepoDeploy(){
  prg=$0
  if [ ! -e "$prg" ]; then
    case $prg in
      (*/*) exit 1;;
      (*) prg=$(command -v -- "$prg") || exit;;
    esac
  fi

  dir=$(
    cd -P -- "$(dirname -- "$prg")" && pwd -P
  ) || exit
  prg=$dir/$(basename -- "$prg") || exit

echo $prg
  if [[ $prg == *"/simplex-api/deploy/"* ]]; then
    echo "running from deploy directory"
    cd ../
  fi

}

if [ "$HELP" == 'true' ]; then
    usage
    exit 0
fi

alternateActionsAndAbort(){
if [ "$RESTART_VAR" = 'true' ]; then
    echo "Stopping all docker and running docker-compose"
    echo ${RESTART_VAR}
    stopDocker
    if [ -d "simplex-api"  ]; then
    cd simplex-api
    fi
    sudo docker-compose up -d --remove-orphans
fi

if [ "$REBUILD_RESTART" = 'true' ]; then
    echo "Removing docker containers, rebuilding and running docker-compose"
    purgeDocker
    cd simplex-api;
    buildDockerImages
    sudo docker-compose up -d --remove-orphans
fi

if [ "$STOP_DOCKER" == 'true' ]; then
  echo "Stopping all Docker containers"
  stopDocker
fi

if [ "$START_DOCKER" == 'true' ]; then
  echo "Starting all Docker containers"
  startDocker
fi

if [ "$PURGE_DOCKER" == 'true' ]; then
  echo "Stopping and removing all docker containers"
  purgeDocker
fi

if [ "$PURGE_IMAGES" == 'true' ]; then
  echo "Purging all docker images not currently attached"
  cleanAllImages
fi

if [ "$RUN_ALL" == 'true' ]; then
  echo "Stopping and removing all docker containers"
  doSetup
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
}

installDocker(){
    if hash docker 2>/dev/null; then
    echo "Docker present"
    else
    echo "Installing Docker"
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
      echo "Installing Docker Compose version: ${DOCKER_COMPOSE_VERSION}"
      sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
      sudo chmod +x /usr/local/bin/docker-compose
      echo sudo docker-compose --version
    fi
}

checkoutRepo(){
echo "Checking out simplex-api"
git clone ${GIT_URL};
echo "copying setup script to repo top level directory"
cp ./simplex-api/deploy/setup.sh ./simplex-api/
echo "entering simplex-api directory"
cd simplex-api;
if [ $FROM_BRANCH = "true" ]; then
  echo "Checking out branch ${BRANCH_NAME}"
  git checkout origin/${BRANCH_NAME};
  git checkout -b ${BRANCH_NAME};
fi

if [ -f "nginx.conf" ]; then
 echo "copying nginx config files"
 cp ./nginx.conf ./simplex-api/deploy/nginx
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

startDocker(){
  echo "Starting Docker Containers"
  #  sudo docker stop $(sudo docker ps -a -q)
  sudo docker start "frontend"
  sudo docker start "api"
  sudo docker start "nginx"
  sudo docker start "mongo_db"
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

cleanAllImages(){
  echo "Removing all docker images"
  sudo docker image prune
}


buildDockerImages(){
    echo $PWD
    cp ../${ENV_FILE} ./
    cd api;
    cp ../${ENV_FILE} ./
    cp ../${CURRENCY_FILE} ./
    if [ $NO_CACHE = "true" ]; then
      cleanAllImages
    fi

    if [ $NO_CACHE = "true" ]; then
      sudo docker build --force-rm --no-cache --tag=simplex-api .
    else
      sudo docker build --force-rm --tag=simplex-api .
    fi
    cd ../
    cd frontend;
    cp ../${ENV_FILE} ./
    cp ../${CURRENCY_FILE} ./
    if [ $NO_CACHE = "true" ]; then
      sudo docker build --force-rm  --no-cache --tag=simplex-frontend .
    else
      sudo docker build --force-rm  --tag=simplex-frontend .
    fi
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

doSetup(){
  if [ -f ${ENV_FILE} ]; then
    echo "env file exists"
    createDataDirectory
    if [ -d "simplex-api" ]; then
      purgeDocker
      echo "prior simplex-api dir exists"
      sudo rm -rf ./simplex-api/
      checkoutRepo
      buildDockerImages
      sudo docker-compose up -d --remove-orphans
      sudo docker ps
    else
      echo "prior simplex-api dir does not exist"
      checkoutRepo
      buildDockerImages
      sudo docker-compose up -d --remove-orphans
      sudo docker ps
    fi
    else
      echo "ERROR: failed to begin setup. .env file does not exist"
  fi
}

alternateActionsAndAbort

installDocker
installDockerCompose

runFromRepoDeploy

doSetup




