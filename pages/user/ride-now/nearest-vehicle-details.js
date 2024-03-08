import React, {useEffect, useState} from 'react';
import {useI18n} from "../../../contexts/i18n";
import {useRouter} from "next/router";
import {fetchFare, fetchNearestVehicleDetails} from "../../../helpers/backend_helper";
import UserLayout from "../../../layouts/user";
import Card from "../../../components/common/card";
import {GiShipWheel} from "react-icons/gi";
import Button from "../../../components/common/button";
import {message, Rate} from "antd";
import VehicleDetailsSlider from "../../../components/user/ride/vehicle_details_slider";
import SpecificationCard from "../../../components/user/ride/specification_card";
import CardFeatures from "../../../components/user/ride/car_features";
import {useDispatch, useSelector} from "react-redux";
import {currentFareData, getRideFare, selectedRideVehicle} from "../../../redux/user-ride/actions";

const NearestVehicleDetails = () => {
    const i18n = useI18n();
    const state = useSelector(state => state.userLocation)
    const dispatch = useDispatch()
    const {query, push, back} = useRouter()
    const [vehicleDetails, setVehicleDetails] = useState();

    useEffect(() => {
        if (query?._id) {
            fetchNearestVehicleDetails({_id: query?._id}).then(res => {
                if (res?.error === false) {
                    setVehicleDetails(res?.data)
                }
            })
        }
    }, [query?._id])

    const [userLocation, setUserLocation] = useState()
    useEffect(()=>{
        const vehicles = JSON.parse(localStorage.getItem('userLocation') || '')
        setUserLocation(vehicles)
    },[])

    return (
        <section>
            <Card>
                <div className={'flex justify-between'}>
                    <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider flex gap-2 items-center">
                        <GiShipWheel size={20} className={'mb-[3px]'}/>
                        {`${vehicleDetails?.name?.toUpperCase()} ${vehicleDetails?.model_name?.toUpperCase()}`}
                    </h1>
                    <Button className={'text-gray-500'} onClick={async() => await back()}>Back</Button>
                </div>
            </Card>
            <Card className={'flex justify-center border min-h-screen'}>
                <div className={'w-full md:w-[60vw]'}>
                    <div className={'w-full h-auto mb-3'}>
                        <h1 className={'space-y-2 mb-2'}>
                            <Rate allowHalf value={vehicleDetails?.rating?.average_rating}/>
                            <p className={'font-semibold tracking-wider text-gray-600'}>Average rating: {vehicleDetails?.rating?.average_rating}</p>
                            <p className={'font-semibold tracking-wider text-gray-600'}>Total Reviews: {vehicleDetails?.rating?.total_reviews}</p>
                        </h1>
                        <hr/>
                        <div className={'flex justify-center mt-3'}>
                            <VehicleDetailsSlider vehicleDetails={vehicleDetails}/>
                        </div>
                        <div className={'mt-14 md:mt-16'}>
                            <h1 className={'text-gray-600 font-semibold tracking-wider'}>Specifications</h1>
                            <SpecificationCard vehicleDetails={vehicleDetails} />
                        </div>
                        <div className={'mt-14 md:mt-16'}>
                            <h1 className={'text-gray-600 font-semibold tracking-wider'}>Car Features</h1>
                            <CardFeatures vehicleDetails={vehicleDetails} />
                        </div>

                        <Button
                            className={'w-full mt-5 text-gray-600 font-semibold tracking-wider'}
                            onClick={async () => {
                                if(vehicleDetails?._id) {
                                    const getFare = await fetchFare({
                                        "category": vehicleDetails?.service_category,
                                        "service_package": vehicleDetails?.service_package,
                                        "service": vehicleDetails?.service,
                                        "service_vehicle": vehicleDetails?.service_vehicle,
                                        "source": {
                                            "latitude": (state?.location?.geometry?.location?.lat ? state : userLocation)?.location?.geometry?.location?.lat,
                                            "longitude": (state?.location?.geometry?.location?.lng ? state : userLocation)?.location?.geometry?.location?.lng
                                        },
                                        "destination": {
                                            "latitude": (state?.destination?.geometry?.location?.lat ? state : userLocation)?.destination?.geometry?.location?.lat,
                                            "longitude": (state?.destination?.geometry?.location?.lng ? state : userLocation)?.destination?.geometry?.location?.lng,
                                        }
                                    })
                                    if(getFare?.error === false) {
                                        dispatch(getRideFare(getFare?.data))
                                        dispatch(selectedRideVehicle(vehicleDetails));
                                        dispatch(currentFareData(getFare?.data))
                                        await push(`/user/ride-now/confirm-ride-details`);
                                    } else {
                                        message.error("Please try again")
                                    }
                                } else {
                                    message.error('Please select a vehicle first')
                                    await push(`/user/ride-now/`);
                                }
                            }}
                        >
                            Ride Now
                        </Button>
                    </div>
                </div>
            </Card>
        </section>
    );
};

NearestVehicleDetails.layout = UserLayout;
export default NearestVehicleDetails;