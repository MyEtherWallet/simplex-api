FROM node:10.16.0-alpine as build-stage

ENV NODE_OPTIONS --max-old-space-size=4096
RUN npm install npm@6.9 -g
RUN node -v && npm -v
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
COPY ./.env ./

RUN npm run build
EXPOSE 8080/tcp
CMD npm run prod
