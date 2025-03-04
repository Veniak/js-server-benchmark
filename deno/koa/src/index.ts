// @ts-types="npm:@types/koa__multer"
import koaMulter from '@koa/multer';
// @ts-types="npm:@types/koa__router"
import koaRouter from '@koa/router';
// @ts-types="npm:@types/koa"
import koa from 'koa';
import { convertDocument, scaleAndFlipImage } from './backend/index.ts';

const app = new koa();
const router = new koaRouter();
const upload = koaMulter();

app.use(async (ctx, next) => {
  console.log(`Request to ${ctx.path}`);
  await next();
});

router.post('/file', upload.any(), async (ctx) => {
  console.log("Received request to convert document to pdf");
  if (!ctx.request.files) {
    ctx.body = 'No files uploaded';
    return;
  }
  const file = (ctx.request.files as koaMulter.File[])[0];
  ctx.body = await convertDocument(file.buffer, { format: 'pdf' });
  ctx.type = 'application/pdf';
})

router.post('/image', upload.any(), async (ctx) => {
  console.log("Received request to scale an image");
  if (!ctx.request.files) {
    ctx.body = 'No files uploaded';
    return;
  }
  const file = (ctx.request.files as koaMulter.File[])[0];
  ctx.body = await scaleAndFlipImage(file.buffer);
  ctx.type = 'image/png';
})

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
console.log('Server running on port 3000');