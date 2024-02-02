const messages = {
  hello: (username) => `Welcome to the File Manager, ${username}!`,
  currentDir: (currentDir) => `You are currently in ${currentDir}`,
  goodbye: (username) =>
    `Thank you for using File Manager, ${username}, goodbye!`,
};

export const getUsername = (rawUsername) =>
  rawUsername.split("=")[1][0].toUpperCase() +
  rawUsername.split("=")[1].slice(1);

const print = {
  hello: (username) => console.log(messages.hello(username)),

  currentDir: (dir) => console.log(messages.currentDir(dir)),

  goodbye: (username) => {
    console.log(messages.goodbye(username));
    process.exit(0);
  },

  invalidInput: () => console.log("Invalid input"),

  operationFailed: () => console.log("Operation failed")
};

export default print;
