import { combineReducers } from "redux";
import userMapLocation from "./user-ride/userMapLocation";
import nearestVehicles from "./user-ride/nearestVehicles";
import selectedRideVehicle from "./user-ride/selectedVehicle";
import getUserFare from "./user-ride/getFare";
import getCouponData from "./user-ride/couponData";
import getCurrentFareData from "./user-ride/currentRideFare";

const rootReducer = combineReducers({
    userLocation: userMapLocation,
    nearestVehicles,
    selectedRideVehicle,
    getUserFare,
    coupon: getCouponData,
    currentFare: getCurrentFareData
})

export default rootReducer;