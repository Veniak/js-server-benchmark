// Function to scale a given image to a given dimension and return the scaled image flipped horizontally
// The function is exported so it can be used in other files
import type { Buffer } from 'node:buffer';
import sharp from 'npm:sharp';

export function scaleAndFlipImage(image: Buffer) {
  return sharp(image)
    .png()
    .resize(1920, 1080, { fit: 'fill' })
    .flop()
    .toBuffer()
}

//? Test code
// ;(async () => {
//   const imagePath = path.join(process.cwd(), process.argv[2]);
//   const image = fs.readFileSync(imagePath);
  
//   const scaledImage = await scaleAndFlipImage(Buffer.from(image));
  
//   scaledImage.toString()
//   fs.writeFileSync('scaled-image.png', scaledImage)
  
//   // scaleAndFlipImage(image)
// })();