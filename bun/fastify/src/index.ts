import type { BusboyFileStream } from '@fastify/busboy';
import fastifyMultipart from '@fastify/multipart';
import fastify, { type FastifyRequest } from "fastify";
import { convertDocument, scaleAndFlipImage } from 'image-scaler';

const server = fastify({ logger: true });

server.register(fastifyMultipart);

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.post('/file', async (req, res) => {
  console.log("Received request to convert document to pdf");
  const multipart = await getBufferOfRequest(req);
  const buffer = await getBufferOfMultipart(multipart.file);
  const result = await convertDocument(buffer, { format: 'pdf' });
  res.type('application/pdf');
  res.send(result);
});

server.post('/image', async (req, res) => {
  console.log("Received request to scale an image");
  const multipart = await getBufferOfRequest(req);
  const buffer = await getBufferOfMultipart(multipart.file);
  const result = await scaleAndFlipImage(buffer);
  // Set the content type to image/png
  res.type('image/png');
  res.send(result);
});

server.listen({ port: 3000, host: "0.0.0.0" }, (err, addr) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${addr}`);
})

async function getBufferOfRequest(request: FastifyRequest) {
  const multipart = await request.file();
  if (!multipart || !multipart.file)
    throw new Error("No file uploaded");
  return multipart;
}

async function getBufferOfMultipart(multipartFile: BusboyFileStream) {
  const chunks: any[] = [];
  for await (const chunk of multipartFile) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  return buffer;
}
