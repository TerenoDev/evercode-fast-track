FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN cp src/db/schema.sql dist/db/schema.sql

EXPOSE 3000

CMD ["node", "dist/index.js"]