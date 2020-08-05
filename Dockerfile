FROM node:latest

RUN mkdir /app
RUN npm install -g gatsby-cli
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .
CMD ["gatsby", "develop", "-H", "0.0.0.0"]