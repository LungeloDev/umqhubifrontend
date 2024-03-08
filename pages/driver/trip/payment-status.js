import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {io} from "socket.io-client";
import {useSite} from "../../../contexts/site";
import DriverLayout from "../../../layouts/driver";
import {paymentChecking} from "../../../helpers/backend_helper";
import {Skeleton, Spin} from "antd";

const DriverPaymentStatus = () => {
    const site = useSite()
    const {push, query} = useRouter();
    const [userData, setUserData] = useState()
    const [payment, setPayment] = useState(false)

    useEffect(() => {
        if(query?.trip) {
            paymentChecking(query).then(userMSG => {
                if(userMSG?.error === false) {
                    setPayment(userMSG?.data?.payment)
                }
            })
        }
    }, [query?.trip])

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        let socket = io(process.env.socket_io, {
            auth: {
                token
            }
        });
        socket.on('payment_received', (message) => {
            setUserData(message)
            if(message?.due === 0) {
                setTimeout(async () => {
                    await push('/driver/earnings')
                }, 4000)
            }
        });
    }, [])

    if(payment === false && !userData) {
        return (
            <div className={'px-3 mt-[5%] md:w-2/3 mx-auto space-y-3'}>
                <Skeleton active={true} />
                <h1 className={'mt-5 text-center bg-gray-100 border font-semibold tracking-wider py-2 rounded-lg'}>
                    Please wait to receive payment <Spin className={'ml-2'} />
                </h1>
            </div>
        )
    }

    return (
        <div className={'flex justify-center'}>
            <div className={'md:w-2/3 px-3 mt-[5%]'}>
                <h1 className={'font-semibold text-gray-700 tracking-wider mb-2'}>Hi, {userData?.driver?.name}!</h1>
                <h1 className={'font-semibold text-gray-700 tracking-wider'}>You have successfully completed a trip</h1>
                {/*profile info*/}
                <div className={'grid grid-cols-2 pt-2 border p-3 rounded-lg mt-4 bg-amber-200'}>
                    <div className={'w-full space-y-3'}>
                        <p className={'font-semibold tracking-wider text-gray-700'}>Total Fare</p>
                        <p className={'font-semibold tracking-wider text-gray-700'}>Paid</p>
                        <p className={'font-semibold tracking-wider text-red-500'}>Due</p>
                    </div>
                    <div className={'w-full text-end space-y-3'}>
                        <p className={'font-semibold tracking-wider text-gray-700'}>{site?.currency_code}{(+userData?.total || 0).toFixed(2)}</p>
                        <p className={'font-semibold tracking-wider text-gray-700'}>{site?.currency_code}{(+userData?.paid || 0).toFixed(2)}</p>
                        <p className={'font-semibold tracking-wider text-red-500'}>{site?.currency_code}{(+userData?.due || 0).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

DriverPaymentStatus.layout = DriverLayout;
export default DriverPaymentStatus;