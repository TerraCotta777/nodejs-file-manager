import path from "path";
import zlib from "zlib";
import fs from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import print from "../messages.js";

const pipelineAsync = promisify(pipeline);

export const compress = async (currentDir, fileToCompress, finalPath) => {
  if (!fileToCompress || !finalPath) {
    print.invalidInput();
    return;
  }
  try {
    const fileDir = path.resolve(currentDir, fileToCompress);
    const destinationDir = path.resolve(currentDir, finalPath);
    await fs.access(fileDir);
    await fs.mkdir(path.dirname(destinationDir), { recursive: true });
    const readStream = createReadStream(fileDir);
    const writeStream = createWriteStream(destinationDir);
    const compress = zlib.createBrotliCompress();
    await pipelineAsync(readStream, compress, writeStream);
    console.log("File compressed");
  } catch (err) {
    if (err.code === "ERR_INVALID_ARG_TYPE") {
      print.invalidInput();
    } else print.operationFailed();
  }
};

export const decompress = async (currentDir, fileToDecompress, finalPath) => {
  try {
    const fileDir = path.resolve(currentDir, fileToDecompress);
    const destinationDir = path.resolve(currentDir, finalPath);
    await fs.access(fileDir);
    await fs.mkdir(path.dirname(destinationDir), { recursive: true });
    const readStream = createReadStream(fileDir);
    const writeStream = createWriteStream(destinationDir);
    const decompress = zlib.createBrotliDecompress();
    await pipelineAsync(readStream, decompress, writeStream);
    console.log("File decompressed");
  } catch (err) {
    if (err.code === "ERR_INVALID_ARG_TYPE") {
      print.invalidInput();
    } else print.operationFailed();
  }
};
