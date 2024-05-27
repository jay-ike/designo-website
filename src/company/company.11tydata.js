const { mapedImages } = require("../../utils");

const metadatas = {
    about: {
        hero: {
            alt: "a group of people discussing product strategy during a meeting",
            paragraphs: [
                "Founded in 2010, we are a creative agency that produces lasting results for our clients. We’ve partnered with many startups, corporations, and nonprofits alike to craft designs that make real impact. We’re always looking forward to creating brands, products, and digital experiences that connect with our clients’ audiences."
            ],
            title: "about us"
        },
        talent: {
            alt: "a young lady taking inspiration from pictures on the wall",
            paragraphs: [
                "We are a crew of strategists, problem-solvers, and technologists. Every design is thoughtfully crafted from concept to launch, ensuring success in its given market. We are constantly updating our skills in a myriad of platforms.   ",
                "Our team is multi-disciplinary and we are not merely interested in form — content and meaning are just as important. We give great importance to craftsmanship, service, and prompt delivery. Clients have always been impressed with our high-quality outcomes that encapsulates their brand’s story and mission."
            ],
            title: "World-class talent"
        },
        deal: {
            alt: "a designer trying to solve design problems by gluing his mood board on the wall",
            paragraphs: [
                "As strategic partners in our clients’ businesses, we are ready to take on any challenge as our own. Solving real problems require empathy and collaboration, and we strive to bring a fresh perspective to every opportunity. We make design and technology more accessible and give you tools to measure success.",
                "We are visual storytellers in appealing and captivating ways. By combining business and marketing strategies, we inspire audiences to take action and drive real results."
            ],
            title: "The real deal"
        }
    },
    locations: {
        "australia": {
            alt: "a screen shot of the address '19 Balonne Street' of our australian office in a map",
            details: [
                {
                    term: "Designo AU Office",
                    descriptions: ["19 Balonne Street", "New South Wales 2443"]
                },
                {
                    term: "Contact",
                    descriptions: ["Phone : (02) 6720 9092", "Email : contact@designo.au"]
                }
            ]
        },
        "canada": {
            alt: "a screenshot of the address '3886 Wellington Street' of our central office in a map",
            details: [
                {
                    term: "Designo Central Office",
                    descriptions: ["3886 Wellington Street", "Toronto, Ontario M9C 3J5"]
                },
                {
                    term: "Contact",
                    descriptions: ["Phone : +1 253-863-8967", "Email : contact@designo.co"]
                }
            ]
        },
        "uk": {
            alt: "a screenshot of the address '13 Colorado Way' of our UK office in a map",
            details: [
                {
                    term: "Designo UK Office",
                    descriptions: ["13 Colorado Way", "Rhyd-y-fro SA8 9GA"]
                },
                {
                    term: "Contact",
                    descriptions: ["Phone : 078 3115 1400", "Email : contact@designo.co.uk"]
                }
            ]
        }

    }
};


module.exports = Object.freeze({
    eleventyComputed: {
        images: mapedImages((data) => metadatas[data.page.fileSlug])
    },
    locations: [
        {
            alt: "illustration of the city of toronto in canada",
            tag: "toronto",
            title: "canada"
        },
        {
            alt: "illustration of the city of sydney in australia",
            tag: "sydney",
            title: "australia"
        },
        {
            alt: "illustration of the city of london in england",
            tag: "london",
            title: "united kingdom"
        }
    ],
    stylePath: "/assets/company.css"
});
