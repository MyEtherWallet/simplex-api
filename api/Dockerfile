FROM node:8.16.0-jessie


RUN apt-get update
RUN apt-get -y install cron

#ADD crontab /etc/cron.d/cron-events
#ADD crontab /etc/crontab
#RUN chmod 0644 /etc/cron.d/cron-events
#RUN service cron start

ENV NODE_OPTIONS --max-old-space-size=4096
RUN npm install npm@6.9 -g
RUN npm install pm2 -g
RUN node -v && npm -v
WORKDIR /api

COPY . /api
RUN npm install
RUN npm run build
EXPOSE 8080/tcp

CMD npm run start:docker
