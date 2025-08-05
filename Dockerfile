FROM node:20-alpine
RUN apk add --no-cache openssl

EXPOSE 5500


ENV NODE_ENV=production

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev && npm cache clean --force


COPY . .

RUN npm run start

CMD ["npm", "run", "start"]