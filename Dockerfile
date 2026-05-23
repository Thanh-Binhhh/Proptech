FROM node:20-alpine

WORKDIR /apps

COPY package*.json ./

RUN npm install

COPY . .