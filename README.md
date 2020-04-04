# Deno zip

A wrapper around JSZip for deno.

## Usage:

Create zipfile:
```ts
const zip = new JSZip();
zip.addFile("Hello.txt", "Hello World\n");

const img = zip.folder("images");
img.addFile("smile.gif", "\0", { base64: true });

await zip.writeFile("example.zip");
```

Read zipfile:
```
const zip = new JSZip();
await zip.readFile("example.zip");

for (const z of zip) {
  console.log(z.name);
}

// "Hello World\n"
console.log(await zip.file("Hello.txt").async("string"));
```