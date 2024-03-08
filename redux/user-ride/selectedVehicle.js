import {SELECTEDRIDEVEHICLE} from "./actionTypes";

const initialState = {
    vehicle: {},
};

const selectedRideVehicle = (state = initialState, action) => {
    switch (action.type) {
        case SELECTEDRIDEVEHICLE: {
            const newState = {...state};
            newState.vehicle = action.payload
            localStorage.setItem('selectedRideVehicle', JSON.stringify(newState))
            return newState
        }
        default:
            return state;
    }
}

export default selectedRideVehicle;