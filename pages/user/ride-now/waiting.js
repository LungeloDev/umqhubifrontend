import React, {useEffect, useState} from 'react';
import { Comment } from  'react-loader-spinner'
import UserLayout from "../../../layouts/user";
import { io } from 'socket.io-client';
import {useRouter} from "next/router";
import {removeCouponData} from "../../../redux/user-ride/actions";
import {useDispatch} from "react-redux";
import Button from "../../../components/common/button";
import {useAction, useFetch} from "../../../helpers/hooks";
import {postCancelTripRequest} from "../../../helpers/backend_helper";
import {Form, Modal} from 'antd';
import {useSite} from "../../../contexts/site";
import FormSelect from "../../../components/form/select";

const RideConfirmationWaiting = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const site = useSite();

    useEffect(() => {
        let redirectTimer = setTimeout(async ()=> {
            dispatch(removeCouponData())
            const currentTrip = localStorage.getItem('current_trip');
            const cancelData = {
                "trip_id": currentTrip,
                "cancellation_reason": site?.auto_cancel_reason
            }
            await postCancelTripRequest(cancelData)
            router.push('/user/ride-now/nearest-vehicles?service=vehicles')
        }, 60 * 1000 * 2)

        const token = localStorage.getItem('authToken');
        let socket = io(process.env.socket_io, {
            auth: {
                token
            }
        });
        socket.on('driver_msg', async(message) => {
            if(message?.status === 'declined') {
                router.push('/user/ride-now/nearest-vehicles?service=vehicles');
                dispatch(removeCouponData())
                return clearTimeout(redirectTimer);

            } else if(message?.status === 'accepted') {
                router.push('/user/ride-now/ride');
                dispatch(removeCouponData())
                return clearTimeout(redirectTimer);
            }
            // localStorage.removeItem('selectedRideVehicle')
            // localStorage.removeItem('currentFare')
            // localStorage.removeItem('getUserFare')
            // localStorage.removeItem('getUserFare')
            // localStorage.removeItem('coupon')
            // localStorage.removeItem('userLocation')
            // localStorage.removeItem('selectedRideVehicle')
            // localStorage.removeItem('nearestVehicles')
        });
    }, [])

    return (
        <div className={'flex justify-center h-full'}>
            <div className={'md:w-1/2 shadow-lg border-2 border-teal-500 p-5 border-opacity-30 mt-[5%] md:mt-[10%] flex justify-center items-center'}>
                <div>
                    <div className={'ml-20'}>
                        <Comment
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="comment-loading"
                            wrapperStyle={{}}
                            wrapperClass="comment-wrapper"
                            color="#fff"
                            backgroundColor="#F9A825"
                        />
                    </div>
                    <h1 className={'font-semibold text-gray-700 text-center mt-2'}>Request Ongoing, please wait...</h1>
                    <h1 className={'font-normal text-gray-500 text-center mt-2'}>Within 2 mins, you will get a response</h1>
                    <div className={'flex justify-center mt-3'}>
                        <Button onClick={()=>setIsModalOpen(true)}>Cancel the trip request</Button>
                    </div>
                </div>
            </div>

            <Modal destroyOnClose footer={null} title="Please select the reason" visible={isModalOpen} onOk={()=>setIsModalOpen(false)} onCancel={()=>setIsModalOpen(false)}>
                <Form
                    layout={'vertical'}
                    onFinish={async (values) => {
                        const currentTrip = localStorage.getItem('current_trip');
                        const cancelData = {
                            "trip_id": currentTrip,
                            "cancellation_reason": values?.reason || site?.auto_cancel_reason
                        }
                        return useAction(postCancelTripRequest, cancelData, () => {
                            dispatch(removeCouponData())
                            router.push('/user/ride-now/nearest-vehicles?service=vehicles')
                        })
                    }}
                >
                    <FormSelect
                        name={'reason'}
                        label={'Select One'}
                        placeholder={'Please select one reason'}
                        options={site?.cancellation_reason?.map((d) => ({label: d, value: d}))}
                        required
                    />
                    <div className={'flex justify-center mt-3'}>
                        <Button>Submit</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

RideConfirmationWaiting.layout = UserLayout;
export default RideConfirmationWaiting;