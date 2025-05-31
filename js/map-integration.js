const {maplibregl} = window;
const addresses={
    australia:{
        lat: -32.194109,
        lng: 152.522148
    },
    canada: {
        lat: 43.6440875,
        lng: -79.5803413
    },
    uk: {
        lat: 51.7333267,
        lng: -3.8632582
    }
};

function createIcon() {
    let result = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    result.setAttribute("width", 24);
    result.setAttribute("height", 24);
    result.setAttribute("aria-hidden", true);
    result.innerHTML = "<use href='/assets/sprites.svg#office_location'></use>";
    return result;
}

function createMap({lat, lng, id}) {
    let map;
    if (! window.maplibregl.Map) {
        console.warn("maplibregl is not loaded !!!");
        return;
    }
    map = new maplibregl.Map({
        attributionControl: false,
        container: id,
        style: "https://api.maptiler.com/maps/streets-v2/style.json?key=Jt275rwxXUkKMHsD7UdZ",
        center: [lng, lat],
        zoom: 15
    });
    map.on('load', function() {
        map.addControl(new maplibregl.NavigationControl(), "top-right");
        map.addControl(new maplibregl.GeolocateControl({
            positionOptions: {enableHighAccuracy: true},
            trackUserLocation: true,
            showUserHeading: true
        }), 'top-left');
        map.addControl(new maplibregl.ScaleControl(), 'bottom-left');
        map.addControl(new maplibregl.AttributionControl({compact: false}));
    });
    new maplibregl.Marker({
        anchor: "bottom",
        element: createIcon()
    }).setLngLat([lng, lat]).addTo(map).setPopup(new maplibregl.Popup({
            offset: [0, 25]
    }).setHTML("Designo " + id.toUppercase()));

}
document.querySelectorAll(".no-js").forEach((function(e){e.classList.remove("no-js")})),
window.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".map-view").forEach(function (element) {
        let copy;
        if (addresses[element.id]) {
            copy = Object.assign({}, addresses[element.id]);
            createMap(Object.assign(copy, {id: element.id}));
        }
    });
});
