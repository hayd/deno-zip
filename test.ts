import { assertEquals } from "https://deno.land/std@v0.39.0/testing/asserts.ts";
import { JSZip } from "./mod.ts";

Deno.test(async function zip() {
  const zip = new JSZip();
  zip.addFile("Hello.txt", "Hello World\n");

  const img = zip.folder("images");
  img.addFile("smile.gif", "\0", { base64: true });

  await zip.writeFile("example.zip");

  const zip2 = new JSZip();
  await zip2.readFile("example.zip");
  assertEquals(zip2.file("Hello.txt").name, "Hello.txt");

  let i = 0;
  for (const f of zip2) { i++ }
  assertEquals(i, 3)

  assertEquals("Hello World\n", await zip2.file("Hello.txt").async("string"));

  //await Deno.remove("example.zip");
});
