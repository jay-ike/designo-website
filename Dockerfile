
FROM node:20.11.1-slim
WORKDIR /usr/src/app
COPY --chown=node:node . ./
RUN chown -R node:node . && npm ci --omit=dev
LABEL name="designo-website"
USER node
CMD npx eleventy --serve --port ${APP_PORT}
