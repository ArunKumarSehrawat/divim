import { readdir, readFile } from "node:fs/promises";
import readline from "readline";
import color from "cli-color";
import { print } from "./divim.js";

export async function isDirectoryOrFile(path) {
    try {
        await readdir(path);
        return "DIRECTORY";
    } catch (error) {
        return "FILE";
    }
}

export async function loadFileEditor(path) {
    // readline.emitKeypressEvents(process.stdin);
    // if (process.stdin.isTTY) process.stdin.setRawMode(true);

    // process.stdin.on("keypress", (string, key) => {
    //     if (key && key.ctrl && key.name === "c") process.exit();

    //     print(key.name);
    // });

    try {
        const data = await readFile(path, { encoding: "utf8" });
        const totalLines = data.split("\n").length;

        for(let i = 1; i <= totalLines; i++) {
            print(normalizeLineNumbers(i, totalLines) + "|");
        }

    } catch (error) {
        print(color.bgRed(error.message));
        print(color.red("Closing DIVIM..."));
        process.exit();
    }
}

/**
 * 
 * @param {number} currentNumber 
 * @param {number} length 
 */
function normalizeLineNumbers(currentNumber, length) {
    return String(currentNumber).padEnd(String(length).length, " ")
}
