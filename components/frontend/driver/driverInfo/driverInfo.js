import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FaGg } from 'react-icons/fa';
import {fetchVehicle, fetchVehicles, getVehicleInfoAPI} from "../../../../helpers/backend_helper";


const RiderInfo = ({ vehicleId, data }) => {
    const q = { vehicle: vehicleId }
    const [vehicleInfo, setVehicleInfo] = useState({});

    useEffect(() => {
        getVehicleInfoAPI(q).then(res => {
            if (res?.error === false) {
                setVehicleInfo(res?.data)
            }
        })
    }, [vehicleId])


    return (
        <div>
            {/* services name */}
            <h5 className='text-[22px] text-[#181818] '>Got a <span className='capitalize'> {vehicleInfo?.vehicle?.name}</span></h5>
            <div className='m-4'>

                {/* services services */}
                <div className='md:grid md:grid-cols-2 gap-3'>
                    {
                        vehicleInfo?.services?.map((d, i) => <div key={i}>
                            <div key={i + 1} className='flex gap-3 items-center'>
                                <FaGg size={30} className='text-main' />
                                <h5 className='text-[16px] mb-0 text-[#181818] '> {d}</h5>
                            </div>
                        </div>)
                    }
                </div>

                {/* earn up */}
                <div className='bg-gray-200 p-2 rounded mt-8 flex justify-between'>
                    <p className='  mb-0'>You can earn up to</p>
                    <p className='  mb-0 text-[#FF0E0E]'>{vehicleInfo?.earning_currency} {vehicleInfo?.earning_money}</p>
                </div>

                {/* why join us */}
                <div className='my-8 text-justify'>
                    <h5 className='text-[20px] text-[#181818] '>{vehicleInfo?.section1_title}</h5>
                    <p className='text-[14px] mb-4 font-normal  '>{vehicleInfo?.section1_sub_title}</p>
                    {
                        vehicleInfo?.section1_data?.map((why, i) =>
                            <div key={i + 123} className='flex gap-4 my-2 mx-4'>
                                <img className='h-5 w-5 mt-1' src="/img/check-mark.svg" alt=""/>
                                <div>
                                    <h5 className='text-[16px] text-[#181818] font-medium  '> {why?.title1}</h5>
                                    <p className='text-[14px] font-normal  '>{why?.information1}</p>
                                </div>
                            </div>
                        )
                    }
                </div>

                {/* eligible us */}
                <div className='text-justify'>
                    <h5 className='text-[20px] text-[#181818]'>{vehicleInfo?.section2_title}</h5>
                    <p className='text-[14px] mb-4 font-normal '>{vehicleInfo?.section2_sub_title}</p>
                    {
                        vehicleInfo?.section2_data?.map((eli, i) =>
                            <div key={i + 1234234} className='flex gap-4 my-2 mx-4'>
                                <p className='text-[16px] bg-[#FF0E0E]   text-white h-8 w-8 rounded-full flex justify-center items-center'>{i + 1}</p>
                                <div className='w-[80%]'>
                                    <h5 className='text-[16px]   text-[#181818] text-start font-medium'> {eli?.title2}</h5>
                                    <p className='text-[14px]   text-justify font-normal'>{eli?.information2}</p>
                                </div>
                            </div>
                        )
                    }
                </div>

            </div>
        </div>
    );
};


export default RiderInfo;