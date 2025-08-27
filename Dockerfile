FROM node

RUN apt-get update

ADD ./dist /app

ADD ./node_modules /node_modules

ADD ./package.json /package.json
