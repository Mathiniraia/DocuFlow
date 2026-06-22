import { Document, Packer, Paragraph, TextRun } from "docx";
import fs from "fs";

async function run() {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ children: [new TextRun("Testing with string constructor")] }),
        new Paragraph({ children: [new TextRun({ text: "Testing with object constructor" })] })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("test.docx", buffer);
}

run().catch(console.error);
