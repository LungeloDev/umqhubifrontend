import React, {useEffect} from 'react';
import {useFetch} from "../../../helpers/hooks";
import {fetchDriverData} from "../../../helpers/backend_helper";
import {FaMapMarkerAlt, FaStar, FaBolt, FaBriefcase} from "react-icons/fa";
import {useSite} from "../../../contexts/site";
import {BsCash} from "react-icons/bs";

const DriverInfo = () => {
    const [driverInfo, getDriverInfo] = useFetch(fetchDriverData)
    const site = useSite()

    return (
        <div className={'md:mx-[5%] pt-3'}>
            {/*profile info*/}
            <div className={'bg-slate-50 h-28 rounded-lg flex'}>
                <div className={'w-full flex items-center justify-center border-r'}>
                    <div className={'flex justify-center items-center w-full'}>
                        <div className={'w-20 mx-2 flex items-center justify-start'}>
                            <img src={driverInfo?.driver?.image || '/img/profile.png'} alt="driver_image" className={'border rounded-lg p-2 w-20 h-20 inline-block object-contain'} />
                        </div>
                        <div className={''}>
                            <p className={'font-semibold tracking-wider text-gray-700'}>{driverInfo?.driver?.name}</p>
                            <p className={'font-medium tracking-wider flex items-center gap-1 whitespace-pre'}><FaStar className={'text-amber-300'} /> {driverInfo?.rating?.average_rating}({driverInfo?.rating?.total_reviews} reviews) </p>
                        </div>
                    </div>
                </div>
                <div className={'w-full flex justify-center items-center'}>
                    <div>
                        <p className={'font-medium tracking-wider text-gray-400'}>Balance</p>
                        <p className={'font-semibold tracking-wider flex items-center gap-1'}>
                            {site?.currency_code}
                            {(driverInfo?.remaining_balance || 0).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/*trip and balance info*/}
            <div className={'grid grid-cols-3 gap-3 content-center justify-items-center h-28 mt-3 border p-2 rounded-lg'}>
                <div className={'h-[100px] bg-slate-50 w-full rounded-lg flex items-center justify-center'}>
                    <div className={'text-center'}>
                        <p className={'flex justify-center mb-2'}><FaBolt className={'text-amber-400'} /></p>
                        <h1 className={'font-semibold tracking-wider mb-1'}>{(driverInfo?.total_distance || 0).toFixed(2)}</h1>
                        <p className={'font-light text-[14px] md:text-[16px] tracking-wider text-gray-400'}>Total Distance</p>
                    </div>
                </div>
                <div className={'h-[100px] bg-slate-50 w-full rounded-lg flex items-center justify-center'}>
                    <div className={'text-center'}>
                        <p className={'flex justify-center mb-2'}><FaBriefcase className={'text-amber-400'} /></p>
                        <h1 className={'font-semibold tracking-wider mb-1'}>{(driverInfo?.total_trip_completed || 0)}</h1>
                        <p className={'font-light text-[14px] md:text-[16px] tracking-wider text-gray-400'}>Total Jobs</p>
                    </div>
                </div>
                <div className={'h-[100px] bg-slate-50 w-full rounded-lg flex items-center justify-center'}>
                    <div className={'text-center'}>
                        <p className={'flex justify-center mb-2'}><BsCash className={'text-amber-500'} /></p>
                        <h1 className={'font-semibold tracking-wider mb-1'}>{(driverInfo?.total_withdraw || 0).toFixed(2)}</h1>
                        <p className={'font-light text-[14px] md:text-[16px] tracking-wider text-gray-400'}>Total Withdraw</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DriverInfo;