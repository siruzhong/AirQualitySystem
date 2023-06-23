function initMap() {
    window._AMapSecurityConfig = {
        securityJsCode: "b1997f139893c857e21d0be22054b106",
    };

    loadAMapAPI().then((AMap) => {
        const map = createMap();
        addControls(map);
        addTrafficLayer(map);
        addMarker(map);
        addPolyline(map);
        addCustomMarker(map);
        addPolygons(map);
    }).catch((e) => {
        console.error(e);
    });
}

function loadAMapAPI() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://webapi.amap.com/loader.js";
        script.onload = () => {
            AMapLoader.load({
                key: "6d68d1e990cb46c98388581e2f7b2974",
                version: "2.0"
            }).then((AMap) => {
                resolve(AMap);
            }).catch((error) => {
                reject(error);
            });
        };
        document.body.appendChild(script);
    });
}

// 创建地图对象
function createMap() {
    // 创建默认图层
    const defaultLayer = new AMap.createDefaultLayer({zooms: [3, 20], visible: true, opacity: 1, zIndex: 0});

    return new AMap.Map('container', {
        viewMode: '2D',
        zoom: 11,
        layers: [defaultLayer]
    });
}

// 添加地图控件
function addControls(map) {
    AMap.plugin('AMap.ToolBar', () => {
        const toolbar = new AMap.ToolBar({position: {top: '110px', right: '40px'}});
        map.addControl(toolbar);
    });

    AMap.plugin('AMap.ControlBar', () => {
        const controlBar = new AMap.ControlBar({position: {top: '10px', right: '10px'}});
        map.addControl(controlBar);
    });

    AMap.plugin('AMap.HawkEye', () => {
        const overView = new AMap.HawkEye();
        map.addControl(overView);
    });

    AMap.plugin('AMap.Scale', () => {
        const scale = new AMap.Scale();
        map.addControl(scale);
    });
}

// 添加实时交通图层
function addTrafficLayer(map) {
    const trafficLayer = new AMap.TileLayer.Traffic({autoRefresh: true, interval: 180});
    map.add(trafficLayer);
}

// 添加点标记
function addMarker(map) {
    const infoWindow = new AMap.InfoWindow({
        isCustom: true,
        content: '<div>Air quality prediction system</div>',
        offset: new AMap.Pixel(16, -45)
    });

    const onMarkerClick = function (e) {
        infoWindow.open(map, e.target.getPosition());
    };

    const marker = new AMap.Marker({position: [116.481181, 39.989792]});
    map.add(marker);
    marker.on('click', onMarkerClick);
}

// 添加折线
function addPolyline(map) {
    const lineArr = [
        [116.368904, 39.913423],
        [116.382122, 39.901176],
        [116.387271, 39.912501],
        [116.398258, 39.904600]
    ];

    const polyline = new AMap.Polyline({
        path: lineArr,
        strokeColor: "#3366FF",
        strokeWeight: 5,
        strokeStyle: "solid"
    });

    map.add(polyline);
}

// 添加自定义标记
function addCustomMarker(map) {
    const markerContent = '' +
        '<div class="custom-content-marker">' +
        '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">' +
        '   <div class="close-btn" onclick="clearMarker()">X</div>' +
        '</div>';

    const position = new AMap.LngLat(116.397428, 39.90923);
    const marker = new AMap.Marker({
        position: position,
        content: markerContent,
        offset: new AMap.Pixel(-13, -30)
    });

    map.add(marker);
}

// 添加多边形
function addPolygons(map) {
    function addPolygon(data) {
        const polygon = new AMap.Polygon({
            path: data,
            fillColor: '#ccebc5',
            strokeOpacity: 1,
            fillOpacity: 0.5,
            strokeColor: '#2b8cbe',
            strokeWeight: 1,
            strokeStyle: 'dashed',
            strokeDasharray: [5, 5]
        });

        polygon.on('mouseover', () => {
            polygon.setOptions({
                fillOpacity: 0.7,
                fillColor: '#7bccc4'
            });
        });

        polygon.on('mouseout', () => {
            polygon.setOptions({
                fillOpacity: 0.5,
                fillColor: '#ccebc5'
            });
        });

        map.add(polygon);
    }

    addPolygon(shanghai);
    addPolygon(suzhou);
    addPolygon(wuxi);
}

initMap();