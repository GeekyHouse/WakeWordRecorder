ARG NGINX_VERSION=1.17.8

FROM nginx:${NGINX_VERSION}

COPY ./ /etc/nginx/conf.d/

RUN rm /etc/nginx/conf.d/default.conf \
    && mv /etc/nginx/conf.d/main.nginx /etc/nginx/conf.d/main.conf \
    && mv /etc/nginx/conf.d/main.dev.nginx /etc/nginx/conf.d/main.dev.conf

WORKDIR /etc/nginx
