import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Convert a DOCX file to a PDF file
export async function convertDocument(document: Buffer, options: { sofficePath?: string, format: string, fromFormat?: string }): Promise<Buffer> {
  // This cant be parralelized as the soffice process is a single instance
  return new Promise<Buffer>((resolve, reject) => {
    const filePath = path.join(process.cwd(), `temp.${options.fromFormat ?? 'docx'}`);
    fs.writeFileSync(filePath, document);
    const a = spawnSync(options.sofficePath ?? process.env['SOFFICE_BIN']!, ['--headless', '--convert-to', options.format, '--outdir', process.cwd(), filePath]);
    if (a.error || a.status !== 0) {
      console.error(a.error)
      reject(a.error)
    } else {
      console.log('PDF file created')
      const outputPath = `temp.${options.format}`
      const outBuffer = fs.readFileSync(outputPath)
      // Remove the temp files
      fs.rmSync(filePath)
      fs.rmSync(outputPath)
      // Finally return the buffer to the caller
      resolve(outBuffer)
    }
  });
}

//? Test code
// (async () => {
//   // Some code extra to not input a file path, pass in Buffer as it will be in the rest endpoint
//   const inputPath = path.join(process.cwd(), process.argv[2]);
//   const fileAsBuffer = fs.readFileSync(inputPath);
//   const fmt = 'pdf';
//   const pdf = await convertDocument(fileAsBuffer, { sofficePath: 'C:\\Program Files\\LibreOffice\\program\\soffice.exe', format: fmt });
//   console.log(pdf);
//   fs.writeFileSync(`output${crypto.randomUUID()}.${fmt}`, pdf);
// })();