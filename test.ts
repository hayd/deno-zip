import { assertEquals } from "https://deno.land/std@v0.40.0/testing/asserts.ts";
import { JSZip, readZip } from "./mod.ts";

// FIXME use tmp directory and clean up.
async function exampleZip() {
  const zip = new JSZip();
  zip.addFile("Hello.txt", "Hello World\n");

  const img = zip.folder("images");
  img.addFile("smile.gif", "\0", { base64: true });

  await zip.writeZip("example.zip");
}

Deno.test(async function zip() {
  await exampleZip();

  const zip2 = await readZip("example.zip");
  assertEquals(zip2.file("Hello.txt").name, "Hello.txt");

  let i = 0;
  for (const f of zip2) i++;
  assertEquals(i, 3);

  assertEquals("Hello World\n", await zip2.file("Hello.txt").async("string"));

  await Deno.remove("example.zip");
});

// TODO add tests for unzip
