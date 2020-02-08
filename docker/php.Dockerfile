ARG PHP_VERSION=latest

FROM php:${PHP_VERSION}-fpm-buster

ARG COMPOSER_VERSION=1.9.2

COPY --from=composer /usr/bin/composer /usr/bin/composer

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pgsql pdo pdo_pgsql \
    && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*


RUN echo ${COMPOSER_VERSION}

ENV COMPOSER_CACHE_DIR=/tmp/composer_cache

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --filename=composer --install-dir=/usr/local/bin --version=${COMPOSER_VERSION} \
    && php -r "unlink('composer-setup.php');"

VOLUME /var/www/html

WORKDIR /var/www/html
