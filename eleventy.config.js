/*jslint node*/
const Image = require("@11ty/eleventy-img");
async function parseImage(src, alt, sizes="300,600") {
    const metadata = await Image(src, {
        formats: ["webp", "auto"],
        outputDir: "./_site/img",
        widths: sizes.split(",").map((val) => parseInt(val, 10)).filter(
            (val) => Number.isFinite(val)
        )
    });
    const imageAttributes = {
        alt,
        decoding: "async",
        loading: "lazy",
        sizes
    };
    return Image.generateHTML(metadata, imageAttributes);
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
    return {
        dir: {
            includes: "_templates",
            input: "src",
            output: "_site"
        }
    };
};
