import moment from 'moment';
import {useRouter} from 'next/router';
import React from 'react';
import {FaEye} from 'react-icons/fa';
import Card from '../../../components/common/card';
import Table from '../../../components/common/table';
import {useI18n} from '../../../contexts/i18n';
import {useSite} from '../../../contexts/site';
import {fetchDriverTripList, paymentChecking} from '../../../helpers/backend_helper';
import {useFetch} from '../../../helpers/hooks';
import DriverLayout from '../../../layouts/driver';
import {BiMoney} from "react-icons/bi";
import {message} from "antd";

const DriverTripList = () => {
    const i18n = useI18n();
    const [driverTripList, getDriverTripList] = useFetch(fetchDriverTripList)
    const {currency_code} = useSite()
    const {push} = useRouter()

    let actions = (data) => (
        <div className="flex">
            <button className="btn btn-outline-primary btn-sm focus:shadow-none me-2"
                title="View details"
                onClick={() => push(`/driver/trip-list/details?_id=${data?._id}`)}>
                <FaEye className='cursor-pointer' />
            </button>
            <button className="btn btn-accent btn-sm text-gray-800 focus:shadow-none me-2"
                    title="Check payment status"
                    onClick={async () => {
                        const res = await paymentChecking({trip: data?._id});
                        if(res?.error === false) {
                            if(res?.data?.payment === false) {
                                await push(`/driver/trip/payment-status/?trip=${data?._id}`)
                            } else if(res?.data?.payment === true) {
                                message.success("Trip successfully paid")
                            }
                        } else {
                            message.success("Please try again...")
                        }
                    }}>
                <BiMoney className='cursor-pointer' />
            </button>
        </div>)

    const column = [
        {
            dataField: 'name', text: 'User Name',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?.user?.name}</span></div>)
        },
        {
            dataField: 'phone', text: 'Phone',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?.user?.phone}</span></div>)
        },
        {
            dataField: 'date', text: 'Date',
            formatter: (_, data) => (<div className=''> <span className=''>{moment(data?.createdAt).format("MMM DD, YYYY")}</span></div>)
        },
        {
            dataField: 'date', text: 'Time',
            formatter: (_, data) => (<div className=''> <span className=''>{moment(data?.createdAt).format("hh:mm A")}</span></div>)
        },
        {
            dataField: 'distance', text: 'Distance',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.distance.toFixed(2)} km</span></div>)
        },
        {
            dataField: 'total', text: 'Total Fare',
            formatter: (_, data) => (<div className=''> <span className='text-blue-500'>{`${currency_code ? currency_code : ""} ${data?.total?.toFixed(2)}`}</span></div>)
        },
        {
            dataField: 'paid', text: 'Paid',
            formatter: (_, data) => (<div className=''> <span className=''>$ {data?.paid?.toFixed(2)}</span></div>)
        },
        {
            dataField: 'due', text: 'Due',
            formatter: (_, data) => (<div className={data?.due > 0 ? "text-red-500" : ''}> <span className=''>$ {data?.due?.toFixed(2)}</span></div>)
        },
        {
            dataField: 'subtotal', text: 'Earning',
            formatter: (_, data) => (<div className=''> <span className={data?.due > 0 ? "" : "text-green-500 font-semibold"}>{data?.due > 0 ? "N/A" : `${currency_code ? currency_code : ""} ${data?.subtotal?.toFixed(2)}`}</span></div>)
        },
        {
            dataField: 'rating', text: 'Status',
            formatter: (_, data) => <span
                className={`capitalize ${data?.status?.toLowerCase() === 'completed' && 'text-green-500'} 
                    ${data?.status?.toLowerCase() === 'pending' && 'text-yellow-500'}
                    ${data?.status?.toLowerCase() === 'accepted' && 'text-blue-500'}
                    ${data?.status?.toLowerCase() === 'declined' && 'text-red-500'}`
                }
            >
                {data?.status}
            </span>
        },
    ];

    return (
        <div className='font-Poppins text-twContent'>
            <Card>
                <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t("Trip List")}</h1>
            </Card >
            {/* table  */}
            <div className='my-6 shadow-sm'>
                <Table
                    columns={column}
                    data={driverTripList}
                    pagination={true}
                    noActions={false}
                    actions={actions}
                    indexed={true}
                    shadow={true}
                    onReload={getDriverTripList}
                    textCenter={true}
                />
            </div>
        </div>
    );
};

DriverTripList.layout = DriverLayout
export default DriverTripList;