FROM node:20

WORKDIR /client

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./


EXPOSE 3000