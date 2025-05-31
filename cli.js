const {minify} = require("terser");
const util = require("util");
const path = require("path");
const fs = require("fs");
const process = require("process");
const read_file = util.promisify(fs.readFile);
const write_file = util.promisify(fs.writeFile);

const [input_dir, output_dir] = process.argv.slice(2);

function parse(pattern) {
    const regex_pattern = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
    return new RegExp("^" + regex_pattern + "$");
}

async function get_input_files(glob) {
    const dir = path.dirname(glob);
    const pattern = parse(path.basename(glob));
    let files = [];

    try {
        files = await fs.promises.readdir(dir, {withFileTypes: true});
        files = files.filter(
            (file) => file.isFile() && pattern.test(file.name)
        ).map((file) => path.join(dir, file.name))
    } catch (error) {
        console.error("error reading directory " + dir  + ": ", error.message);
    }
    return files;
}

async function minify_files(paths) {
    let ps;
    const stat = await fs.promises.stat(output_dir).catch(
        () => Promise.resolve({isDirectory: () => false})
    );
    if (!stat.isDirectory()) {
        await fs.promises.mkdir(
            path.join(process.cwd(), output_dir),
            {recursive: true}
        );
    }
    ps = paths.map(async function (file_path) {
        const abs_path = path.join(process.cwd(), file_path);
        const content = await read_file(abs_path);
        const  minified = await minify(content.toString("utf8"));
        return write_file(
            path.join(output_dir, path.basename(file_path)),
            minified.code,
            {encoding: "utf8", flag: "w+"}
        );
    });
    await Promise.all(ps);
}
get_input_files(input_dir).then(async function (files) {
    await minify_files(files);
    console.log("done minifying javascript files");
});
