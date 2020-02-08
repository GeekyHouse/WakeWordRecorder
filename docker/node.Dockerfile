ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-buster

USER root

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	  libglib2.0-0 \
	  libx11-6 \
	  libx11-xcb1 \
	  libxcomposite1 \
	  libxcursor1 \
	  libxdamage1 \
	  libxext6 \
	  libxi6 \
	  libxtst6 \
	  libnss3 \
	  libgdk-pixbuf2.0-0 \
	  libgtk-3-0 \
	  libxss1 \
	  libasound2 \
	  libcanberra-gtk3-module \
	&& apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*

USER node

VOLUME /home/node/project

WORKDIR /home/node/project

EXPOSE 4200

ENTRYPOINT ["node"]
