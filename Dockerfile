FROM node:latest

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

CMD ["npx", "serve", "-s", "dist", "-l", "8000"]

EXPOSE 8000
