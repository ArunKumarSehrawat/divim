import { readdir, readFile } from "node:fs/promises";
import { print } from "./divim.js";

export async function isDirectoryOrFile(path) {
    try {
        await readdir(path);
        return "DIRECTORY";
    } catch (error) {
        return "FILE";
    }
}