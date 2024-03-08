import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import UserLayout from "../../../layouts/user";
import Card from "../../../components/common/card";
import {useI18n} from "../../../contexts/i18n";
import {Col, Row} from "react-bootstrap";
import {SlLocationPin, SlClock} from 'react-icons/sl'
import {FaCoins} from 'react-icons/fa'

const NearestVehicles = () => {
    const i18n = useI18n();
    const {query, push} = useRouter()
    const state = useSelector(state => state?.nearestVehicles)
    const [nearestVehicles, setNearestVehicles] = useState()

    useEffect(()=>{
        const vehicles = JSON.parse(localStorage.getItem('nearestVehicles') || '')
        setNearestVehicles(vehicles)
    },[])

    return (
        <section>
            <Card>
                <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t(`Available ${query?.service}`)}</h1>
            </Card>
            <Card className={'flex justify-center border min-h-screen'}>
                <div className={'w-full md:w-[60vw]'}>
                    <h1 className={'text-gray-600 font-semibold tracking-wide whitespace-pre mb-3'}>{(state?.vehicles?.length > 0 ? state : nearestVehicles)?.vehicles?.length || 0} {query?.service} found </h1>
                    {
                        (state?.vehicles?.length > 0 ? state : nearestVehicles)?.vehicles?.map((data, i) =>
                            <div onClick={async() => await push(`/user/ride-now/nearest-vehicle-details?_id=${data?._id}`)} key={i} className={'w-full h-auto mb-3'}>
                                <Row className={'py-2 border rounded-lg shadow-md cursor-pointer hover:ring hover:ring-teal-300/[.55]'}>
                                    <Col xs={6} className={'flex justify-center items-center border-r'}>
                                        <div className={'inline-block space-y-2'}>
                                            <h1 className={'whitespace-pre capitalize font-semibold text-gray-700 tracking-wide'}>{data?.name+" "+data?.model_name}</h1>
                                            <p className={'whitespace-pre'}>{`${data?.gear_type || ''} | ${data?.seats || 0} | ${data?.fuel_type || ''}`}</p>
                                            <p className={'flex text-gray-600 gap-2'}>
                                                <SlLocationPin className={'inline-block mt-0.5'} size={20} />
                                                {((data?.vehicle?.distance?.value) / 1000).toFixed(2)} km, {data?.vehicle?.duration?.text} away
                                            </p>
                                            <p className={'flex md:items-center text-gray-600 gap-2'}>
                                                <FaCoins className={'inline-block ml-0.5 mt-0.5 md:mt-0'} size={16} />
                                                <span className={'font-semibold'}>{`${data?.fare?.total || 0} ${data?.fare?.currency || "USD"}`}</span>
                                            </p>
                                        </div>
                                    </Col>
                                    <Col xs={6} className={'flex justify-center'}>
                                        <div className={'w-56'}>
                                            <img src={data?.images[0]} alt="vehice-img" className={'object-cover rounded-lg'} />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )
                    }
                </div>
            </Card>
        </section>
    );
};

NearestVehicles.layout = UserLayout;
export default NearestVehicles;