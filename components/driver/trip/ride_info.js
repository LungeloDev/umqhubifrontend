import React, {useEffect, useState} from 'react';
import {FaLocationArrow} from "react-icons/fa";
import { Timeline } from 'flowbite-react';
import {ImLocation2} from "react-icons/im";
import Button from "../../common/button";
import {postCancelTripRequest, tripStatusUpdate} from "../../../helpers/backend_helper";
import {message} from "antd";
import swalAlert from "../../common/alert";

const RideInfo = ({userRequestedData={}, site, setOpen, setOpen2}) => {
    const [user, setUser] = useState({})

    useEffect(()=>{
        if(userRequestedData?._id) {
            setUser(userRequestedData)
        }
    },[userRequestedData?._id])

    const handleAccept = async () => {
        const data = {
            "_id": user?._id, // trip id stored in user state/variable
            "status": "accepted"
        }
        const decline = await tripStatusUpdate(data)
        if(decline?.error === false) {
            setOpen2(true)
            setOpen(false)
        } else {
            message.error('Please try again...')
        }
    }

    const handleDecline = async () => {
        const { isConfirmed } = await swalAlert.confirm("Do you really want to cancel this", "Yes")
        if(isConfirmed === true) {
            const data = {
                "_id": user?._id, // trip id stored in user state/variable
                "status": "declined"
            }
            const decline = await tripStatusUpdate(data)
            if(decline?.error === false) {
                const cancelData = {
                    "trip_id": decline?.data?._id,
                    "cancellation_reason": "Cancelled by driver"
                }
                await postCancelTripRequest(cancelData)
                localStorage.removeItem('user_msg');
                setOpen(false);
                message.warning('Request canceled successfully')
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
                            <Timeline.Title>
                                {user?.pickupLocation?.address}
                            </Timeline.Title>
                        </Timeline.Content>
                    </Timeline.Item>
                    <Timeline.Item>
                        <Timeline.Point icon={ImLocation2} />
                        <Timeline.Content>
                            <Timeline.Time>
                                To
                            </Timeline.Time>
                            <Timeline.Title>
                                {user?.dropLocation?.address}
                            </Timeline.Title>
                        </Timeline.Content>
                    </Timeline.Item>
                </Timeline>
            </div>

            <div className={'flex justify-between gap-3'}>
                <Button onClick={handleDecline} className={'w-full bg-slate-50 border-2 border-main text-[16px] font-semibold py-3 hover:bg-main'}> Decline </Button>
                <Button onClick={handleAccept} className={'w-full bg-slate-50 border-2 border-main text-[16px] font-semibold py-3 hover:bg-main'}> Accept </Button>
            </div>
        </div>
    );
};

export default RideInfo;