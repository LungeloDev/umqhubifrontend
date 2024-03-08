import React, {useEffect, useState} from 'react';
import UserLayout from "../../../layouts/user";
import {useSelector} from "react-redux";
import Card from "../../../components/common/card";
import Button from "../../../components/common/button";
import {useI18n} from "../../../contexts/i18n";
import {useRouter} from "next/router";
import VehicleLocationInfo from "../../../components/user/ride/vehicle_location_info";
import RideCharge from "../../../components/user/ride/charge";
import {useSite} from "../../../contexts/site";
import PaymentGateways from "../../../components/user/ride/payment_gateways";
import {message} from "antd";
import ApplyCoupon from "../../../components/user/ride/apply_coupon";
import {useUserContext} from "../../../contexts/user";
import {postConfirmRide} from "../../../helpers/backend_helper";

const ConfirmRideDetails = () => {
    const site = useSite()
    const user = useUserContext()
    const i18n = useI18n();
    const {back, push} = useRouter()
    const state = useSelector(state => state)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState()
    const [storedData, setStoredData] = useState({})

    useEffect(()=>{
        const userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}')
        const selectedRideVehicle = JSON.parse(localStorage.getItem('selectedRideVehicle') || '{}')
        const currentFare = JSON.parse(localStorage.getItem('currentFare') || '{}')
        const getUserFare = JSON.parse(localStorage.getItem('getUserFare') ?? '{}')
        const coupon = JSON.parse(localStorage.getItem('coupon') ?? '{}')
        const dataObj = {
            userLocation,
            selectedRideVehicle,
            currentFare,
            getUserFare,
            coupon
        }
        setStoredData(dataObj)
    },[state?.coupon?.coupon_code])


    return (
        <div>
            <Card>
                <div className={'flex justify-between items-center'}>
                    <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t("Ride Confirmation")}</h1>
                    <Button className={'text-gray-500'} onClick={async() => await back()}>Back</Button>
                </div>
            </Card>
            <Card className={'flex justify-center border min-h-screen'}>
                {/*vehicle and location details*/}
                <VehicleLocationInfo state={storedData} />

                {/*charge*/}
                <RideCharge chargedData={storedData?.currentFare} storedData={storedData} site={site} coupon={state?.coupon} />

                {/*coupon code*/}
                <h1 className={'text-gray-600 font-semibold tracking-wider pb-2 pt-4'}>Apply Coupon</h1>
                <ApplyCoupon state={state} storedData={storedData} />

                {/*payment methods*/}
                <h1 className={'text-gray-600 font-semibold tracking-wider pb-2 pt-4'}>Select a Payment Payment</h1>
                <PaymentGateways selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} />

                {/*confirm button*/}
                <Button
                    className={'w-full mt-5 text-gray-600 font-semibold tracking-wider'}
                    onClick={async () => {
                        if(selectedPaymentMethod?.name && user?._id) {
                            const confirmRide = {
                                "user": user?._id,
                                "driver": storedData?.selectedRideVehicle?.vehicle?.driver?._id,
                                "pickupLocation": {
                                    "lat": storedData?.userLocation?.location?.geometry?.location?.lat,
                                    "lng": storedData?.userLocation?.location?.geometry?.location?.lng,
                                    "address": storedData?.userLocation?.location?.formatted_address
                                },
                                "dropLocation": {
                                    "lat": storedData?.userLocation?.destination?.geometry?.location?.lat,
                                    "lng": storedData?.userLocation?.destination?.geometry?.location?.lng,
                                    "address": storedData?.userLocation?.destination?.formatted_address
                                },
                                "distance": +storedData?.currentFare?.distance,
                                "subtotal": !!state?.coupon?.current_subtotal ? +state?.coupon?.current_subtotal : +storedData?.currentFare?.subtotal,
                                "vat": +storedData?.currentFare?.vat_amount,
                                "total": !!state?.coupon?.total ? +state?.coupon?.total : +storedData?.currentFare?.total,
                                "payment_method":{
                                    "logo": selectedPaymentMethod?.image,
                                    "name": selectedPaymentMethod?.name,
                                },
                                "discount": state?.coupon?.coupon_code && {
                                    "amount": +state?.coupon?.saved_money,
                                    "code": state?.coupon?.coupon_code
                                },
                                "vehicle": storedData?.selectedRideVehicle?.vehicle?._id,
                                "status": "pending"
                            }

                            const res = await postConfirmRide(confirmRide);
                            if(res?.error === false) {
                                localStorage.setItem('current_trip', res?.data?._id)
                                message.success(res?.msg)
                                await push('/user/ride-now/waiting');
                            } else {
                                message.error(res?.msg)
                            }
                        } else {
                            message.error('Some information are missing, please try again')
                        }
                    }}
                >
                    Confirm Ride
                </Button>
            </Card>
        </div>
    );
};

ConfirmRideDetails.layout = UserLayout;
export default ConfirmRideDetails;