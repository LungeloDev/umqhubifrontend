import React from 'react';
import {HiArrowLongRight} from "react-icons/hi2";

const CardFeatures = ({vehicleDetails}) => {

    return (
        <div className={'mt-3 space-y-3'}>
            <div className={'border py-2 bg-main2 rounded-lg px-1 grid grid-cols-3 justify-items-center items-center'}>
                <p className={'text-center'}>Model</p>
                <p className={'text-center'}><HiArrowLongRight className={'text-center'} /></p>
                <p className={'text-center'}>{vehicleDetails?.model_name}</p>
            </div>
            <div className={'border py-2 bg-main2 rounded-lg px-1 grid grid-cols-3 justify-items-center items-center'}>
                <p className={'text-center'}>Capacity</p>
                <p className={'text-center'}><HiArrowLongRight className={'text-center'} /></p>
                <p className={'text-center'}>{vehicleDetails?.features?.capacity} per litre</p>
            </div>
            <div className={'border py-2 bg-main2 rounded-lg px-1 grid grid-cols-3 justify-items-center items-center'}>
                <p className={'text-center'}>Color</p>
                <p className={'text-center'}><HiArrowLongRight className={'text-center'} /></p>
                <p className={'text-center capitalize'}>{vehicleDetails?.features?.color}</p>
            </div>
            <div className={'border py-2 bg-main2 rounded-lg px-1 grid grid-cols-3 justify-items-center items-center'}>
                <p className={'text-center'}>Fuel Type</p>
                <p className={'text-center'}><HiArrowLongRight className={'text-center'} /></p>
                <p className={'text-center capitalize'}>{vehicleDetails?.features?.fuel_type}</p>
            </div>
            <div className={'border py-2 bg-main2 rounded-lg px-1 grid grid-cols-3 justify-items-center items-center'}>
                <p className={'text-center'}>Gear Type</p>
                <p className={'text-center'}><HiArrowLongRight className={'text-center'} /></p>
                <p className={'text-center capitalize'}>{vehicleDetails?.features?.gear_type}</p>
            </div>
        </div>
    );
};

export default CardFeatures;