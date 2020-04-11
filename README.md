# Deno zip

A wrapper around JSZip for deno.

## Usage:

Create zipfile:
```ts
import { JSZip } from "https://raw.githubusercontent.com/hayd/deno-zip/master/mod.ts";

const zip = new JSZip();
zip.addFile("Hello.txt", "Hello World\n");

const img = zip.folder("images");
img.addFile("smile.gif", "\0", { base64: true });

await zip.writeZip("example.zip");
```

Read zipfile:
```ts
import { readZip } from "https://raw.githubusercontent.com/hayd/deno-zip/master/mod.ts";

const zip = await readZip("example.zip");
for (const z of zip) {
  console.log(z.name);
}

console.log(await zip.file("example/Hello.txt").async("string"));
// "Hello World\n"
```
