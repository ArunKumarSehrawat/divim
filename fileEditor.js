import { readFile } from "node:fs/promises";
import readline from "readline";
import color from "cli-color";
import { print } from "./divim.js";

export default async function openFileEditor(path) {
    const CURSOR_POS = { x: 1, y: 1, xOffset: 3, yOffset: 0 };
    const [COLUMNS, ROWS] = process.stdout.getWindowSize();
    let DATA = await readFile(path, { encoding: "utf8" });
    let LINES = DATA.split("\n").map((line, index, arr) => ({ lineNumber: normalizeLineNumbers(index + 1, arr.length), content: line }));

    // register keypress event handler on the stdin
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.on("keypress", handleKeypresses);

    try {
        displayText(LINES);

        if (LINES.length < ROWS) process.stdout.write(color.move.to(4, 1));
        else process.stdout.write(color.move.to(4, 0));
    } catch (error) {
        print(color.bgRed(error.message, error.stack));
        print(color.red("Closing DIVIM..."));
        process.exit();
    }

    function normalizeLineNumbers(currentNumber, length) {
        return String(currentNumber).padStart(String(length).length, " ");
    }

    function handleKeypresses(string, key) {
        if (key && key.ctrl && key.name === "c") process.exit();

        switch (key.name) {
            case key.ctrl && key.name === "c":
                process.exit();
            case "up":
                moveCursor(0, -1);
                break;
            case "right":
                moveCursor(1, 0);
                break;
            case "down":
                moveCursor(0, 1);
                break;
            case "left":
                moveCursor(-1, 0);
                break;
            default:
                break;
        }
    }

    function moveCursor(x, y) {
        readline.moveCursor(process.stdout, x, y);
    }

    function displayText(lines) {
        for (const { lineNumber, content } of lines) {
            if (lineNumber < ROWS - 1) {
                if (lineNumber == CURSOR_POS.y) print(color.red(lineNumber) + "\u2502", content.replaceAll("\r", ""));
                else print(lineNumber + "\u2502", content.replaceAll("\r", ""));
            }
        }
    }
}
