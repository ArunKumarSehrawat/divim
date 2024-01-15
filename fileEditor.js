import { readFile } from "node:fs/promises";
import readline from "readline";
import color from "cli-color";
import { print } from "./divim.js";
import { execSync } from "node:child_process";

export default async function openFileEditor(path) {
    const CURSOR_POS = { x: 1, y: 1, xOffset: 3, yOffset: 0 };
    const [COLUMNS, ROWS] = process.stdout.getWindowSize();
    const LINE_NUMBERS = [];
    const DATA = await readFile(path, { encoding: "utf8" });
    const LINES = DATA.split("\n").reduce((acc, line, index, arr) => {
        LINE_NUMBERS.push(index + 1);
        CURSOR_POS.xOffset = (String(index + 1) + "|").length + 1;
        return { ...acc, [index + 1]: line };
    }, {});

    // register keypress event handler on the stdin
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.on("keypress", handleKeypresses);
    // process.stdout.on("resize", function resizeHandler() {})

    try {
        displayText(LINES);

        if (LINE_NUMBERS.length < ROWS) process.stdout.write(color.move.to(CURSOR_POS.xOffset, 1));
        else process.stdout.write(color.move.to(CURSOR_POS.xOffset, 0));
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
                editText(key.name);
                break;
        }
    }

    function moveCursor(x, y) {
        readline.moveCursor(process.stdout, x, y);
        CURSOR_POS.x = CURSOR_POS.x + x;
        CURSOR_POS.y = CURSOR_POS.y + y;
    }

    function displayText(lines) {
        clearScreen();

        for (const [lineNumber, content] of Object.entries(lines)) {
                if (lineNumber == CURSOR_POS.y) print(color.red(normalizeLineNumbers(lineNumber, LINE_NUMBERS.length)) + "\u2502", content.replaceAll("\r", ""));
                else print(normalizeLineNumbers(lineNumber, LINE_NUMBERS.length) + "\u2502", content.replaceAll("\r", ""));
        }
    }

    function editText(key) {
        // console.log(LINES[CURSOR_POS.y]);
        displayText(LINES)
    }

    async function clearScreen() {
        // process.stdout.write(color.erase.screen);
        const data = execSync("clear");
        console.log(data)
    }
}
