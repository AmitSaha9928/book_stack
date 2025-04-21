# server/Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install && npm install -g nodemon

COPY . .

EXPOSE 3999

CMD ["npm", "run", "start:dev"]
