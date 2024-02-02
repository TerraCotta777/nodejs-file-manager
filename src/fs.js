import fs from "fs/promises";
import { createReadStream, createWriteStream, readFile } from "fs";
import path from "path";
import print from "../messages.js";

export const printFile = async (currentDir, filePath) => {
  if (!filePath) {
    print.invalidInput();
    return;
  }
  try {
    const fileDir = path.resolve(currentDir, filePath);
    await fs.access(fileDir);
    const stream = createReadStream(fileDir, {
      encoding: "utf-8",
    });
    stream.on("data", (chunk) => {
      console.log(chunk);
    });
  } catch (err) {
    print.operationFailed();
  }
};

export const addFile = async (currentDir, fileName) => {
  if (!fileName) {
    print.invalidInput();
    return;
  }

  const newFileDir = path.resolve(currentDir, fileName);
  try {
    await fs.mkdir(path.dirname(newFileDir), { recursive: true });
    await fs.writeFile(newFileDir, "");
  } catch (err) {
    print.operationFailed();
  }
};

export const renameFile = async (currentDir, oldFileName, newFileName) => {
  if (!oldFileName || !newFileName) {
    print.invalidInput();
    return;
  }
  const newName = path.resolve(currentDir, newFileName);
  const oldName = path.resolve(currentDir, oldFileName);
  try {
    await fs.access(newFileName);
  } catch (err) {
    if (err.code === "ENOENT") {
      try {
        await fs.access(oldName);
        await fs.rename(oldName, newName);
      } catch (err) {
        print.operationFailed();
      }
    } else {
      print.operationFailed();
    }
  }
};

export const copyFile = async (currentDir, originFile, newFile) => {
  try {
    const originFileDir = path.resolve(currentDir, originFile);
    const copiedFileDir = path.resolve(currentDir, newFile);
    await fs.access(originFileDir);
    await fs.mkdir(path.dirname(copiedFileDir), { recursive: true });
    const readStream = createReadStream(originFileDir);
    const writeStream = createWriteStream(copiedFileDir);
    readStream.pipe(writeStream);
    readStream.on("error", (err) => {
      print.invalidInput();
    });
    writeStream.on("error", (err) => {
      print.operationFailed();
    });
    writeStream.on("close", () => {
      console.log("File copied");
    });
  } catch (err) {
    if (err.code === "ERR_INVALID_ARG_TYPE") {
      print.invalidInput();
    } else print.operationFailed();
  }
};

export const moveFile = async (currentDir, originFile, newPath) => {
  try {
    const originFilePath = path.resolve(currentDir, originFile);
    const movedFilePath = path.resolve(currentDir, newPath);
    await fs.access(originFilePath);
    await fs.mkdir(path.dirname(movedFilePath), { recursive: true });
    const readStream = createReadStream(originFilePath);
    const writeStream = createWriteStream(movedFilePath);
    readStream.pipe(writeStream);
    readStream.on("error", (err) => {
      print.invalidInput();
    });
    writeStream.on("error", (err) => {
      print.operationFailed();
    });
    writeStream.on("finish", async () => {
      await fs.unlink(originFilePath);
      console.log("File copied");
    });
  } catch (err) {
    if (err.code === "ERR_INVALID_ARG_TYPE") {
      print.invalidInput();
    } else print.operationFailed();
  }
};

export const removeFile = async (currentDir, filePath) => {
  if (!filePath) {
    print.invalidInput();
    return;
  }
  try {
    const fileDir = path.resolve(currentDir, filePath);
    await fs.access(fileDir);
    await fs.unlink(fileDir);
    console.log("File deleted");
  } catch (err) {
    if (err.code === "EPERM" || err.code === "ENOENT") {
      print.invalidInput();
    } else print.operationFailed();
  }
};
