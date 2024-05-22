const { getFilePaths, basename } = require("../../utils");
const metadatas = {
    app: {

        airfilter: {
            description: "Solving the problem of poor indoor air quality by filtering the air",
            title: "Airfilter"
        },
        eyecam: {
            description: "Product that lets you edit your favorite photos and videos at any time",
            title: "Eyecam"
        },
        faceit: {
            description: "Get to meet your favorite internet superstar with the faceit app",
            title: "Faceit"
        },
        loopstudios: {
            description: "A VR experience app made for Loopstudios",
            title: "Loopstudios"
        },
        todo: {
            description: "A todo app that features cloud sync with light and dark mode",
            title: "Todo"
        }
    },
    graphic: {
        "tim brown": {
            description: "A book cover designed for Tim Brown’s new release, ‘Change’",
            title: "Tim Brown"
        },
        "box water": {
            description: "A simple packaging concept made for Boxed Water",
            title: "Boxed water"
        },
        science: {
            description: "A poster made in collaboration with the Federal Art Project",
            title: "Science!"
        }
    },
    web: {
        blogr: {
            alt: "a screenshot of the blogr website showcasing the features provided for publishing a blog or publication",
            description: "Blogr is a platform for creating an online blog or publication",
            title: "Blogr"
        },
        builder: {
            alt: "a screenshot of the buildr website explaining how to hire a contractor within their platform",
            description: "Connects users with local contractors based on their location",
            title: "Builder"
        },
        camp: {
            alt: "a screenshot of the camp website showcasing the available plans for training in UX design, front end web and data analytics",
            description: "Get expert training in coding, data, design, and digital marketing",
            title: "Camp"
        },
        express: {
            alt: "a screenshot of the express landing page highlighting the advantages of the shipping service",
            description: "A multi-carrier shipping website for ecommerce businesses",
            title: "express"
        },
        photon: {
            alt: "a screenshot of the photon music player landing page showcasing the high quality sound-effects it provide",
            description: "A state-of-the-art music player with high - resolution audio and DSP effects",
            title: "Photon"
        },
        transfer: {
            alt: "a screenshot of the transfer landing page emphasizing the speed of their transactions with the low cost of their services",
            description: "Site for low-cost money transfers and sending money within seconds",
            title: "Transfer"
        }
    }

};
async function getProjects(data) {
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
}

module.exports = Object.freeze({
    eleventyComputed: {
        getProjects
    },
    stylePath: "/assets/services.css"
});
