import { join } from '@std/path';
// import { Buffer } from '@std/';
import { Buffer } from '@std/io';

// Convert a DOCX file to a PDF file
export function convertDocument(document: ArrayBufferLike, options: { sofficePath?: string, format: string, fromFormat?: string }): Promise<ArrayBufferLike> {
  // This cant be parralelized as the soffice process is a single instance
  return new Promise((resolve, reject) => {
    const filePath = join(Deno.cwd(), `temp.${options.fromFormat ?? 'docx'}`);
    Deno.writeFileSync(filePath, new Buffer(document).bytes());

    const cmd = new Deno.Command(options.sofficePath ?? Deno.env.get('SOFFICE_BIN')!, {
      args: ['--headless', '--convert-to', options.format, '--outdir', Deno.cwd(), filePath]
    }).outputSync();

    if (cmd.stderr.byteLength > 0 || cmd.code !== 0) {
      console.error(cmd.stderr.toString())
      reject(cmd.stderr.toString())
    } else {
      console.log('PDF file created')

      const outputPath = `temp.${options.format}`
      const outBuffer = Deno.readFileSync(outputPath);

      // Remove the temp files
      Promise.all([
        Deno.remove(filePath),
        Deno.remove(outputPath),
      ]).then(() => resolve(outBuffer));
    }
  });
}
