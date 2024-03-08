import React, {useEffect, useState} from 'react';
import DriverLayout from "../../../layouts/driver";
import ServiceLocationMap from "../../../components/user/ride/map";
import {useUserContext} from "../../../contexts/user";
import {Form, Switch, message, Drawer} from "antd";
import {MdLocationOff, MdOnlinePrediction} from "react-icons/md";
import {activeAndUpdateDriverLocation, fetchOnGoingRide} from "../../../helpers/backend_helper";
import DriverInfo from "../../../components/driver/trip/driver_info";
import {io} from "socket.io-client";
import RideInfo from "../../../components/driver/trip/ride_info";
import {useSite} from "../../../contexts/site";
import AcceptedTripDetails from "../../../components/driver/trip/accepted_trip_details";

const TripNow = () => {
    const site = useSite()
    const [form] = Form.useForm();
    const user = useUserContext()
    const [location, setLocation] = useState({lat: 0, lng: 0});
    const [address, setAddress] = useState({lat: 0, lng: 0});
    const [active, setActive] = useState(false);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [userRequestedData, setUserRequestedData] = useState();

    useEffect(() => {
        setActive(user?.vehicle?.active)
        form.setFieldsValue({active_status: user?.vehicle?.active})
    }, [user?.vehicle?.active])

    const handleActiveStatus = async (values) => {
        const data = {
            "vehicle_id": user?.vehicle?._id,
            "active": values,
            "location": location
        }
        const res = await activeAndUpdateDriverLocation(data);
        if (res?.error === false) {
            setActive(values)
            message.success(res?.msg)
            user?.getProfile()
        } else {
            message.warning(res?.msg)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        let socket = io(process.env.socket_io, {
            auth: {
                token
            }
        });
        socket.on('user_msg', (message) => {
            if(message?.status === 'cancelled') {
                setOpen(pre => pre = false)
            } else {
                setUserRequestedData(message)
                setOpen(pre => pre = true)
            }
        });
    }, [])

    useEffect(() => {
        fetchOnGoingRide().then(userMSG => {
            if(userMSG?.error === false) {
                setUserRequestedData(userMSG?.data)
                setOpen2(true)
            }
        })
    }, [])


    return (
        <div>
            <div className={'relative'}>
                <div className={'z-0 w-full'}>
                    <ServiceLocationMap setLocation={setLocation} setAddress={setAddress}/>
                </div>

                {/*driver location and active update */}
                <div className={'absolute top-0 left-0 h-[100px] w-[100vw]  rounded-md  flex justify-center md:justify-start pt-3'}>
                    <div
                        className={'w-[90vw] md:w-[50vw] h-full bg-main2 md:ml-[15%] rounded-lg grid grid-cols-2 border shadow-md'}>
                        <div className={'flex items-center justify-center'}>
                            {
                                active ?
                                    <div className={'flex items-center gap-2 text-green-600'}>
                                        <MdOnlinePrediction size={20}/>
                                        <h1 className={'font-semibold tracking-wider text-gray-600'}>Online</h1>
                                    </div>
                                    :
                                    <div className={'flex items-center gap-2 text-gray-600'}>
                                        <MdLocationOff size={20} />
                                        <h1 className={'font-semibold tracking-wider text-gray-600'}>Offline</h1>
                                    </div>
                            }
                        </div>

                        <div className={'flex items-center justify-center border-l pt-4'}>
                            <Form
                                form={form}
                            >
                                <Form.Item name="active_status" valuePropName="checked" initialValue={active}>
                                    <Switch onChange={handleActiveStatus} checkedChildren="Active"
                                            unCheckedChildren="Inactive"/>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>


                {/*driver basic information*/}
                <div className={'absolute bottom-32 md:bottom-32 left-0 w-full h-72 bg-main2 rounded-lg'}>
                    <DriverInfo />
                </div>


                {/*new ride popup*/}
                <Drawer
                    title="New Ride Request"
                    placement={'bottom'}
                    closable={true}
                    onClose={() => setOpen(false)}
                    visible={open}
                    key={'bottom'}
                    height={500}
                    destroyOnClose
                >
                    <RideInfo userRequestedData={userRequestedData} site={site} setOpen={setOpen} setOpen2={setOpen2} />
                </Drawer>

                {/*accepted trip details*/}
                <Drawer
                    title="Ride Status"
                    placement={'bottom'}
                    closable={true}
                    onClose={() => setOpen2(false)}
                    visible={open2}
                    key={'bottom'}
                    height={500}
                    destroyOnClose
                >
                    <AcceptedTripDetails site={site} setOpen2={setOpen2} />
                </Drawer>

            </div>
        </div>
    );
};

TripNow.layout = DriverLayout;
export default TripNow;