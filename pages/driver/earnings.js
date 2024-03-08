import Head from 'next/head';
import React from 'react';
import moment from "moment";
import Card from '../../components/common/card';
import Table from '../../components/common/table';
import DriverLayout from '../../layouts/driver';
import DriverDashboardCards from '../../components/driver/dashboard/cards';
import { useFetch } from '../../helpers/hooks';
import { driverDashboardCards, fetchDriverEarning } from '../../helpers/backend_helper';
import { GiReceiveMoney } from 'react-icons/gi';
import Link from 'next/link';
import { useSite } from '../../contexts/site';
import { useI18n } from '../../contexts/i18n';

const DriverEarnings = () => {
    const { currency_code } = useSite()
    const i18n = useI18n();
    const [dashboardCard] = useFetch(driverDashboardCards)
    const [earnings, getEarnings] = useFetch(fetchDriverEarning);
    
    const columns = [
        {
            dataField: 'trip', text: 'Trip Id',
            formatter: (_, data) => (<Link href={`/driver/trip-list/details/?_id=${data?.trip?._id}`} ><a className='underline text-blue-600'>{data?.trip?._id}</a></Link>)
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
            dataField: 'subtotal', text: 'Earning',
            formatter: (_, data) => (<div className=''> <span className={data?.due > 0 ? "" : "text-green-500 font-semibold"}>{`${currency_code ? currency_code : ""} ${data?.earning_amount?.toFixed(2)}`}</span></div>)
        },

    ];

    return (
        <div>
            <Head>
                <title>Earnings</title>
            </Head>

            <Card className={'shadow-sm'}>
                <h1 className={'text-gray-600 text-[16px] font-semibold tracking-wider'}>{!!i18n && i18n.t("Earnings")}</h1>
            </Card>

            <div className='my-[40px] grid lg:grid-cols-3 gap-[33px]'>
                <DriverDashboardCards stat={`${currency_code ? currency_code : ""} ${dashboardCard?.total_earning || 0}`} title={!!i18n && i18n?.t("Total Earnings")} icon={<GiReceiveMoney size={70} />} />
                <DriverDashboardCards stat={`${currency_code ? currency_code : ""} ${dashboardCard?.total_withdraw || 0}`} title={!!i18n && i18n?.t("Total Withdraw")} icon={<GiReceiveMoney size={70} />} />
                <DriverDashboardCards stat={`${currency_code ? currency_code : ""} ${dashboardCard?.remaining_balance || 0}`} title={!!i18n && i18n?.t("Balance")} icon={<GiReceiveMoney size={70} />} />
            </div>

            <Table
                indexed
                pagination
                columns={columns}
                data={earnings}
                onReload={getEarnings}
                noActions
                shadow={false}
            />
        </div>
    );
};

DriverEarnings.layout = DriverLayout
export default DriverEarnings;