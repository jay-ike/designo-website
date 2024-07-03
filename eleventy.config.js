/*jslint node*/
const {transform} = require("lightningcss");
const Image = require("@11ty/eleventy-img");
const {readFile} = require("node:fs");
const {promisify} = require("node:util");
const path = require("node:path");
const fileReader = promisify(readFile);
async function parseImage(src, alt, sizes="300,600") {
    const metadata = await Image(src, {
        formats: ["webp", "auto"],
        outputDir: "./_site/img",
        widths: sizes.split(",").map((val) => parseInt(val, 10)).filter(
            (val) => Number.isFinite(val)
        )
    });
    const blob = await fileReader(path.normalize(src))
    const imageAttributes = {
        alt,
        decoding: "async",
        loading: "lazy",
        sizes
    };
    imageAttributes.style = "background-size: var(--bg-size, cover); " +
        "background-image:url(" +
        "data:image/jpeg;base64," + blob.toString("base64") + ");color:" +
        "transparent;";
    return Image.generateHTML(metadata, imageAttributes);
}
async function parseCss({dir}, src) {
    const blob = await fileReader(path.normalize(
        `${dir.input}/${dir.includes}/${src}`
    ));
    const {code} = transform({
        filename: "style.css",
        code: blob,
        minify:true
    });
    return code.toString();
}

module.exports = function (config) {
    config.addPassthroughCopy("assets");
    config.addShortcode("image", parseImage);
    config.addPairedShortcode(
        "card",
        function (content, title, headingLevel = 2, style = "center") {
            return `<div class="${style}">
                <h${headingLevel}>${title}</h${headingLevel}>
                ${content}
            </div>`;
        }
    );
    config.addShortcode("cssmin", async function (src) {
        return parseCss(config, src);
    });
    return {
        dir: {
            includes: "_templates",
            input: "src",
            output: "_site"
        }
    };
};
