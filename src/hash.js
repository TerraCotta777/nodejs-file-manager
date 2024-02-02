import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import print from "../messages.js";
import { createReadStream } from "fs";

const hashEncrypt = async (currentDir, file) => {
  try {
    const fileToHash = path.resolve(currentDir, file);
    await fs.access(fileToHash);
    const hash = crypto.createHash("sha256");
    const input = createReadStream(fileToHash);
    input.on("readable", () => {
      const data = input.read();
      if (data) hash.update(data);
      else console.log(`Hash: ${hash.digest("hex")}`);
    });
  } catch (err) {
    print.invalidInput();
  }
};

export default hashEncrypt;
