import {NEARESTVEHICLES} from "./actionTypes";

const initialState = {
    vehicles: [],
};

const nearestVehicles = (state = initialState, action) => {
    switch (action.type) {
        case NEARESTVEHICLES: {
            const vehicleState = {...state};
            vehicleState.vehicles = action.payload
            localStorage.setItem('nearestVehicles', JSON.stringify(vehicleState))
            return vehicleState
        }
        default:
            return state;
    }
}

export default nearestVehicles;