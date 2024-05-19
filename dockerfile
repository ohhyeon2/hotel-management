FROM node:21.7.1-alpine as builder
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:21.7.1-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

ARG DB_PORT
ENV DB_PORT=${DB_PORT}
ARG DB_HOST
ENV DB_HOST=${DB_HOST}
ARG DB_USERNAME
ENV DB_USERNAME=${DB_USERNAME}
ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}
ARG DB_NAME
ENV DB_NAME=${DB_NAME}
ARG JWT_SECRET_KEY
ENV JWT_SECRET_KEY=${JWT_SECRET_KEY}
ARG EMAIL_USER
ENV EMAIL_USER=${EMAIL_USER}
ARG EMAIL_PASS
ENV EMAIL_PASS=${EMAIL_PASS}

CMD npm run start:dev