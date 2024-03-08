import React from 'react';
import {GiReceiveMoney, GiSteeringWheel} from 'react-icons/gi';
import {RiPinDistanceFill} from 'react-icons/ri';
import DriverDashboardCards from '../../components/driver/dashboard/cards';
import UserLayout from '../../layouts/user';
import UserExpenseChart from "../../components/frontend/common/user-expense-chart";
import {useFetch} from '../../helpers/hooks';
import {userDashboardCards} from '../../helpers/backend_helper';
import {useSite} from '../../contexts/site';
import {useI18n} from '../../contexts/i18n';

const UserDashboard = () => {
    const i18n = useI18n()
    const {currency_code} = useSite()
    const [userCards] = useFetch(userDashboardCards)

    return (
        <section className='font-Poppins !text-twContent px-2'>
            <h1 className='font-semibold text-[40px]'>{!!i18n && i18n?.t("Dashboard")}</h1>
            <div className='my-[40px] grid lg:grid-cols-3 gap-[33px]'>
                <DriverDashboardCards stat={userCards?.total_trip_completed || 0} title={!!i18n && i18n?.t("Total Rides")} icon={<GiSteeringWheel size={70} />} />
                <DriverDashboardCards stat={`${userCards?.total_distance?.toFixed(2) || 0} km`} title={!!i18n && i18n?.t("Total Distance")} icon={<RiPinDistanceFill size={70} />} />
                <DriverDashboardCards stat={`${currency_code ? currency_code : ""} ${userCards?.total_payment?.toFixed(2) || 0}`} title={!!i18n && i18n?.t("Total Expenses")} icon={<GiReceiveMoney size={70} />} />
            </div>
            <UserExpenseChart chartTitle={!!i18n && i18n?.t("My Expenses")} />
        </section>
    );
};
UserDashboard.layout = UserLayout
export default UserDashboard;