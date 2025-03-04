// no alternative
import path from 'node:path';
import process from 'node:process';

// Mutex to prevent concurrent calls
let mutex: Promise<Buffer> = Promise.resolve(Buffer.from([]));

// Convert a DOCX file to a PDF file
export async function convertDocument(document: Buffer, options: { sofficePath?: string, format: string, fromFormat?: string }): Promise<Buffer> {
  // This cant be parralelized as the soffice process is a single instance
  mutex = mutex.then(async () => new Promise(async (resolve, reject) => {
    const filePath = path.join(process.cwd(), `temp.${options.fromFormat ?? 'docx'}`);
    // Bun has a better method to write files
    Bun.write(filePath, document)
    // fs.writeFileSync(filePath, document)
    // This can happen unparrallelized because the soffice process is a single instance
    const cp = Bun.spawnSync([options.sofficePath ?? Bun.env['SOFFICE_BIN']!, '--headless', '--convert-to', options.format, '--outdir', process.cwd(), filePath])

    if (!cp.success || cp.exitCode !== 0 || cp.stderr.length > 0)
      return reject(cp.stderr.toString())

    const outFile = Bun.file(`temp.${options.format}`)
    const outBuffer = await outFile.arrayBuffer();
    // Remove the temp files
    await Promise.all([
      Bun.file(filePath).delete(),
      outFile.delete()
    ])
    
    // Finally return the buffer to the caller
    resolve(Buffer.from(outBuffer))
  }));

  const out = await mutex;
  if (out.length === 0)
    throw new Error("Failed to convert document")
  return out;
}