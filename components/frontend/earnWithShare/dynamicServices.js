import React, { useEffect, useState } from 'react';
import { useFetch } from "../../../helpers/hooks";
import {
    fetchServiceVehiclesShortInfo,
    getVehicleInfoAPI
} from "../../../helpers/backend_helper";
import Button from "../../common/button";
import Content from "../common/content";
import { useRouter } from "next/router";


const DynamicServices = () => {
    const router = useRouter()
    const [vehicles, getVehicles] = useFetch(fetchServiceVehiclesShortInfo);
    const [vehicleInfo, getVehicleInfo] = useFetch(getVehicleInfoAPI)
    const [vId, setVId] = useState();

    useEffect(() => {
        if (!!vehicles?.docs[0]?._id) {
            getVehicleInfo({ vehicle: vehicles?.docs[0]?._id })
        }
    }, [vehicles?.docs[0]?._id])

    return (
        <div className='container'>
            <div className='flex flex-col md:flex-row gap-6 justify-center items-center mt-10'>
                {
                    vehicles?.docs?.map(v =>
                        <Button className={`text-capitalize ${vId === v?._id && "bg-twSecondary-shade700"}`} onClick={() => {
                            setVId(v?._id)
                            getVehicleInfo({ vehicle: v?._id })
                        }} key={v?._id}>
                            {v?.name}
                        </Button>
                    )
                }
            </div>
            <div className={'flex justify-content-center my-5 border-2 border-dotted py-4 border-main'}>
                <Button className={'text-capitalize hover:bg-twSecondary-shade700 hover:shadow-lg'} onClick={() => router.push('/home/registration')}> Register Now </Button>
            </div>

            {/*services information*/}
            <div>
                <h5 className='text-[22px] text-[#181818] text-center'>Got a <span
                    className='capitalize'> {vehicleInfo?.vehicle?.name}</span></h5>
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
                        <p className='mb-0'>You can earn up to</p>
                        <p className='mb-0 text-[#FF0E0E]'>{vehicleInfo?.earning_currency} {vehicleInfo?.earning_money}</p>
                    </div>
                    {/* why join us */}
                    <div className='my-8 text-justify'>
                        <h5 className='text-[20px] text-[#181818]'>{vehicleInfo?.section1_title}</h5>
                        <p className='text-[14px] mb-4 font-normal'>{vehicleInfo?.section1_sub_title}</p>
                        <div className={''}>
                            {
                                vehicleInfo?.section1_data?.map((why, i) =>
                                    <div key={i + 123} className='flex gap-3 my-3 mx-4'>
                                        <img className='h-5 w-5 mt-1' src="/img/check-mark.svg" alt="" />
                                        <div>
                                            <h5 className='text-[16px] text-[#181818] font-medium  '> {why?.title1}</h5>
                                            <p className='text-[14px] font-normal'>{why?.information1}</p>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 bg-opacity-20 mt-20 text-center py-16 font-Poppins">
                <div className="container">
                    <h1 className="text-[30px] text-twContent-heading">{vehicleInfo?.section2_title}</h1>
                    <p className="font-medium text-lg text-twContent-light mt-[16px] mb-10">{vehicleInfo?.section2_sub_title}</p>
                    {vehicleInfo?.section2_data?.map((content) => (
                        <Content
                            heading={content?.title2}
                            paragraph={content?.information2}
                            key={content?._id}
                        ></Content>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DynamicServices;