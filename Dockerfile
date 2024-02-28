FROM node:20-alpine

WORKDIR /app

COPY . .

EXPOSE 3005

CMD ["node", "index.js"]