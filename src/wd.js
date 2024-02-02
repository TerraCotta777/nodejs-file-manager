import fs from "fs/promises";
import path from "path";
import print from "../messages.js";

export const goUp = (currentDir) => {
  try {
    if (path.dirname(currentDir) !== currentDir) {
      return path.dirname(currentDir);
    }
    return currentDir;
  } catch (error) {
    print.operationFailed();
  }
};

export const goTo = async (currentDir, dirToGo) => {
  if (!dirToGo) {
    print.invalidInput();
    return currentDir;
  }
  try {
    const newDir = path.resolve(currentDir, dirToGo);
    await fs.access(newDir);
    currentDir = newDir;
  } catch (error) {
    print.invalidInput();
  }
  return currentDir;
};

export const listDirectories = async (currentDir) => {
  try {
    const items = await fs.readdir(currentDir);
    const files = [];
    const directories = [];
    await Promise.all(items.map(async (item) => {
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
    }));
    const sortedDirectories = directories.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
    console.table([...sortedDirectories, ...sortedFiles]);
  } catch (err) {
    print.operationFailed();
  }
};
