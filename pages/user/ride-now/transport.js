import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {fetchNearestVehicles, fetchServiceTransports} from "../../../helpers/backend_helper";
import UserLayout from "../../../layouts/user";
import Card from "../../../components/common/card";
import {useI18n} from "../../../contexts/i18n";
import {useDispatch, useSelector} from "react-redux";
import {storeNearestVehicles} from "../../../redux/user-ride/actions";
import {message} from "antd";

const ServiceTransport = () => {
    const i18n = useI18n();
    const dispatch = useDispatch()
    const state = useSelector(state => state?.userLocation)
    const {query, push} = useRouter()
    const [transports, setTransports] = useState();

    useEffect(() => {
        if (query?._id) {
            fetchServiceTransports({category: query?._id}).then(res => {
                if (res?.error === false) {
                    setTransports(res?.data)
                }
            })
        }
    }, [query?._id])


    return (
        <section>
            <Card>
                <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t("Select Your Transport")}</h1>
            </Card>
            <div className={'flex justify-center'}>
                <div className={'shadow-lg w-full md:w-[70vw] h-full md:min-h-[80vh]'}>
                    <div className={'grid grid-cols-2 gap-2 md:gap-16 justify-items-center pt-10 mx-2 md:mx-0'}>
                        {
                            transports?.services?.map((data, i) =>
                                <div
                                    onClick={async () => {
                                        const userLocation = JSON.parse(localStorage.getItem('userLocation') || '')
                                        const nearestData = {
                                            "service": data?._id,
                                            "service_category": query?._id,
                                            "pickup_location": {
                                                "lat": (state?.location?.geometry?.location?.lat ? state : userLocation)?.location?.geometry?.location?.lat,
                                                "lng": (state?.location?.geometry?.location?.lng ? state : userLocation)?.location?.geometry?.location?.lng
                                            },
                                            "destination_location": {
                                                "lat": (state?.destination?.geometry?.location?.lat ? state : userLocation)?.destination?.geometry?.location?.lat,
                                                "lng": (state?.destination?.geometry?.location?.lng ? state : userLocation)?.destination?.geometry?.location?.lng,
                                            }
                                        }
                                        const res = await fetchNearestVehicles(nearestData)
                                        if(res?.data?.vehicles) {
                                            dispatch(storeNearestVehicles(res?.data?.vehicles))
                                            await push(`/user/ride-now/nearest-vehicles?service=${data?.name}`)
                                        } else {
                                            message.error('Please try again')
                                            await push(`/user/ride-now/`)
                                        }
                                    }}
                                    key={i}
                                    className={'h-auto border w-full mx-auto rounded-lg hover:bg-gray-200 cursor-pointer md:mb-2 hover:shadow-sm'}
                                >
                                    <div className={'w-full flex justify-center'}>
                                        <div className={'h-56 w-56  flex justify-center items-center rounded-lg'}>
                                            <img src={data?.image} alt="service-vehicle" className={'object-fit inline-block rounded-lg'} />
                                        </div>
                                    </div>
                                    <p className={'text-center border capitalize font-semibold text-[16px] text-gray-700 py-2'}>
                                        {data?.name}
                                    </p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </section>
    );
};

ServiceTransport.layout = UserLayout;
export default ServiceTransport;