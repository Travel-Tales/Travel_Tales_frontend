FROM node:18.17.0-alpine

COPY . .

WORKDIR /app

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "dev"]