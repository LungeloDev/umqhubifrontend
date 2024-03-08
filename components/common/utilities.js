// time greeting
export const welcomeTime = (date) => {
    return (date < 12 && date >= 5) ? 'Good Morning' :
        (date < 15 && date >= 12) ? 'Good Noon' :
            (date < 18 && date >= 15) ? 'Good afternoon' :
                (date < 24 && date >= 18) ? 'Good Evening' : "It's Midnight"
}

export function capitalizeFirstLetter(string) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
}

export const getTimeFormat = seconds => {
    return seconds > 0 ? `${(seconds / 3600).toFixed(0)}:${((seconds / 60 >> 0) % 60).toString().padStart(2, '0')}` : ''
}

export const getCurrentLocation = (callback) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                callback({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.error(error);
            }
        );
    } else {
        message.error("Geolocation is not supported by this browser.");
    }
};

export function objectToKeyValuePair(obj) {
    let details = [];
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    for (let i = 0; i < keys.length; i++) {
        details.push(
            {
                key: keys[i],
                value: values[i],
            }
        )
    }
    return details;
}

export function keyValuePairToObject(arr) {
    const decode = {}
    for (let i = 0; i < arr.length; i++) {
        decode[arr[i].key] = arr[i].value
    }
    return decode;
}