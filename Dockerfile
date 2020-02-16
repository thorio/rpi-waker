FROM node:12-slim

RUN apt update
RUN apt install libatomic1

RUN mkdir -p /app
WORKDIR /app
COPY src/ src/
COPY package.json .
COPY package-lock.json .
COPY config.json .

RUN npm i

CMD npm run start
