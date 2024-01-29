import readline from "readline";
import os from "os";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import zlib from "zlib";
import messages from "./messages.js";
import { createReadStream, createWriteStream } from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const username =
  process.argv[2].split("=")[1][0].toUpperCase() +
  process.argv[2].split("=")[1].slice(1);
console.log(messages.hello(username));

let currentDir = process.cwd();
console.log(messages.currentDir(currentDir));

rl.on("line", async (input) => {
  const [command, ...args] = input.split(" ");

  switch (command) {
    case "up":
      if (path.dirname(currentDir) !== currentDir) {
        currentDir = path.dirname(currentDir);
      }
      break;
    case "cd":
      const newDir = path.resolve(currentDir, args[0]);
      try {
        await fs.access(newDir);
        currentDir = newDir;
      } catch (error) {
        console.log("Invalid input");
      }
      break;
    case "ls":
      try {
        const items = await fs.readdir(currentDir);
        const files = [];
        const directories = [];
        for (const item of items) {
          const itemPath = path.join(currentDir, item);
          const stat = await fs.stat(itemPath);
          if (stat.isDirectory()) {
            directories.push({
              name: item,
              type: "directory",
            });
          } else if (stat.isFile()) {
            files.push({
              name: item,
              type: "file",
            });
          }
        }
        const sortedDirectories = directories.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
        console.table([...sortedDirectories, ...sortedFiles]);
      } catch (err) {
        console.log("Operation failed");
      }
      break;
    case "cat":
      const fileDir = path.resolve(currentDir, args[0]);
      try {
        await fs.access(fileDir);
        const stream = await createReadStream(fileDir, {
          encoding: "utf-8",
        });
        stream.on("data", (chunk) => {
          console.log(chunk);
        });
      } catch (err) {
        console.log("Operation failed");
      }
      break;
    case "add":
      try {
        const newFileDir = path.resolve(currentDir, args[0]);
        await fs.access(newFileDir);
      } catch (err) {
        if (err.code === "ENOENT") {
          await fs.writeFile(newFileDir, "");
        } else {
          console.log("Operation failed");
        }
      }
      break;
    case "rn":
      const oldFileName = path.resolve(currentDir, args[0]);
      const newFileName = path.resolve(currentDir, args[1]);
      console.log(oldFileName, newFileName);
      try {
        await fs.access(newFileName);
      } catch (err) {
        if (err.code === "ENOENT") {
          try {
            await fs.access(oldFileName);
            await fs.rename(oldFileName, newFileName);
          } catch (err) {
            console.log("Operation failed");
          }
        } else {
          console.log("Operation failed");
        }
      }
      break;
    case "cp":
      try {
        const originFileDir = path.resolve(currentDir, args[0]);
        const copiedFileDir = path.resolve(currentDir, args[1]);
        await fs.access(originFileDir);
        await fs.mkdir(path.dirname(copiedFileDir), { recursive: true });
        const readStream = createReadStream(originFileDir);
        const writeStream = createWriteStream(copiedFileDir);
        readStream.pipe(writeStream);
        readStream.on("error", (err) => {
          console.log("Invalid input");
        });
        writeStream.on("error", (err) => {
          console.log("Operation failed");
        });
        writeStream.on("close", () => {
          console.log("File copied");
        });
      } catch (err) {
        if (err.code === "ERR_INVALID_ARG_TYPE") {
          console.log("Invalid input");
        } else console.log("Operation failed");
      }
      break;
    case "mv":
      try {
        const originFilePath = path.resolve(currentDir, args[0]);
        const movedFilePath = path.resolve(currentDir, args[1]);
        await fs.access(originFilePath);
        await fs.mkdir(path.dirname(movedFilePath), { recursive: true });
        const readStream = createReadStream(originFilePath);
        const writeStream = createWriteStream(movedFilePath);
        readStream.pipe(writeStream);
        readStream.on("error", (err) => {
          console.log("Invalid input");
        });
        writeStream.on("error", (err) => {
          console.log("Operation failed");
        });
        writeStream.on("close", async () => {
          await fs.unlink(originFilePath);
          console.log("File copied");
        });
      } catch (err) {
        if (err.code === "ERR_INVALID_ARG_TYPE") {
          console.log("Invalid input");
        } else console.log("Operation failed");
      }
      break;
    case "rm":
      try {
        const fileDir = path.resolve(currentDir, args[0]);
        await fs.access(fileDir);
        await fs.unlink(fileDir);
        console.log("File deleted");
      } catch (err) {
        if (err.code === "EPERM" || err.code === "ENOENT") {
          console.log("Invalid input");
        } else console.log("Operation failed");
      }
      break;
    case "os":
      if (args[0] === "--EOL") {
        console.log(`End-Of-Line: ${os.EOL}`);
      } else if (args[0] === "--cpus") {
        const cpus = os.cpus();
        console.log(cpus);
        console.log(`Total CPUs: ${cpus.length}`);
        cpus.forEach((cpu, i) => {
          console.log(`CPU ${i + 1}:`);
          console.log(`Model: ${cpu.model}`);
          console.log(`Speed: ${cpu.speed / 1000} GHz`);
        });
      } else if (args[0] === "--homedir") {
        const homedir = os.homedir();
        console.log(`Home directory is ${homedir}`);
      } else if (args[0] === "--username") {
        const userInfo = os.userInfo();
        console.log(`Current system user name is ${userInfo.username}`);
      } else if (args[0] === "--architecture") {
        const architecture = os.arch();
        console.log(`CPU Architecture: ${architecture}`);
      } else {
        console.log("Invalid input");
      }
      break;
    case "hash":
      try {
        const fileToHash = path.resolve(currentDir, args[0]);
        await fs.access(fileToHash);
        const hash = crypto.createHash("sha256");
        const input = createReadStream(fileToHash);
        input.on("readable", () => {
          const data = input.read();
          if (data) hash.update(data);
          else console.log(`Hash: ${hash.digest("hex")}`);
        });
      } catch (err) {
        console.log("Invalid input");
      }
      break;
    case "compress":
      try {
        const fileDir = path.resolve(currentDir, args[0]);
        const destinationDir = path.resolve(currentDir, args[1]);
        await fs.access(fileDir);
        await fs.mkdir(path.dirname(destinationDir), { recursive: true });
        const readStream = createReadStream(fileDir);
        const writeStream = createWriteStream(destinationDir);
        const compress = zlib.createBrotliCompress();
        readStream.pipe(compress).pipe(writeStream);
        console.log("File compressed");
      } catch (err) {
        if (err.code === "ERR_INVALID_ARG_TYPE") {
          console.log("Invalid input");
        } else console.log("Operation failed");
      }
      break;
    case "decompress":
      try {
        const fileDir = path.resolve(currentDir, args[0]);
        const destinationDir = path.resolve(currentDir, args[1]);
        await fs.access(fileDir);
        await fs.mkdir(path.dirname(destinationDir), { recursive: true });
        const readStream = createReadStream(fileDir);
        const writeStream = createWriteStream(destinationDir);
        const decompress = zlib.createBrotliDecompress();
        decompress.on("error", (err) => {
          console.log("Decompression failed:", err);
        });
        readStream.pipe(decompress).pipe(writeStream);
        console.log("File decompressed");
      } catch (err) {
        console.log(err);
        if (err.code === "ERR_INVALID_ARG_TYPE") {
          console.log("Invalid input");
        } else console.log("Operation failed");
      }
      break;
    case ".exit":
      console.log(messages.goodbye(username));
      process.exit(0);
    default:
      console.log("Invalid input");
  }
  console.log(messages.currentDir(currentDir));
});
