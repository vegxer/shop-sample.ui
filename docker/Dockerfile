FROM node:14.16.1-slim as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:stable-alpine as production-stage
ENV DOLLAR=$
COPY ./docker/nginx.conf.tmpl /etc/nginx/
COPY --from=build-stage /app/target/dist /usr/share/nginx/html
VOLUME /usr/share/nginx/html/
EXPOSE 80

COPY ./docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
