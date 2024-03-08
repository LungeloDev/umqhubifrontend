import {GoogleMap, Marker, Polyline, useJsApiLoader} from "@react-google-maps/api";
import {useEffect, useState} from "react";
import {fetchPolyline} from "../../helpers/backend_helper";
import {decodePolyline} from "../../helpers/map";

const MapView = () => {
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: process.env.google_map
    })

    const [center, setCenter] = useState({
        lat: -3.745,
        lng: -38.523
    })
    const [zoom, setZoom] = useState(14)
    let [point, setPoint] = useState(undefined)
    const [line, setLine] = useState([])


    useEffect(() => {
        window.setCurrentLocation = (lat, lng) => {
            setCenter({lat, lng})
            setPoint({lat, lng})
        }
        window.showRoute = (lat1, lng1, lat2, lng2) => {
            fetchPolyline({
                origin: `${lat1},${lng1}`,
                destination: `${lat2},${lng2}`,
            }).then(({error, data}) => {
                if (error === false) {
                    setLine(decodePolyline(data))
                    setZoom(13)
                }
            })
        }

        window.clearRoute = () => {
            setLine([])
        }

    }, [])

    useEffect(() => {
        if (line.length > 0) {
            setCenter(line[0])
            setPoint(undefined)
        }

    }, [line])

    return (
        <>
            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={{width: '100vw', height: '100vh'}}
                    center={center}
                    zoom={zoom}
                    options={{
                        fullscreenControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        zoomControl: false,
                        keyboardShortcuts: false
                    }}
                >
                    {!!point && (
                        <Marker position={point}/>
                    )}

                    {line?.length > 0 && (
                        <>
                            <Marker
                                position={line[0]}/>
                            <Marker
                                icon={{url: "/img/flag.png", scaledSize: {height: 50, width: 50}}}
                                position={line[line.length - 1]}/>
                            <Polyline
                                path={line}
                                options={{
                                    strokeColor: '#F44336',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 6,
                                    fillColor: '#F9A825',
                                    fillOpacity: 0.35
                                }
                                }
                            />
                        </>
                    )}

                </GoogleMap>
            )}
        </>
    )
}

export default MapView