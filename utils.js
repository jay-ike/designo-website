const fs = require("fs");
const path = require("path")
const utils = require("util");
const readdir = utils.promisify(fs.readdir);
const basename = (val) => path.basename(val, path.extname(val));

async function getFilePaths(workingDir, extensions= /(jpg|png|gif|jpeg)/i) {
    const files = await readdir(workingDir, {withFileTypes: true});
    return files.filter(
        (entry) => entry.isFile() && path.extname(entry.name).match(extensions)
    ).map((entry) => path.normalize(entry.path + "/" + entry.name));
}
function getImages(metadatas) {
    return async function (data) {
        const images = await getFilePaths("src" + data.page.url);
        const projects = metadatas[data.page.fileSlug];
        if (projects === undefined) {
            return [];
        }
        return images.map(function(path) {
            const tag = basename(path);
            if (projects[tag] === undefined) {
                return undefined;
            }
            return Object.assign({path}, projects[tag]);
        }).filter((val) => val !== undefined);
    };
}

function mapedImages(map) {
    return async function (data) {
        let meta = map;
        const images = await getFilePaths("src" + data.page.url);
        if (typeof map === "function") {
            meta = map(data);
        }
        return images.reduce(function (acc, path) {
            const tag = basename(path);
            if (meta !== undefined && meta[tag]) {
                acc[tag] = Object.assign({path}, meta[tag]);
            }
            return acc;
        }, Object.create(null));
    };
}

module.exports = Object.freeze({
    basename,
    getFilePaths,
    getImages,
    mapedImages
});
