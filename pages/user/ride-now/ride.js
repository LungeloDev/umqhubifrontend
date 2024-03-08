import React, {useEffect, useState} from 'react';
import UserLayout from "../../../layouts/user";
import {Button, Drawer, Space, message} from "antd";
import {FaStar, FaMapMarkerAlt, FaUser, FaCar} from "react-icons/fa";
import {useSite} from "../../../contexts/site";
import {useRouter} from "next/router";
import ServiceLocationMap from "../../../components/user/ride/map";
import {io} from "socket.io-client";
import {BsCheck2Circle} from "react-icons/bs";
import {fetchOnGoingRide} from "../../../helpers/backend_helper";

const Ride = () => {
    const site = useSite()
    const {push} = useRouter();
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('bottom');
    const [ride, setRide] = useState();
    const [driverMsg, setDriverMsg] = useState();
    const [location, setLocation] = useState({lat: 0, lng: 0});
    const [address, setAddress] = useState({lat: 0, lng: 0});

    useEffect(() => {
        fetchOnGoingRide().then(res => {
            if(res?.error === false) {
                setRide(res?.data)
                if (res?.data?._id) {
                    setOpen(true)
                }
            }
        })
    }, [])

    const  handleCommunication = async(value) => {
        if(value === 'msg') {
            await push('/user/ride-now/message');

        } else if(value === 'call') {
            const site_coupon_code = ride?.driver?.phone
            navigator.clipboard.writeText(site_coupon_code)
            message.success(`Phone number copied successfully, ${ride?.driver?.phone}`)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        let socket = io(process.env.socket_io, {
            auth: {
                token
            }
        });
        socket.on('driver_msg', (message) => {
            setDriverMsg(message)
        });
    }, [])

    let driverStatus;
    let driverMsgStatus = driverMsg?.status || ride?.status
    switch (driverMsgStatus) {
        case "accepted": {
            driverStatus = <h1 className={'border px-2 py-1 bg-main2 text-gray-700 mb-2 flex items-center gap-2'}> <BsCheck2Circle /> Your request has been accepted</h1>
            break
        }
        case "moving": {
            driverStatus = <h1 className={'border px-2 py-1 bg-main2 text-gray-700 mb-2 flex items-center gap-2'}> <FaUser /> Your driver is coming, please wait...</h1>
            message.success("Your driver is coming, please wait...")
            break
        }
        case "start": {
            driverStatus = <h1 className={'border px-2 py-1 bg-main2 text-gray-700 mb-2 flex items-center gap-2'}> <FaCar /> Have a nice trip...</h1>
            message.success("Have a nice trip...")
            break
        }
        case "completed": {
            push(`/payment?tripId=${ride?._id}&token=${localStorage.getItem('authToken')}&web_payment=true`)
            break
        }
    }


    return (
        <div>
            <ServiceLocationMap  setLocation={setLocation} setAddress={setAddress} />
            <Drawer
                title="Ride Information"
                placement={placement}
                onClose={() => setOpen(false)}
                visible={open}
                key={placement}
                extra={
                    <Space>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                    </Space>
                }
                height={450}
            >
                <div className={'md:w-2/3 mx-auto'}>
                    {driverStatus}
                    {/*driver information*/}
                    <div className={'driver_info grid grid-cols-3 border h-auto rounded-md py-2'}>
                        <div className={'col-span-2'}>
                            <div className={'flex items-center md:justify-center'}>
                                <div className={'p-2 flex items-center justify-start'}>
                                    <img src={ride?.driver?.image || '/img/profile.png'} alt="vehicle-image" className={'h-14 w-14 object-cover inline-block'} />
                                </div>
                                <div>
                                    <p className={'font-semibold tracking-wider text-gray-700'}>{ride?.driver?.name}</p>
                                    <p className={'font-medium tracking-wider flex items-center gap-1'}><FaMapMarkerAlt className={'text-gray-600'} /> {(+ride?.distance ?? 0).toFixed(2)} km  </p>
                                    <p className={'font-medium tracking-wider flex items-center gap-1'}><FaStar className={'text-amber-300'} /> {ride?.rider_info?.rating?.average_rating}({ride?.rider_info?.rating?.total_reviews} reviews) </p>
                                </div>
                            </div>
                        </div>
                        <div className={'col-span-1'}>
                            <img src={ride?.vehicle?.images[0]} alt="vehicle-image" className={'h-20 w-auto object-cover'} />
                        </div>
                    </div>

                    {/*// payment info*/}
                    <div className={'flex justify-between items-center mt-3 rounded-md'}>
                        <p className={'text-gray-700 text-[18px]'}>Payment Method</p>
                        <p className={'text-gray-700 font-semibold text-[22px]'}>{site?.currency_code}{+ride?.total || 0}</p>
                    </div>

                    {/*// payment methods*/}
                    <div className={'flex justify-between  items-center mt-3 gap-2 border p-2 rounded-md bg-amber-200'}>
                        <img src={ride?.payment_method?.logo} alt="payment-logo" className={'w-16 bg-gray-50 h-12 object-contain border p-2 rounded-lg shadow-md'} />
                        <p className={'font-semibold text-[20px] capitalize text-gray-600'}>{ride?.payment_method?.name}</p>
                    </div>

                    {/*call, message*/}
                    <div className={'grid grid-cols-2 mt-4 gap-1'}>
                        <div onClick={()=> handleCommunication('call')} className={'h-14 border-2 cursor-pointer border-amber-200 hover:bg-amber-200 rounded-md flex items-center justify-center text-[16px] text-gray-600 tracking-wider font-semibold'}>
                            <p>Call</p>
                        </div>
                        <div onClick={()=> handleCommunication('msg')} className={'h-14 border-2 cursor-pointer border-amber-200 hover:bg-amber-200 rounded-md flex items-center justify-center text-[16px] text-gray-600 tracking-wider font-semibold'}>
                            <p>Message</p>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

Ride.layout = UserLayout;
export default Ride;