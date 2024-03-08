import {
    USERMAPLOCATION,
    USERMAPDESTINATION,
    MYLOCATION,
    NEARESTVEHICLES,
    SELECTEDRIDEVEHICLE,
    GETFARE,
    GETCOUPON,
    REMOVECOUPON,
    CURRENTFAREDATA
} from "./actionTypes";

export const storeUserMapLocation = (value) => {
    return {
        type: USERMAPLOCATION,
        payload: value
    }
}

export const storeUserMapDestination = (value) => {
    return {
        type: USERMAPDESTINATION,
        payload: value
    }
}

export const storeMyLocation = (value) => {
    return {
        type: MYLOCATION,
        payload: value
    }
}

export const storeNearestVehicles = (value) => {
    return {
        type: NEARESTVEHICLES,
        payload: value
    }
}

export const selectedRideVehicle = (value) => {
    return {
        type: SELECTEDRIDEVEHICLE,
        payload: value
    }
}

export const getRideFare = (value) => {
    return {
        type: GETFARE,
        payload: value
    }
}

export const getCouponData = (value) => {
    return {
        type: GETCOUPON,
        payload: value
    }
}

export const removeCouponData = () => {
    return {
        type: REMOVECOUPON,
    }
}

export const currentFareData = (value) => {
    return {
        type: CURRENTFAREDATA,
        payload: value
    }
}