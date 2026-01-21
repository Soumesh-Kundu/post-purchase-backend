FROM node:20-alpine
RUN apk add --no-cache openssl

EXPOSE 5500


ENV NODE_ENV=production

COPY package.json package-lock.json* ./

RUN npm ci --legacy-peer-deps --omit=dev && npm cache clean --force


COPY . .


CMD ["npm", "run", "start"]