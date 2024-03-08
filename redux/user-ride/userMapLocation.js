import {USERMAPLOCATION, USERMAPDESTINATION, MYLOCATION} from "./actionTypes";

const initialState = {
    location: {},
    destination: {},
    myLocation: {},
};

const userMapLocation = (state = initialState, action) => {
    switch (action.type) {
        case USERMAPLOCATION: {
            const userLocation = {...state};
            userLocation.location = action.payload
            localStorage.setItem('userLocation', JSON.stringify(userLocation));
            return userLocation
        }
        case USERMAPDESTINATION: {
            const userDestination = {...state};
            userDestination.destination = action.payload
            localStorage.setItem('userLocation', JSON.stringify(userDestination))
            return userDestination
        }
        case MYLOCATION: {
            const myLocation = {...state};
            myLocation.myLocation = action.payload
            localStorage.setItem('userLocation', JSON.stringify(myLocation))
            return myLocation
        }
        default:
            return state;
    }
}

export default userMapLocation;