#! /usr/bin/env node

async function main() {
    const { program } = require('commander');
    const fs = require('fs');
    const path = require('path');
    const parser = require('./parser');

    program.version('0.1.0');
    program
        .option('-i, --input <filename>', 'env description file', 'env.json')
        .option('-d, --dir <directory>', 'output directory', '.')
        .parse(process.argv)

    const infile = JSON.parse(fs.readFileSync(program.input));
    const obj = parser.parse(infile);
    const outputs = {}

    if(obj.source === 'gcp') {
        const gcp = require('./generator-gcp');
        await gcp.generate(obj.env, outputs);
    } else if(obj.source === 'aws') {
        throw Error('Not Implemented AWS');
    } else {
        throw Error('Unknown source type')
    }

    for (let filename in outputs) {
        const data = outputs[filename];

        fs.writeFileSync(path.join(program.dir, filename), data);

        console.log(`Generated ${filename}`);
    }
}

main().catch(console.error);