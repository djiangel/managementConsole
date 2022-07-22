FROM node:15-alpine

RUN mkdir -p /app
WORKDIR /app

COPY . /app

EXPOSE 8081

CMD ["node", "server.src/server.js"]
