import express from 'express';
import { convertDocument, scaleAndFlipImage } from 'image-scaler';
import multer from 'multer';

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
