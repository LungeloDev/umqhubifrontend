import {CURRENTFAREDATA} from "./actionTypes";

const initialState = {};

const getCurrentFareData = (state = initialState, action) => {
    switch (action.type) {
        case CURRENTFAREDATA: {
            let currentFareData = {...state};
            currentFareData = action.payload
            localStorage.setItem('currentFare', JSON.stringify(currentFareData))
            return currentFareData
        }
        default:
            return state;
    }
}

export default getCurrentFareData;