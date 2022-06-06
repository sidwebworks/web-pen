export class BundlingError extends Error {
  constructor({ file, message }: { file: string; message: string }) {
    super(message);
    this.name = "Bundling Error";
    this.stack = file;
  }
}
