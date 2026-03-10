# Use Node 18
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3030

CMD sh -c "npx drizzle-kit migrate --config ./drizzle.config.js && node dist/app.js"