FROM node:22.13.1-slim as base
RUN npm i -g pnpm@9.9.0

FROM base as builder

WORKDIR /app

COPY . /app/

RUN sed -i 's#link:../../backends/node#file:image-scaler-1.0.0.tgz#g' /app/package.json && \
    sed -i 's#link:../../backends/node#file:image-scaler-1.0.0.tgz#g' /app/pnpm-lock.yaml && \
    pnpm install --prefer-frozen-lockfile && \
    pnpm run build

FROM base as production

# Install Libre Office
RUN apt-get update && \
    apt-get install -y libreoffice
ENV SOFFICE_BIN="/usr/bin/soffice"

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

EXPOSE 3000
CMD [ "pnpm", "run", "start" ]


