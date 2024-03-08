import {GETFARE} from "./actionTypes";

const initialState = {
    fare: {},
};

const getUserFare = (state = initialState, action) => {
    switch (action.type) {
        case GETFARE: {
            const fareState = {...state};
            fareState.fare = action.payload
            localStorage.setItem('getUserFare', JSON.stringify(fareState))
            return fareState
        }
        default:
            return state;
    }
}

export default getUserFare;