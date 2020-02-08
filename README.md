## Playing with Docker-Compose

### Mapping ports

By default services ports are exposed but not mapped.
To override Docker Compose, 2 solutions :

* Create a docker-compose.override.yml file
* Set the "COMPOSE_FILE" environment variable into the .env and create the corresponding YML file (see the example into .env.dist)

Example of overriding file :

```yaml
version: '3.7'

services:
  test:
    ports:
      - 127.0.0.1:9876:9876

  dev:
    ports:
      - 127.0.0.1:5200:4200

  nginx:
    ports:
      - 127.0.0.1:9700:80
      - 127.0.0.1:9800:81

  postgres:
    ports:
      - 127.0.0.1:5460:5432
```

### Build all images

```sh
docker-compose build
```

### Run server

```sh
docker-compose up -d nginx
```

### Build production application

```sh
docker-compose run npm run --rm build
```

### Run development application

```sh
docker-compose up -d dev
```

### Use NPM

```sh
docker-compose npm run --rm [...]
```

### Use Node

```sh
docker-compose node run --rm [...]
```

### Clean unused containers

```sh
docker-compose rm
```

---

## Example of Nginx configuration file

```nginx
server {
  server_name wwr.local;

  listen 80;
  listen [::]:80;
  listen 443 ssl http2;
  listen [::]:443 ssl http2;

  if ($server_port = 80) {
    return 301 https://$host$request_uri;
  }

  ssl_certificate /etc/nginx/certificates/local.crt;
  ssl_certificate_key /etc/nginx/certificates/local.key;

  location / {
    proxy_set_header        Host $host;
    proxy_set_header        X-Real-IP $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Proto $scheme;
    proxy_http_version      1.1;
    proxy_set_header        Upgrade $http_upgrade;
    proxy_set_header        Connection "upgrade";
    proxy_pass              http://127.0.0.1:9700;
    proxy_read_timeout  90;
  }
}

server {
  server_name dev-wwr.local;

  listen 80;
  listen [::]:80;
  listen 443 ssl http2;
  listen [::]:443 ssl http2;

  if ($server_port = 80) {
    return 301 https://$host$request_uri;
  }

  ssl_certificate /etc/nginx/certificates/local.crt;
  ssl_certificate_key /etc/nginx/certificates/local.key;

  location / {
    proxy_set_header        Host $host;
    proxy_set_header        X-Real-IP $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Proto $scheme;
    proxy_http_version      1.1;
    proxy_set_header        Upgrade $http_upgrade;
    proxy_set_header        Connection "upgrade";
    proxy_pass              http://127.0.0.1:9800;
    proxy_read_timeout  90;
  }
}
```
