FROM node:latest

WORKDIR /app

COPY package.json /app/package.json

RUN npm install -g parcel-bundler
RUN npm install

COPY public /app/public
COPY src /app/src
COPY jsconfig.json /app/jsconfig.json 
COPY README.md /app/README.md

ENV PORT=8000

EXPOSE 8000

WORKDIR /app/dist

CMD ["npm", "start"]