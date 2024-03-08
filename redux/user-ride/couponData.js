import {GETCOUPON, REMOVECOUPON} from "./actionTypes";

const initialState = {};

const getCouponData = (state = initialState, action) => {
    switch (action.type) {
        case GETCOUPON: {
            let couponState = {...state};
            couponState = action.payload
            localStorage.setItem('coupon', JSON.stringify(couponState))
            return couponState
        }
        case REMOVECOUPON: {
            let couponState = {...state};
            couponState = {coupon_code: null}
            localStorage.removeItem('coupon')
            return couponState
        }
        default:
            return state;
    }
}

export default getCouponData;