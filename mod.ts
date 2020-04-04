import "./jszip.min.js";

interface JSZipObject {
  name: string;
  dir: boolean;
  date: Date;
  comment: string;
  /** The UNIX permissions of the file, if any. */
  unixPermissions: number | string | null;
  /** The UNIX permissions of the file, if any. */
  dosPermissions: number | null;
  options: JSZipObjectOptions;

  /**
   * Prepare the content in the asked type.
   * @param type the type of the result.
   * @param onUpdate a function to call on each internal update.
   * @return Promise the promise of the result.
   */
  async<T extends OutputType>(
    type: T,
    onUpdate?: OnUpdateCallback,
  ): Promise<OutputByType[T]>;

  // nodeStream(
  //   type?: "nodestream",
  //   onUpdate?: OnUpdateCallback
  // ): NodeJS.ReadableStream;
}

interface JSZipObjectOptions {
  compression: Compression;
}

interface Metadata {
  percent: number;
  currentFile: string;
}

type OnUpdateCallback = (metadata: Metadata) => void;

type Compression = "STORE" | "DEFLATE";

interface JSZipLoadOptions {
  base64?: boolean;
  checkCRC32?: boolean;
  optimizedBinaryString?: boolean;
  createFolders?: boolean;
  decodeFileName?(filenameBytes: Uint8Array): string;
}

interface InputByType {
  base64: string;
  string: string;
  text: string;
  binarystring: string;
  array: number[];
  uint8array: Uint8Array;
  arraybuffer: ArrayBuffer;
  blob: Blob;
  // stream: NodeJS.ReadableStream;
}

type InputFileFormat = InputByType[keyof InputByType];

interface OutputByType {
  base64: string;
  text: string;
  string: string;
  binarystring: string;
  array: number[];
  uint8array: Uint8Array;
  arraybuffer: ArrayBuffer;
  blob: Blob;
  // nodebuffer: Buffer;
}

type OutputType = keyof OutputByType;

interface JSZipGeneratorOptions<T extends OutputType = OutputType> {
  compression?: Compression;
  compressionOptions?: null | {
    level: number;
  };
  type?: T;
  comment?: string;
  /**
   * mime-type for the generated file.
   * Useful when you need to generate a file with a different extension, ie: “.ods”.
   * @default 'application/zip'
   */
  mimeType?: string;
  encodeFileName?(filename: string): string;
  /** Stream the files and create file descriptors */
  streamFiles?: boolean;
  /** DOS (default) or UNIX */
  platform?: "DOS" | "UNIX";
}

export class JSZip {
  protected _z: any;

  // we should assert the type (we want it to be a window.JSZip) ?
  constructor(z?: any) {
    if (z === undefined) {
      // @ts-ignores
      this._z = new window.JSZip();
    } else {
      this._z = z;
    }
  }

  /**
   * Returns an new JSZip instance with the given folder as root
   *
   * @param name Name of the folder
   * @return New JSZip object with the given folder as root or null
   */
  folder(name: string): JSZip {
    // @ts-ignores
    const f = this._z.folder(name);
    return new JSZip(f);
  }

  /**
   * Get a file from the archive
   *
   * @param Path relative path to file
   * @return File matching path, null if no file found
   */
  file(path: string): JSZipObject {
    // @ts-ignores
    const f = this._z.file(path);
    return f as JSZipObject;
  }

  /**
   * Add a file to the archive
   *
   * @param path Relative path to file
   * @param data Content of the file
   * @param options Optional information about the file
   * @return JSZip object
   */
  addFile(path: string, content?: string, options?: object): JSZipObject {
    // @ts-ignores
    const f = this._z.file(path, content, options);
    return f as JSZipObject;
  }

  files(): { [key: string]: JSZipObject } {
    // @ts-ignores
    const fs = this._z.files;
    return fs;
  }

  /**
   * Generates a new archive asynchronously
   *
   * @param options Optional options for the generator
   * @param onUpdate The optional function called on each internal update with the metadata.
   * @return The serialized archive
   */
  async generateAsync<T extends keyof OutputByType>(
    options?: JSZipGeneratorOptions<T>,
  ): Promise<OutputByType[T]> {
    // @ts-ignores
    return await this._z.generateAsync(options);
  }

  /**
   * Get all files which match the given filter function
   *
   * @param predicate Filter function
   * @return Array of matched elements
   */
  filter(
    predicate: (relativePath: string, file: JSZipObject) => boolean,
  ): JSZipObject[] {
    // @ts-ignores
    return this._z.filter(predicate);
  }

  /**
   * Removes the file or folder from the archive
   *
   * @param path Relative path of file or folder
   * @return Returns the JSZip instance
   */
  remove(path: string): JSZip {
    // @ts-ignores
    return this._z.remove(path);
  }

  /**
   * Deserialize zip file asynchronously
   *
   * @param data Serialized zip file
   * @param options Options for deserializing
   * @return Returns promise
   */
  async loadAsync(
    data: InputFileFormat,
    options?: JSZipLoadOptions,
  ): Promise<JSZip> {
    return this._z.loadAsync(data, options);
  }

  /**
   * Write zip file asynchronously to a file
   *
   * @param path of zip file
   * @return Returns promise
   */
  async writeFile(path: string): Promise<void> {
    const b: Uint8Array = await this.generateAsync({ type: "uint8array" });
    return await Deno.writeFile(path, b);
  }

  /**
   * Read zip file asynchronously from a file
   *
   * @param path of zip file
   * @return Returns promise
   */
  async readFile(path: string): Promise<JSZip> {
    const content: Uint8Array = await Deno.readFile(path);
    await this.loadAsync(content);
    return this;
  }

  *[Symbol.iterator](): Iterator<JSZipObject> {
    yield* Object.values(this.files());
  }
}
