/*jslint node*/
module.exports = function(config) {
    config.addPassthroughCopy("assets");
    config.addPairedShortcode(
        "feature",
        function(content, imgData, style = "center") {
            let markup = `<div class="${style}">

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
