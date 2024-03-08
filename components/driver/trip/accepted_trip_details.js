import React, {useEffect, useState} from 'react';
import {FaLocationArrow} from "react-icons/fa";
import { Timeline } from 'flowbite-react';
import {ImLocation2} from "react-icons/im";
import Button from "../../common/button";
import {FiPhoneCall} from "react-icons/fi";
import {FaCar, FaUsers} from "react-icons/fa";
import {message} from "antd";
import {useRouter} from "next/router";
import {BsArrowRightCircleFill} from "react-icons/bs";
import {fetchOnGoingRide, tripStatusUpdate} from "../../../helpers/backend_helper";

const AcceptedTripDetails = ({site, setOpen2}) => {
    const [user, setUser] = useState({})
    const [refresh, setRefresh] = useState(false)
    const {push} = useRouter();

    useEffect(() => {
        setRefresh(false)
        fetchOnGoingRide().then(res => {
            if(res?.error === false) {
                setUser(res?.data)
            }
        })
    }, [refresh])

    const handleMessage = async () => {
        await push('/driver/trip/message')
    }

    const handleCall = (userInfo) => {
        navigator.clipboard.writeText(userInfo?.phone)
        message.success(`Phone number copied successfully, ${userInfo?.phone}`)
    }

    const handleStatus = async () => {
        if(user?.status === 'accepted') {
            const data = {
                "_id": user?._id, // trip id stored in user state/variable
                "status": "moving"
            }
            const decline = await tripStatusUpdate(data)
            if(decline?.error === false) {
                message.success("You're moving to pickup user")
                setRefresh(true)
            } else {
                message.error('Please try again...')
            }
        } else if(user?.status === 'moving') {
            const data = {
                "_id": user?._id, // trip id stored in user state/variable
                "status": "start"
            }
            const decline = await tripStatusUpdate(data)
            if(decline?.error === false) {
                message.success("Your trip has been started")
                setRefresh(true)
            } else {
                message.error('Please try again...')
            }
        } else if(user?.status === 'start') {
            const data = {
                "_id": user?._id, // trip id stored in user state/variable
                "status": "completed"
            }
            const decline = await tripStatusUpdate(data)
            if(decline?.error === false) {
                message.success("The trip has been completed successfully")
                await push(`/driver/trip/payment-status?trip=${user?._id}`)
                setOpen2(false)
            } else {
                message.error('Please try again...')
            }
        }
    }


    return (
        <div className={'w-full md:w-2/3 mx-auto'}>
            {/*profile info*/}
            <div className={'bg-main2 h-28 rounded-lg flex'}>
                <div className={'w-full flex items-center justify-center border-r'}>
                    <div className={'flex justify-center items-center w-full pr-2'}>
                        <div className={'w-20 mx-2 flex items-center justify-start'}>
                            <img src={user?.user?.image} alt="driver_image" className={'border rounded-lg p-2 w-20 h-20 inline-block object-contain'} />
                        </div>
                        <div className={''}>
                            <p className={'font-semibold tracking-wider text-gray-700'}>{user?.user?.name}</p>
                            <p className={'font-medium tracking-wider flex items-center gap-1 whitespace-pre'}>
                                {user?.user?.phone}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={'w-full flex justify-center items-center'}>
                    <div>
                        <p className={'font-semibold tracking-wider text-gray-500'}>{(+user?.distance || 0).toFixed(2)} km</p>
                        <p className={'font-semibold tracking-wider flex items-center gap-1'}>
                            {site?.currency_code}{(+user?.total || 0).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/*location info*/}
            <div className={'mt-5'}>
                <Timeline>
                    <Timeline.Item>
                        <Timeline.Point icon={FaLocationArrow} />
                        <Timeline.Content>
                            <Timeline.Time>
                                From
                            </Timeline.Time>
                            <Timeline.Body>
                                <p>
                                    {user?.pickupLocation?.address}
                                </p>
                            </Timeline.Body>
                        </Timeline.Content>
                    </Timeline.Item>
                    <Timeline.Item>
                        <Timeline.Point icon={ImLocation2} />
                        <Timeline.Content>
                            <Timeline.Time>
                                To
                            </Timeline.Time>
                            <Timeline.Body>
                                <p>
                                    {user?.dropLocation?.address}
                                </p>
                            </Timeline.Body>
                        </Timeline.Content>
                    </Timeline.Item>
                </Timeline>
            </div>

            {/*ride fare details*/}
            <div className={'my-4'}>
                <h1 className={'text-gray-700 font-semibold tracking-wider border-b-2 pb-2'}>Ride fare: </h1>
                <div className={'grid grid-cols-2 pt-2'}>
                    <div className={'w-full space-y-2'}>
                        <p className={'font-semibold tracking-wider text-gray-700'}>Subtotal</p>
                        <p className={'font-semibold tracking-wider text-gray-700'}>Vat</p>
                        {
                            user?.discount?.amount &&
                            <p className={'font-semibold tracking-wider text-red-500'}>Discount</p>
                        }
                    </div>
                    <div className={'w-full text-end border-b-2 pb-2 space-y-2'}>
                        <p className={'font-semibold tracking-wider text-gray-700'}>{site?.currency_code}{(+user?.subtotal || 0).toFixed(2)}</p>
                        <p className={'font-semibold tracking-wider text-gray-700'}>{site?.currency_code}{(+user?.vat || 0).toFixed(2)}</p>
                        {
                            user?.discount?.amount &&
                            <p className={'font-semibold tracking-wider text-red-500'}>{user?.discount?.amount ? `-${site?.currency_code}${(+user?.discount?.amount || 0).toFixed(2)}` : 0}</p>
                        }
                    </div>
                </div>
                <div className={'grid grid-cols-2 pt-2'}>
                    <div className={'w-full'}>
                        <p className={'font-semibold tracking-wider text-gray-700'}>Total</p>
                    </div>
                    <div className={'w-full text-end'}>
                        <p className={'font-semibold tracking-wider text-gray-700'}>{site?.currency_code}{(+user?.total || 0).toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/*communication button*/}
            <div className={'flex gap-3 w-full'}>
                <Button onClick={() => handleCall(user?.user)} className={'w-full bg-slate-50 border-2 border-main text-[16px] font-semibold py-3 hover:bg-main flex justify-center items-center gap-2'}>
                    <FiPhoneCall size={18}/>
                    <span>Call</span>
                </Button>
                <Button onClick={handleMessage} className={'w-full bg-slate-50 border-2 border-main text-[16px] font-semibold py-3 hover:bg-main'}> Message </Button>
            </div>

            {/*swipe(status) button*/}
            <div className={'w-full mt-4'}>
                <Button onClick={handleStatus} className={'flex items-center justify-center gap-3 w-full bg-main border-2 border-main text-[16px] font-semibold py-3 hover:bg-main'}>
                    {
                        user?.status === 'accepted' &&
                        <>
                            <FaUsers size={22} />
                            Click here to pickup user
                        </>
                    }
                    {
                        user?.status === 'moving' &&
                        <>
                            <BsArrowRightCircleFill size={22} />
                            Click here to start the trip
                        </>
                    }
                    {
                        user?.status === 'start' &&
                        <>
                            <FaCar size={22} />
                            Click here to complete the trip
                        </>
                    }
                </Button>
            </div>
        </div>
    );
};

export default AcceptedTripDetails;