
const { basename, getFilePaths } = require("../../utils");
const services = {
    "web-design": {
        alt: "screen of an engineer's laptop crafting a website",
		link: "",
        title: "web design",
    },
    "app-design": {
        alt: "showcasing a mobile app in the launch phase",
		link: "",
        title: "app design",
    },
    "graphic-design": {
        alt: "an artwork with black and white drawings looking original",
		link: "",
        title: "graphic design",
    }
}

module.exports = {
    services: async function() {
        const highService = "web-design";
        let result = await getFilePaths("src/images/services");
        result = result.filter(
            (val) => services[basename(val)] !== undefined
        ).map(function(val) {
            const topic = basename(val);
            const service = {path: val, topic};
            return Object.assign(service, services[topic]);
        }).sort(function (service1, service2) {
            if (service1.topic === highService) {
                return -1;
            }
            if (service2.topic === highService) {
                return 1;
            }
            return 0;
        });
        return result;
    },
}
