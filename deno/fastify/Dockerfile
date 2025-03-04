FROM denoland/deno:2.1.7 as base

FROM base as production

# Install Libre Office
RUN apt-get update && \
    apt-get install -y libreoffice
ENV SOFFICE_BIN="/usr/bin/soffice"

ENV NODE_ENV=production

WORKDIR /app

COPY . /app/
COPY ./tmp /app/src/backend

RUN deno i --allow-scripts=npm:sharp@0.33.5

EXPOSE 3000
CMD [ "deno", "task", "start" ]