ARG APP_VERSION=latest

FROM itpoc/wwr-node:${APP_VERSION}

USER root

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	  chromium \
	&& apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN=chromium

USER node

VOLUME /home/node/project

WORKDIR /home/node/project

EXPOSE 9876

ENTRYPOINT ["npm", "run"]

CMD ["test"]
