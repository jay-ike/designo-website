module.exports = function (config) {
    config.addPassthroughCopy("assets");
    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_templates"
        }
    };
};
