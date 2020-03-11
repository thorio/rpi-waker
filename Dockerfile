FROM node:12-slim

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i --production

COPY src/ src/

CMD npm run start
