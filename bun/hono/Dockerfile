FROM oven/bun:1.2-slim as base

FROM base as production

# Install Libre Office
RUN apt-get update && \
    apt-get install -y libreoffice
ENV SOFFICE_BIN="/usr/bin/soffice"

ENV NODE_ENV=production

WORKDIR /app

COPY . /app/

RUN sed -i 's#../../backends/bun/#./bun/#g' /app/package.json && \
    bun install

EXPOSE 3000
CMD [ "bun", "run", "start" ]
