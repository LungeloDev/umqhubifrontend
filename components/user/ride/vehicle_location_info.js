import React from 'react';
import {BiCurrentLocation} from "react-icons/bi";
import {FaMapMarkerAlt, FaStar, FaReply} from "react-icons/fa";
import {Col, Row} from "react-bootstrap";
import VehicleDetailsSlider from "./vehicle_details_slider";

const VehicleLocationInfo = ({state}) => {

    return (
        <div>
            {/*location*/}
            <div className={'space-y-4'}>
                <p className={'flex items-center gap-2'}>
                    <BiCurrentLocation className={'text-teal-500'} />
                    <span>{state?.userLocation?.location?.formatted_address}</span>
                </p>
                <p className={'flex items-center gap-2'}>
                    <FaMapMarkerAlt className={'text-amber-400'} />
                    <span>{state?.userLocation?.destination?.formatted_address}</span>
                </p>
                <p className={'flex items-center gap-2'}>
                    <FaReply className={'text-amber-400'} />
                    <span>Distance : {state?.getUserFare?.fare?.distance} km</span>
                </p>
            </div>

            {/*vehicle*/}
            <div className={'mt-3 border p-3 bg-main2 rounded-lg'}>
                <Row>
                    <Col xs={12} className={''}>
                        <h1 className={'whitespace-pre capitalize'}>{`${state?.selectedRideVehicle?.vehicle?.name} ${state?.selectedRideVehicle?.vehicle?.model_name}`}</h1>
                        <h1 className={'flex items-center gap-2 mt-1'}>
                            <span><FaStar className={'text-amber-400 mb-[3px]'} size={16}/></span>
                            <span>{state?.selectedRideVehicle?.vehicle?.rating?.average_rating || 0}</span>
                            <span className={'whitespace-pre'}>{`(${state?.selectedRideVehicle?.vehicle?.rating?.total_reviews || 0}) reviews`}</span>
                        </h1>
                    </Col>
                    <Col xs={12} md={4}>
                    </Col>
                </Row>
            </div>
            <div className={'flex justify-center w-full mt-3 md:w-[60vw]'}>
                <VehicleDetailsSlider vehicleDetails={state?.selectedRideVehicle?.vehicle}/>
            </div>
        </div>
    );
};

export default VehicleLocationInfo;