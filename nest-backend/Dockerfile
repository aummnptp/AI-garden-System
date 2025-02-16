# base image
FROM node:18 AS builder

# set working directory
WORKDIR /app

# copy package.json และไฟล์ lock
COPY package*.json ./

# install dependencies
RUN npm install --legacy-peer-deps

# copy source code
COPY . .

# build the app
RUN npm run build

# production stage
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# install only production dependencies
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/main.js"]