/*jslint node*/
function flatten(data) {
    let result = "";
    if (data) {
        result = Object.entries(data, function (acc, [key, val]) {
            return acc + " " + key + "=" + val;
        }, "");
    }
    return result;
}
module.exports = function (config) {
    config.addPassthroughCopy("assets");
    config.addShortcode("flatten", flatten);
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
