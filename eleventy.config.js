/*jslint node*/
const {transform} = require("lightningcss");
const {readFile, writeFile} = require("node:fs");
const {promisify} = require("node:util");
const path = require("node:path");
const {randomBytes} = require("node:crypto");
const fs = {read: promisify(readFile), write: promisify(writeFile)};

function getSize(width) {
    return (
        width <= 375
        ? `(max-width: 30em) ${width}px`
        : `${width}px`
    );
}
function getAttributes(metadata, sizeGetter) {
    let result = Object.values(metadata).reduce(function (acc, val) {
        val.forEach(function (img) {
            const {format, height, srcset, url, width} = img;
            const size = sizeGetter(width);
            if (width <= acc.width) {
                acc.width = width;
                acc.height = height;
                if (format === "webp") {
                    acc.src = url;
                    acc.srcset.unshift(srcset);
                    acc.sizes.unshift(size);
                }
                if (format !== "webp" && acc.src) {
                    acc.srcset = [acc.srcset[0], srcset].concat(
                        acc.srcset.slice(1)
                    );
                    acc.sizes = [acc.sizes[0], size].concat(
                        acc.sizes.slice(1)
                    );
                }
            } else {
                acc.srcset.push(srcset);
                acc.sizes.push(size);
            }
        });
        return acc;
    }, {sizes: [], srcset: [], width: Number.MAX_SAFE_INTEGER});
    result.srcset = result.srcset.join(", ");
    result.sizes = result.sizes.join(", ");
    return result;
}
async function parseImage(src, alt, sizes = "300,600") {
    let tmp;
    const img = await import("@11ty/eleventy-img");
    const blob = await img.default(src, {
        dryRun: true,
        formats: "png",
        widths: [50]
    }).then((res) => res.png[0].buffer);
    const metadata = await img.default(src, {
        formats: ["webp", "auto"],
        outputDir: "./_site/assets/images/website",
        urlPath: "/assets/images/website/",
        widths: sizes.split(",").map((val) => parseInt(val, 10)).filter(
            (val) => Number.isFinite(val)
        )
    });
    const attributes = getAttributes(metadata, getSize);
    Object.assign(attributes, {alt, decoding: "async", loading: "lazy"});
    attributes.style = "background-size: var(--bg-size, cover); ";
    attributes.style += "background-image:url(data:image/jpeg;base64,";
    attributes.style += blob.toString("base64") + ");color:transparent;";
    tmp = Object.entries(attributes).reduce(function (acc, entry) {
        return acc + ` ${entry[0]}="${entry[1]}"`;
    }, "");
    return `<img ${tmp}>`;
}
async function parseCode({dir}, src, filename = "style.css") {
    const blob = await fs.read(path.normalize(
        `${dir.input}/${dir.includes}/${src}`
    ));
    const {code} = transform({code: blob, filename, minify: true});
    return code.toString();
}


module.exports = function (config) {
    const nonce = randomBytes(16).toString("base64");
    config.addGlobalData("nonce", nonce);
    config.addPassthroughCopy("assets");
    config.setDataFileSuffixes([".11tydata"]);
    config.addShortcode("image", parseImage);
    config.addShortcode("cssmin", async function (src) {
        let res = await parseCode(config, src);
        return res;
    });
    config.addNunjucksFilter("split", function (value, separator) {
        return (
            value
            ? value.toString().split(separator ?? "")
            : ""
        );
    });
    config.addTransform("csp-nonce", function (content, outputPath) {
        if (outputPath && outputPath.endsWith(".html")) {
            return content.replace(
                /<script(?![^>]*\bnonce=)/g,
                `<script nonce="${nonce}"`
            );
        }
        return content;
    });
    config.on("eleventy.after", async function ({runMode}) {
        let tmp =  `'self' nonce-${nonce}`;
        tmp = {
            headers: [{source: "/(.*)", headers: [
                {
                    key: "Content-Security-Policy",
                    value: `default-src 'self'; script-src ${tmp}; style-src` +
                    " 'self' 'unsafe-inline'; img-src 'self' data: https:; " +
                    "font-src 'self' data: https:; connect-src 'self'; " +
                    "object-src 'none'; base-uri 'self'; form-action 'self'; " +
                    "frame-ancestors 'none';"
                }
            ]}]
        };
        if (runMode === "build") {
            await fs.write("vercel.json", JSON.stringify(tmp, null, 2));
            console.log("Generated vercel.json with calculated CSP script hashes.");
        }
    });
    return {
        dir: {includes: "_templates", input: "src", output: "_site"}
    };
};
