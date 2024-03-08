import React from 'react';
import DriverLayout from '../../layouts/driver';
import Card from "../../components/common/card"
import {useFetch} from '../../helpers/hooks';
import {DriverPaymentList} from '../../helpers/backend_helper';
import Table from '../../components/common/table';
import Link from 'next/link';
import moment from 'moment';
import {useSite} from '../../contexts/site';
import {useI18n} from '../../contexts/i18n';

const ReceivedPayments = () => {
    const {currency_code} = useSite()
    const i18n = useI18n();
    const [payments, getPayments] = useFetch(DriverPaymentList)

    // table columns 
    const columns = [
        {
            dataField: 'trip', text: 'Trip Id',
            formatter: (_, data) => (<Link href={`/driver/trip-list/details/?_id=${data?.trip?._id}`} ><a className='underline text-blue-600'>{data?.trip?._id}</a></Link>)
        },
        {
            dataField: 'tran_id', text: 'Transaction Id',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.tran_id}</span></div>)
        },
        {
            dataField: 'name', text: 'User Name',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.user?.name}</span></div>)
        },
        {
            dataField: 'email', text: 'User Email',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.user?.email}</span></div>)
        },
        {
            dataField: 'date', text: 'Date',
            formatter: (_, data) => (<div className=''> <span className=''>{moment(data?.tran_date).format("MMM DD, YYYY")}</span></div>)
        },
        {
            dataField: 'date', text: 'Time',
            formatter: (_, data) => (<div className=''> <span className=''>{moment(data?.tran_date).format("hh:mm A")}</span></div>)
        },
        {
            dataField: 'distance', text: 'Distance',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.trip?.distance.toFixed(2)} km</span></div>)
        },
        {
            dataField: 'total', text: 'Total Fare',
            formatter: (_, data) => (<div className=''> <span className='text-blue-500'>{`${currency_code ? currency_code : ""} ${data?.trip?.total?.toFixed(2)}`}</span></div>)
        },
        {
            dataField: 'payment_method', text: 'payment_method',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{`${data?.payment_method}`}</span></div>)
        },
        {
            dataField: 'status', text: 'Payment Status',
            formatter: (_, data) => <span
                className={`capitalize ${data?.status?.toLowerCase() === 'completed' && 'text-green-500'} 
                ${data?.status?.toLowerCase() === 'paid' && 'text-green-500'} 
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
        <div>
            <Card>
                <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t("Received Payments")}</h1>
            </Card >
            <Card>
                <Table
                    columns={columns}
                    data={payments}
                    pagination={true}
                    noActions={true}
                    indexed={true}
                    shadow={false}
                    onReload={getPayments}
                    textCenter={true}
                />
            </Card>
        </div >
    );
};

ReceivedPayments.layout = DriverLayout
export default ReceivedPayments;