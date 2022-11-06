import React, { useEffect } from "react";

const Map = ({ location }) => {
    useEffect(() => {
        var container = document.getElementById("map");

        var options = {
            center: new window.kakao.maps.LatLng(37.365264512305174, 127.10676860117488),
            level: 3,
        };
        var map = new window.kakao.maps.Map(container, options);

        var marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(37.537187, 127.005476),
            map: map,
        });

        var geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(location, function (results, status) {
            if (status === window.kakao.maps.services.Status.OK) {
                var result = results[0];

                var coords = new window.kakao.maps.LatLng(result.y, result.x);
                map.relayout();
                map.setCenter(coords);
                marker.setPosition(coords);
            }
        });
    });

    return (
        <div>
            <div id="map" style={{ width: "100%", height: "400px" }}></div>
        </div>
    );
};
export default Map;
