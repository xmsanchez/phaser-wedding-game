FROM node:latest

WORKDIR /app

COPY package.json /app/package.json

RUN npm install -g parcel-bundler
RUN npm install

COPY assets /app/assets
COPY index.html /app/index.html
COPY phaser.js /app/phaser.js
COPY README.md /app/README.md
COPY Scene.scene /app/Scene.scene
COPY game-v2.js /app/game-v2.js

EXPOSE 8080

CMD ["npm", "start"]