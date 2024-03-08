import Head from 'next/head';
import {FaEye} from "react-icons/fa";
import {useRouter} from 'next/router';
import {deleteTrip, fetchTripsList} from '../../../../helpers/backend_helper';
import React, {useEffect, useState} from 'react';
import {useFetch} from "../../../../helpers/hooks";
import Table from '../../../../components/common/table';
import AdminLayout from "../../../../layouts/admin";
import moment from 'moment';
import Card from '../../../../components/common/card';
import {useSite} from '../../../../contexts/site';
import {useI18n} from '../../../../contexts/i18n';

const Trips = () => {
    const router = useRouter();
    const i18n = useI18n();
    const [trips, getTrips, {error, loading}] = useFetch(fetchTripsList);
    const {currency_code} = useSite()

    const columns = [
        {
            dataField: 'name', text: 'User Name',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?.user?.name}</span></div>)
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
            dataField: 'vehicle', text: 'Vehicle',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?.vehicle?.name} {data?.vehicle?.model_name}</span></div>)
        },
        {
            dataField: 'distance', text: 'Distance',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.distance?.toFixed(2)} km</span></div>)
        },
        {
            dataField: 'total', text: 'Total Fare',
            formatter: (_, data) => (<div className=''> <span className='text-blue-500'>{`${currency_code ? currency_code : ""} ${data?.total}`}</span></div>)
        },
        {
            dataField: 'vat', text: 'VAT',
            formatter: (_, data) => (<div className=''> <span className=''>{`${currency_code ? currency_code : ""} ${data?.vat || 0}`}</span></div>)
        },
        {
            dataField: 'discount', text: 'Discount',
            formatter: (_, data) => (<div className=''> <span className=''>{`${currency_code ? currency_code : ""} ${data?.discount?.amount || 0}`}</span></div>)
        },
        {
            dataField: 'paid', text: 'Paid',
            formatter: (_, data) => (<div className=''> <span className=''>$ {data?.paid}</span></div>)
        },
        {
            dataField: 'due', text: 'Due',
            formatter: (_, data) => (<div className=''> <span className=''>$ {data?.due}</span></div>)
        },
        {
            dataField: 'subtotal', text: 'Earning',
            formatter: (_, data) => (<div className=''> <span className={data?.status === "completed" ? 'text-green-500 font-semibold' : ""}>{data?.status === "completed" ? `${currency_code ? currency_code : ""} ${(data?.subtotal || 0)?.toFixed(2)}` : `${currency_code} 0`}</span></div>)
        },
        {
            dataField: 'status', text: 'Status',
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
    let actions = (data) => (
        <div className="flex">
            <button className="btn btn-outline-primary btn-sm focus:shadow-none me-2"
                title="View details"
                onClick={() => router.push(`/admin/trip-management/trips/details?_id=${data?._id}`)}>
                <FaEye className='cursor-pointer' />
            </button>
        </div>)

    return (
        <section>
            <Head>
                <title>Trips</title>
            </Head>
            <Card className={'shadow-sm'}>
                <h1 className={'text-gray-600 text-[16px] font-semibold tracking-wider'}>{!!i18n && i18n?.t("Trips List")}</h1>
            </Card>
            <div className='card_container'>
                <Table
                    columns={columns}
                    data={trips}
                    pagination={true}
                    noActions={false}
                    actions={actions}
                    indexed={true}
                    shadow={false}
                    onReload={getTrips}
                    loading={loading}
                    error={error}
                    onDelete={deleteTrip}
                />
            </div>
        </section>
    );
};
Trips.layout = AdminLayout;
export default Trips;