import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import Card from '../../../components/common/card';
import Table from '../../../components/common/table';
import {useI18n} from '../../../contexts/i18n';
import {useSite} from '../../../contexts/site';
import {deletePaymentAdmin, getPaymentListAdmin} from '../../../helpers/backend_helper';
import {useFetch} from '../../../helpers/hooks';
import AdminLayout from '../../../layouts/admin';

const PaymentRecords = () => {
    const {currency_code} = useSite();
    const i18n = useI18n();
    const [payments, getPayments, {error, loading}] = useFetch(getPaymentListAdmin)

    // table columns 
    const columns = [
        {
            dataField: 'trip', text: 'Trip Id',
            formatter: (_, data) => (<Link href={`/admin/trip-management/trips/details/?_id=${data?.trip?._id}`} ><a className='underline text-blue-600'>{data?.trip?._id}</a></Link>)
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
            dataField: 'name', text: 'Driver Name',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.driver?.name}</span></div>)
        },
        {
            dataField: 'email', text: 'Driver Email',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.driver?.email}</span></div>)
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
            <Card title={!!i18n && i18n?.t("Payment List")}>
                <Table
                    columns={columns}
                    data={payments}
                    pagination={true}
                    noActions={false}
                    indexed={true}
                    shadow={false}
                    onDelete={deletePaymentAdmin}
                    onReload={getPayments}
                    textCenter={true}
                    error={error}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

PaymentRecords.layout = AdminLayout
export default PaymentRecords;