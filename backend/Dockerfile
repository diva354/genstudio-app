# backend/Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /var/log/backend

EXPOSE 8080

CMD ["node", "index.js"]
