// @ts-types="npm:@types/express"
import express from 'npm:express';
// @ts-types="npm:@types/multer"
import multer from 'npm:multer';
// Not a very nice import path, but it works and isn't the concern of this project
import { convertDocument, scaleAndFlipImage } from './backend/index.ts';

const app = express();
const upload = multer();

app.post('/file', upload.any(), async (req, res) => {
  console.log("Received request to convert document to image");
  if (!req.files) {
    res.send("No files uploaded");
    return;
  }
  const file = (req.files as Express.Multer.File[])[0];
  const result = await convertDocument(file.buffer, { format: 'pdf' })
  res.type('application/pdf').send(result);
});

app.post('/image', upload.any(), async (req, res) => {
  console.log("Received request to scale an image");
  if (!req.files) {
    res.send("No files uploaded");
    return;
  }
  const file = (req.files as Express.Multer.File[])[0];
  const result = await scaleAndFlipImage(file.buffer)
  res.type('image/png').send(result);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
