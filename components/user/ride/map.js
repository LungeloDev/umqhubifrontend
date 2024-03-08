import React, {useEffect, useState} from 'react'
import {GoogleMap, LoadScript, Data, Marker} from '@react-google-maps/api';
import Geocode from "react-geocode";
import {useDispatch} from "react-redux";
import {storeMyLocation} from "../../../redux/user-ride/actions";

Geocode.setApiKey(process.env.google_map);
Geocode.setLanguage("en");

const containerStyle = {
    width: '100%', height: '100vh'
};

const arrayToObj = arr => {
    const mapView = []
    for (let i = 0; i < arr?.length; i++) {
        mapView.push({lat: arr[i][1], lng: arr[i][0]})
    }
    return mapView
}


function ServiceLocationMap({setLocation, setAddress}) {
    const dispatch = useDispatch()
    const [currentLocation, setCurrentLocation] = useState({lat: 0, lng: 0});

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const {latitude, longitude} = position.coords;
                    setCurrentLocation({lat: latitude, lng: longitude});
                    setLocation({lat: latitude, lng: longitude})
                    dispatch(storeMyLocation({lat: latitude, lng: longitude}))
                },
                error => {
                    alert('Geolocation is not supported by this browser or allow browser location.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser or allow browser location.');
        }
    }, []);

    const handleMapClick = event => {
        const latLng = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        setLocation(latLng)
        setCurrentLocation(latLng)
        handleAddress({lat: event.latLng.lat(), lng: event.latLng.lng()})
    };

    const onLoad = marker => {}

    useEffect(() => {
        handleAddress({lat: currentLocation?.lat, lng:currentLocation?.lng})
    },[currentLocation?.lat])

    const handleAddress = ({lat, lng}) => {
        if (lat > 0) {
            Geocode.fromLatLng(lat, lng).then(
                (response) => {
                    const addr = response.results[0].formatted_address;
                    setAddress({address: addr})
                },
                (error) => {
                    console.error(error);
                }
            );
        }
    }

    return (
        <LoadScript
            googleMapsApiKey={process.env.google_map}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentLocation}
                zoom={12}
                onClick={handleMapClick}
            >
                <Marker
                    onLoad={onLoad}
                    position={currentLocation}
                    clickable={true}
                />
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(ServiceLocationMap)
