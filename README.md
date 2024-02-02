# Nodejs File Manager

This is a simple command-line file manager built with Node.js. It provides a set of commands to manage files and directories.

## Usage

To use the file manager, run the following command in your terminal:

```
npm run start -- --username=your_username
```

## Commands

Here are the commands you can use:

- `up`: Moves up one directory level.
- `cd <directoryName>`: Changes the current directory to the specified directory.
- `ls`: Lists all files and directories in the current directory.
- `cat <fileName>`: Prints the content of the specified file.
- `add <fileName>`: Creates a new empty file with the given name in the current directory.
- `rn <oldFileName> <newFileName>`: Renames the file with the old name to the new name in the current directory.
- `cp <sourceFileName> <destinationFileName>`: Copies the file with the source name to the destination name in the current directory.
- `mv <sourceFileName> <destinationFileName>`: Moves the file with the source name to the destination name in the current directory.
- `rm <fileName>`: Removes the file with the given name from the current directory.
- `os <option>`: Prints system information. Options are `--EOL` (end of line marker), `--cpus` (CPU info), `--homedir` (home directory), `--username` (user name), and `--architecture` (system architecture).
- `hash <fileName>`: Encrypts the file with the given name in the current directory.
- `compress <fileName> <destinationFileName>`: Compresses the file with the given name and saves it as the destination file name in the current directory.
- `decompress <fileName> <destinationFileName>`: Decompresses the file with the given name and saves it as the destination file name in the current directory.
- `.exit`: Exits the application.

## Closing the Application

To close the application, you can either use the `.exit` command or press `CTRL+C`.

## Error Handling

If you enter an invalid command or if a command fails, an error message will be printed to the console.