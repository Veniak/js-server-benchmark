# Steps

- [x] Node (Dockerrized)
  - [x] express
  - [x] fastify
  - [x] hapi (supports both body and multipart 'file')
  - [x] hono (supports both body and multipart 'file')
  - [x] koa 

- [x] Bun (Dockerrized)
  - [x] express
  - [ ] fastify
  - [x] hapi
  - [x] hono (Slight adjustment to file reading)
  - [x] koa

- [x] Deno (Dockerrized)
  - [x] express (content bugged pdfs)
  - [x] fastify
  - [x] hapi (content bugged pdfs)
  - [x] hono
  - [x] koa (content bugged pdfs)

# TODOS:
- Check all node:imports and npm:imports

Deno requires the backends/deno/src folder within each src folder as backend.
See createJunctions.ps1 as reference.