// Display map
mapboxgl.accessToken = 'pk.eyJ1Ijoic2lydXpob25nIiwiYSI6ImNsamJpNXdvcTFoc24zZG14NWU5azdqcjMifQ.W_2t66prRsaq8lZMSdfKzg';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/siruzhong/clmr3ruds027p01pj91ajfoif/draft', // style URL
    center: [116.173553, 40.09068], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// 使用PapaParse将CSV转换为GeoJSON
function csvToGeoJSON(csv) {
    const geojson = {
        type: 'FeatureCollection',
        features: []
    };

    Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            results.data.forEach(row => {
                const feature = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
                    },
                    properties: row
                };
                geojson.features.push(feature);
            });
        }
    });

    return geojson;
}

map.on('load', function () {
    // Convert your CSV data to GeoJSON
    const geojsonData = csvToGeoJSON(station_data);

    // Add data source
    map.addSource('stations', {
        type: 'geojson',
        data: geojsonData
    });

    // Add data layer
    map.addLayer({
        id: '1085-stations-1cyyg4',
        type: 'circle',
        source: 'stations',
        paint: {
            'circle-radius': 4,
            'circle-color': '#64b4b9'
        },
    });
});


// Display map menus
// const layerList = document.getElementById('menu');
// const inputs = layerList.getElementsByTagName('input');
//
// for (const input of inputs) {
//     input.onclick = (layer) => {
//         const layerId = layer.target.id;
//         map.setStyle('mapbox://styles/mapbox/' + layerId);
//     };
// }

var popup = new mapboxgl.Popup({
    closeOnClick: false,
    closeButton: false,
});

// Display data in popup on mouseover
map.on('mouseenter', '1085-stations-1cyyg4', function (e) {
    const clickedData = e.features[0].properties;

    popup.setLngLat(e.lngLat)
        .setHTML(`
                <div class="popup-header">
                    ${clickedData.name_Chinese} (${clickedData.name_Pinyin})
                </div>
                <div class="popup-body">
                    <p><strong>District ID:</strong> ${clickedData.district_id}</p>
                    <p><strong>Latitude:</strong> ${clickedData.latitude}</p>
                    <p><strong>Longitude:</strong> ${clickedData.longitude}</p>
                </div>
            `)
        .addTo(map);

    map.getCanvas().style.cursor = 'pointer';
});

// Remove data when mouseleave
map.on('mouseleave', '1085-stations-1cyyg4', function () {
    map.getCanvas().style.cursor = '';
    popup.remove();
});

// Location search box
const coordinatesGeocoder = function (query) {
    // Match anything which looks like
    // decimal degrees coordinate pair.
    const matches = query.match(
        /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
    );
    if (!matches) {
        return null;
    }

    function coordinateFeature(lng, lat) {
        return {
            center: [lng, lat],
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            place_name: 'Lat: ' + lat + ' Lng: ' + lng,
            place_type: ['coordinate'],
            properties: {},
            type: 'Feature'
        };
    }

    const coord1 = Number(matches[1]);
    const coord2 = Number(matches[2]);
    const geocodes = [];

    if (coord1 < -90 || coord1 > 90) {
        // must be lng, lat
        geocodes.push(coordinateFeature(coord1, coord2));
    }

    if (coord2 < -90 || coord2 > 90) {
        // must be lat, lng
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    if (geocodes.length === 0) {
        // else could be either lng, lat or lat, lng
        geocodes.push(coordinateFeature(coord1, coord2));
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    return geocodes;
};

// Add the location search box to the map.
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        zoom: 4,
        placeholder: 'Search here ...',
        mapboxgl: mapboxgl,
        reverseGeocode: true
    })
);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());


// Add a scale control to the map
map.addControl(new mapboxgl.ScaleControl());


// https://docs.mapbox.com/mapbox-gl-js/example/data-join/