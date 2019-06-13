FROM node:8.16.0-jessie

ENV NODE_OPTIONS --max-old-space-size=4096
RUN npm install npm@6.9 -g
RUN node -v && npm -v
WORKDIR /api

COPY . /api
RUN npm install
RUN npm run build
EXPOSE 8080/tcp
CMD npm run start
