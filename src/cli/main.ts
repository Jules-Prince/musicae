import chalk from 'chalk';
import { Command } from 'commander';
import { MusicaeLanguageMetaData } from '../language/generated/module.js';
import { createMusicaeServices } from '../language/musicae-module.js';
import { extractAstNode } from './cli-util.js';
import { generateMusicFile } from './generator.js';
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Music } from '../language/generated/ast.js';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fs.readFile(packagePath, 'utf-8');

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createMusicaeServices(NodeFileSystem).Musicae;
    const model = await extractAstNode<Music>(fileName, services);
    const generatedFilePath = generateMusicFile(model, fileName, opts.destination, opts.play);
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
    play?: boolean;
}

export default function(): void {
    const program = new Command();

    program.version(JSON.parse(packageContent).version);

    const fileExtensions = MusicaeLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .option('-p, --play', 'play midi file after creation')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program.parse(process.argv);
}
