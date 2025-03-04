import hapi from '@hapi/hapi';
import { Buffer } from "node:buffer";
import process from 'node:process';
import { Readable } from 'node:stream';
import { convertDocument, scaleAndFlipImage } from './backend/index.ts';

const init = async () => {
  const server = hapi.server({
    port: 3000,
    host: '0.0.0.0'
  })
    
  server.route({
    method: 'POST',
    path: '/file-body',
    options: {
      payload: {
        allow: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        parse: false,
      }
    },
    handler: async (req, h) => {
      console.log("Received request to convert document to pdf");
      console.log(req.payload);
      // Check if req.payload is a buffer
      if (!Buffer.isBuffer(req.payload)) {
        return h.response('Invalid input').code(400)
      }
      const result = await convertDocument(req.payload, { format: 'pdf' })
      return h.response(result).type('application/pdf');;
    }
  })

  server.route({
    method: 'POST',
    path: '/file',
    options: {
      payload: {
        maxBytes: 209715200,
        parse: true,
        allow: "multipart/form-data",
        multipart: { output: "stream" },
      },
    },
    handler: async (req, h) => {
      console.log("Received file");
      if (typeof req.payload !== 'object' || !Object.keys(req.payload).includes('file')) {
        return h.response('Invalid input').code(400)
      }
      const readableFile = (req.payload as { [key: string]: Readable })['file']
      const buffer = await getCompleteBuffer(readableFile)
      return h.response(await convertDocument(buffer, { format: 'pdf' })).type('application/pdf');
    }
  })

  server.route({
    method: 'POST',
    path: '/image',
    options: {
      payload: {
        maxBytes: 209715200,
        parse: true,
        allow: "multipart/form-data",
        multipart: { output: "stream" },
      },
    },
    handler: async (req, h) => {
      console.log("Received image");
      if (typeof req.payload !== 'object' || !Object.keys(req.payload).includes('file')) {
        return h.response('Invalid input').code(400)
      }
      const readableFile = (req.payload as { [key: string]: Readable })['file']
      const buffer = await getCompleteBuffer(readableFile)
      return h.response(await scaleAndFlipImage(buffer)).type('image/png');
    }
  })

  server.route({
    method: 'POST',
    path: '/image-body',
    options: {
      payload: {
        allow: ['image/png', 'image/jpg', 'image/jpeg'],
        maxBytes: 1048576*4,
        parse: false,
      }
    },
    handler: async (req, h) => {
      console.log("Received request to convert document to pdf");
      console.log(req.payload);
      // Check if req.payload is a buffer
      if (!Buffer.isBuffer(req.payload)) {
        return h.response('Invalid input').code(400)
      }
      const result = await scaleAndFlipImage(req.payload)
      return h.response(result).type('image/png');
    }
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}


process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();

function getCompleteBuffer(readable: Readable) {
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    readable.on('data', (chunk) => {
      chunks.push(chunk);
    });
    readable.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readable.on('error', (err) => {
      reject(err);
    });
  });
}