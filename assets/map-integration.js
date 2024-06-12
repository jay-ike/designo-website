
const addresses = {
    australia: {lat: "-32.194109", lng: "152.522148"},
    canada: {lat: "43.6440875", lng: "-79.5803413"},
    uk: {lat: "51.7333267", lng: "-3.8632582"}
};
function createMap(element, center) {
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
    });
    const map = L.map(element, {
        center: [center.lat, center.lng],
        layers: [osm],
        renderer: L.svg(),
        zoom: 15
    });
    const marker = L.marker([center.lat, center.lng], {
        alt: `The location of our ${element.id} office`,
        title: `our ${element.id} office`
    });
    marker.bindPopup(`<p>Here is our ${element.id} company</p>`).addTo(map);
}
document.querySelectorAll(".no-js").forEach(function (el) {
    el.classList.remove("no-js");
});

window.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".map-view").forEach(function (element) {
        if (addresses[element.id]) {
            createMap(element, addresses[element.id]);
        }
    });
});


