FROM node:20-alpine

WORKDIR /app

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]