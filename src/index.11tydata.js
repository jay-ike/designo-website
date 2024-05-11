const {getFilePaths} = require("../utils");

async function getHero(data) {
    const images = await getFilePaths("src" + data.page.url);
    return images[0];
}

module.exports = Object.freeze({
    eleventyComputed: {
        hero: getHero
    },
    features: [
        {
            alt: "illustration of a designer enjoying sketching user interfaces",
            description: "Each project starts with an in-depth brand research to ensure we only create products that serve a purpose. We merge art, design, and technology into exciting new solutions.",
            tag: "passion",
            title: "Passionate"
        },
        {
            alt: "illustration of an engineer looking at plans in the wall while designing an interface with his tablet",
            description: "Everything that we do has a strategic purpose. We use an agile approach in all of our projects and value customer collaboration. It guarantees superior results that fulfill our clients’ needs.",
            tag: "resource",
            title: "Resourceful"
        },
        {
            alt: "illustration of a man and a woman sharing design insight with smile",
            description: "We are a group of enthusiastic folks who know how to put people first. Our success depends on our customers, and we strive to give them the best experience a company can provide.",
            tag: "friendship",
            title: "Friendly"
        }
    ],
    heading: {
        heroAlt: "a mobile phone with furnitures wallpaper image having the text 'frame'",
        description: "With over 10 years in the industry, we are experienced in creating fully responsive websites, app design, and engaging brand experiences. Find out more about our services.",
        title: "Award-winning custom designs and digital branding solutions"
    },
    images: {
        header: "src/images",
        services: [
        ]
    }
});
