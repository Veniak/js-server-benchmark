// Function to scale a given image to a given dimension and return the scaled image flipped horizontally
// The function is exported so it can be used in other files
import sharp from 'sharp';

export function scaleAndFlipImage(image: Buffer) {
  return sharp(image)
    .png()
    .resize(1920, 1080, { fit: 'fill' })
    .flop()
    .toBuffer()
}