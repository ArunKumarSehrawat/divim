#!/usr/bin/env node

/** Documentations
 * Enquirer: https://github.com/enquirer/enquirer
 * Listr: https://github.com/SamVerschueren/listr
 * Boxen: https://github.com/sindresorhus/boxen
 * Ora: https://github.com/sindresorhus/ora
 * Cli-Color: https://github.com/medikoo/cli-color
 */

import color from "cli-color";
import path from "node:path";
import { exec } from "node:child_process";
import fs from "node:fs";
import { isDirectoryOrFile } from "./utils.js";
import openFileEditor from "./fileEditor.js";
import Chalk from "chalk";

// process.stdout.write(color.reset);
// process.stdout.write(color.erase.screenLeft);

export const print = console.log;
const CURRENT_WORKING_DIRECTORY = process.cwd();
const ARG_Path = path.join(CURRENT_WORKING_DIRECTORY, process.argv[2] || ".");
const PATH_TYPE = await isDirectoryOrFile(ARG_Path);

switch (PATH_TYPE) {
    case "DIRECTORY": {
        print("Directory");
        break;
    }
    case "FILE": {
        openFileEditor(ARG_Path);
        break;
    }
    default:
        print(color.red("Please provide path to either a FILE or DIRECTORY"));
        break;
}


// print(Chalk.bgRgb(64, 150, 255).rgb(64, 150, 255)("\u0020"));