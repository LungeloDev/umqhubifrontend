import React from 'react';
import {GiMoneyStack, GiReceiveMoney, GiSteeringWheel, GiTakeMyMoney} from 'react-icons/gi';
import {RiPinDistanceFill} from 'react-icons/ri';
import {TbBikeOff} from 'react-icons/tb';
import DriverDashboardCards from '../../components/driver/dashboard/cards';
import EarningsChart from '../../components/frontend/common/charts';
import {useI18n} from '../../contexts/i18n';
import {useSite} from '../../contexts/site';
import {driverDashboardCards} from '../../helpers/backend_helper';
import {useFetch} from '../../helpers/hooks';
import DriverLayout from '../../layouts/driver';

const DriverDashboard = () => {
    const i18n = useI18n()
    const {currency_code} = useSite()
    const [dashboardCard] = useFetch(driverDashboardCards)
    return (
        <section className='font-Poppins !text-twContent px-2'>
            <h1 className='font-semibold text-[40px]'>{!!i18n && i18n?.t("Dashboard")}</h1>
            <div className='my-[40px] grid lg:grid-cols-3 gap-[33px]'>
                <DriverDashboardCards stat={dashboardCard?.total_trip_completed || 0} title={!!i18n && i18n?.t("Total Jobs")} icon={<GiSteeringWheel size={70} />} />
                <DriverDashboardCards stat={`${dashboardCard?.total_distance?.toFixed(2) || 0} km`} title={!!i18n && i18n?.t("Total distance")} icon={<RiPinDistanceFill size={70} />} />
                <DriverDashboardCards stat={dashboardCard?.total_trip_cancelled || 0} title={!!i18n && i18n?.t("Total Cancelled")} icon={<TbBikeOff size={70} />} />
                <DriverDashboardCards stat={`${currency_code ? currency_code : ""} ${dashboardCard?.total_earning?.toFixed(2) || 0}`} title={!!i18n && i18n?.t("Total earnings")} icon={<GiReceiveMoney size={70} />} />
                <DriverDashboardCards stat={`${currency_code ? currency_code : ""} ${dashboardCard?.total_withdraw?.toFixed(2) || 0}`} title={!!i18n && i18n?.t("Total Withdraw")} icon={<GiMoneyStack size={70} />} />
                <DriverDashboardCards stat={`${currency_code ? currency_code : ""} ${dashboardCard?.remaining_balance?.toFixed(2) || 0}`} title={!!i18n && i18n?.t("Balance")} icon={<GiTakeMyMoney size={70} />} />
            </div>
            <EarningsChart chartTitle={!!i18n && i18n?.t("My Expenses")} />
        </section>
    );
};

DriverDashboard.layout = DriverLayout
export default DriverDashboard;