import readline from "readline";
import print, { getUsername } from "./messages.js";
import {
  addFile,
  copyFile,
  moveFile,
  printFile,
  removeFile,
  renameFile,
} from "./src/fs.js";
import { goTo, goUp, listDirectories } from "./src/wd.js";
import {
  printArchitecture,
  printCPUs,
  printEOL,
  printHomeDirectory,
  printUserName,
} from "./src/os.js";
import hashEncrypt from "./src/hash.js";
import { compress, decompress } from "./src/zlib.js";
import { ARCHITECTURE, CPUS, EOL, HOMEDIR, USERNAME } from "./src/constants.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const username = getUsername(process.argv[2]);
let currentDir = process.cwd();

print.hello(username);
print.currentDir(currentDir);

rl.on("line", async (input) => {
  const [command, ...args] = input.split(" ");

  switch (command) {
    case "up":
      currentDir = goUp(currentDir);
      break;
    case "cd":
      currentDir = await goTo(currentDir, args[0]);
      break;
    case "ls":
      await listDirectories(currentDir);
      break;
    case "cat":
      await printFile(currentDir, args[0]);
      break;
    case "add":
      addFile(currentDir, args[0]);
      break;
    case "rn":
      renameFile(currentDir, args[0], args[1]);
      break;
    case "cp":
      copyFile(currentDir, args[0], args[1]);
      break;
    case "mv":
      await moveFile(currentDir, args[0], args[1]);
      break;
    case "rm":
      removeFile(currentDir, args[0]);
      break;
    case "os":
      if (args[0] === EOL) printEOL();
      else if (args[0] === CPUS) printCPUs();
      else if (args[0] === HOMEDIR) printHomeDirectory();
      else if (args[0] === USERNAME) printUserName();
      else if (args[0] === ARCHITECTURE) printArchitecture();
      else print.invalidInput();
      break;
    case "hash":
      hashEncrypt(currentDir, args[0]);
      break;
    case "compress":
      compress(currentDir, args[0], args[1]);
      break;
    case "decompress":
      decompress(currentDir, args[0], args[1]);
      break;
    case ".exit":
      print.goodbye(username);
    default:
      print.invalidInput();
  }
  print.currentDir(currentDir);
});

rl.on("close", () => print.goodbye(username));
