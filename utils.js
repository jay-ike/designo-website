const fs = require("fs");
const path = require("path")
const utils = require("util");
const readdir = utils.promisify(fs.readdir);

async function getFilePaths(workingDir, extensions= /(jpg|png|gif|jpeg)/i) {
    const files = await readdir(workingDir, {withFileTypes: true});
    return files.filter(
        (entry) => entry.isFile() && path.extname(entry.name).match(extensions)
    ).map((entry) => path.normalize(entry.path + "/" + entry.name));
}

module.exports = Object.freeze({
    basename: (val) => path.basename(val, path.extname(val)),
    getFilePaths
});
