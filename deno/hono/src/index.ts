
import { Hono } from 'hono';
import { Buffer } from 'node:buffer';
import { convertDocument, scaleAndFlipImage } from './backend/index.ts';

const app = new Hono()

function toArrayBuffer(buffer: Buffer) {
  const ab = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
  }
  return ab;
}

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/file', async (c) => {
  console.log("Received request to convert document to pdf");
  const formData = await c.req.formData()
  if (!formData.has('file')) return c.body("No file found", 400)
  const file = formData.get('file') as File
  const buffer = Buffer.from(await file.bytes());
  const result = await convertDocument(buffer, { format: 'pdf' })
  return c.body(toArrayBuffer(result), { headers: { 'Content-Type': 'application/pdf' } });
});

app.post('/image', async (c) => {
  console.log("Received request to scale an image");
  const formData = await c.req.formData()
  if (!formData.has('file')) return c.body("No file found", 400)
  const file = formData.get('file') as File
  const buffer = Buffer.from(await file.bytes());
  const result = await scaleAndFlipImage(buffer)
  return c.body(toArrayBuffer(result), { headers: { 'Content-Type': 'image/png' } });
});

app.post('/file-body', async (c) => {
  console.log("Received request to convert document to pdf");
  const rawBody = Buffer.from(await c.req.arrayBuffer())
  console.log(rawBody)
  const result = await convertDocument(rawBody, { format: 'pdf' })
  return c.body(toArrayBuffer(result), { headers: { 'Content-Type': 'application/pdf' } });
});

app.post('/image-body', async (c) => {
  console.log("Received request to scale an image");
  const rawBody = Buffer.from(await c.req.arrayBuffer())
  console.log(rawBody)
  const result = await scaleAndFlipImage(rawBody)
  return c.body(toArrayBuffer(result), { headers: { 'Content-Type': 'image/png' } });
});

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

Deno.serve(
  { port },
  app.fetch
)