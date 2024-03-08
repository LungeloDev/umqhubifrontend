import React from 'react';

const SpecificationCard = ({vehicleDetails}) => {

    return (
        <div className={'grid grid-cols-4 gap-2 mt-3'}>
            <div className={'text-center border py-2 bg-main2 rounded-lg px-1'}>
                <img src="/power.svg" alt="power" className={'h-10 w-10 inline-block mb-1'} />
                <div className={''}>
                    <p>Max Power</p>
                    <p>{vehicleDetails?.specifications?.max_power}</p>
                </div>
            </div>
            <div className={'text-center border py-2 bg-main2 rounded-lg px-1'}>
                <img src="/fuel.svg" alt="power" className={'h-10 w-10 inline-block mb-1'} />
                <div className={''}>
                    <p>Fuel</p>
                    <p>{vehicleDetails?.specifications?.fuel_per_litre} per litre</p>
                </div>
            </div>
            <div className={'text-center border py-2 bg-main2 rounded-lg px-1'}>
                <img src="/speed.svg" alt="power" className={'h-10 w-10 inline-block mb-1'} />
                <div className={''}>
                    <p>Max Speed</p>
                    <p>{vehicleDetails?.specifications?.max_speed}</p>
                </div>
            </div>
            <div className={'text-center border py-2 bg-main2 rounded-lg px-1'}>
                <img src="/mph.svg" alt="power" className={'h-10 w-10 inline-block mb-1'} />
                <div className={''}>
                    <p>0-60mph</p>
                    <p>{vehicleDetails?.specifications?.mph}</p>
                </div>
            </div>
        </div>
    );
};

export default SpecificationCard;