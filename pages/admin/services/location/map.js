import React, { useState } from 'react'
import { DrawingManager, GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';

const containerStyle = {
    width: '100%', height: '60vh'
};

const center = {
    lat: 22.826780882542728, lng: 89.5372287951233
};

const arrayToObj = arr => {
    const mapView = []
    for (let i = 0; i < arr?.length; i++) {
        mapView.push({ lat: arr[i][1], lng: arr[i][0] })
    }
    return mapView
}


function ServiceLocationMap({ setLocationList, LocationList, coordinatesData, centerLocation }) {
    function getPaths(polygon) {
        let polygonBounds = polygon.getPath();
        let bounds = [];
        for (let i = 0; i < polygonBounds.length; i++) {
            let point = {
                lng: polygonBounds.getAt(i).lng(), lat: polygonBounds.getAt(i).lat()
            };
            const propertyNames = Object.values(point);
            bounds.push(propertyNames);
        }
        setLocationList(bounds)
    }

    return (
        <LoadScript
            googleMapsApiKey={process.env.google_map}
            libraries={["drawing"]}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={!!centerLocation?.lat ? { lat: centerLocation.lat, lng: centerLocation.lng } : center}
                zoom={7}
            >
                <Polygon
                    path={coordinatesData?.coordinates?.length > 0 ? arrayToObj(coordinatesData?.coordinates[0]) : arrayToObj(LocationList)}
                    key={1}
                    editable={true}
                    options={{
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#FF0000",
                        fillOpacity: 0.35
                    }}
                />
                <DrawingManager
                    drawingMode='polygon'
                    onPolygonComplete={value => getPaths(value)}
                />
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(ServiceLocationMap)
