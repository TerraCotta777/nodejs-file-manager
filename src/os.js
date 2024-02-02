import os from "os";

export const printEOL = () => console.log(`End-Of-Line: ${os.EOL}`);

export const printCPUs = () => {
  const cpus = os.cpus();
  console.log(`Total CPUs: ${cpus.length}`);
  cpus.forEach((cpu, i) => {
    console.log(`CPU ${i + 1}:`);
    console.log(`Model: ${cpu.model}`);
    console.log(`Speed: ${cpu.speed / 1000} GHz`);
  });
};

export const printHomeDirectory = () => {
  const homedir = os.homedir();
  console.log(`Home directory is ${homedir}`);
};

export const printUserName = () => {
  const userInfo = os.userInfo();
  console.log(`Current system user name is ${userInfo.username}`);
};

export const printArchitecture = () => {
  const architecture = os.arch();
  console.log(`CPU Architecture: ${architecture}`);
};
