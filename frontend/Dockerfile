FROM node:20-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm install --include=optional
RUN npm rebuild lightningcss

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]