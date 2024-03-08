import AdminDashboardCards from "../../components/admin/dashboard/cards";
import {GiMoneyStack} from 'react-icons/gi';
import {BiBus, BiCommentError} from 'react-icons/bi';
import {FiUser} from 'react-icons/fi';
import AdminLayout from "../../layouts/admin";
import Withdraw from "../../components/admin/dashboard/withdraw";
import TodayTripChart from "../../components/admin/dashboard/todayTripChart";
import RecentRequest from "../../components/admin/dashboard/recentRequest";
import {useFetch} from "../../helpers/hooks";
import {adminDashboardCards} from "../../helpers/backend_helper";
import {useSite} from "../../contexts/site";
import {useI18n} from "../../contexts/i18n";
import {TbUserCheck} from "react-icons/tb";
import {MdOutlineDirectionsCarFilled} from "react-icons/md";
import dynamic from "next/dynamic";
import {useUserContext} from "../../contexts/user";

const TotalEarningsChart = dynamic(() => import('../../components/admin/dashboard/totalEarningChart'), {ssr: false})

const Admin = () => {
    const {role} = useUserContext()
    const i18n = useI18n()
    const [dashboardCard, getDashboardCard] = useFetch(adminDashboardCards)
    const {currency_code} = useSite()

    return (
        <section className='font-Poppins !text-twContent px-2'>
            <h1 className='font-medium text-[40px]'>{i18n && i18n.t("Dashboard")}</h1>
            <div className='my-[40px] grid lg:grid-cols-3 md:grid-cols-2 gap-[33px]'>
                {role === "admin" && <AdminDashboardCards stat={`${currency_code ? currency_code : ""} ${dashboardCard?.total_payment?.toFixed(2) || 0}`} title={i18n && i18n.t("Total Payment Received")} icon={<GiMoneyStack size={70} />} />}
                <AdminDashboardCards stat={dashboardCard?.verified_driver || 0} title={i18n && i18n.t("Verified Driver")} icon={<TbUserCheck size={70} />} />
                <AdminDashboardCards stat={dashboardCard?.verified_user || 0} title={i18n && i18n.t("Verified Users")} icon={<FiUser size={70} />} />
                <AdminDashboardCards stat={dashboardCard?.total_trip_completed || 0} title={i18n && i18n.t("Total Trip Complete")} icon={<BiBus size={70} />} />
                <AdminDashboardCards stat={dashboardCard?.approved_vehicles || 0} title={i18n && i18n.t("Approved Vehicles")} icon={<MdOutlineDirectionsCarFilled size={70} />} />
                <AdminDashboardCards stat={dashboardCard?.total_complain_received || 0} title={i18n && i18n.t("Total Complaint")} icon={<BiCommentError size={70} />} />
            </div>
            <div className="grid lg:grid-cols-10 gap-5">
                <div className="lg:col-span-7">
                    <TotalEarningsChart />
                </div>
                <div className="lg:col-span-3">
                    <TodayTripChart />
                </div>
            </div>
            {role === "admin" && <div className="mt-10 lg:grid lg:grid-cols-2 gap-[10px]">
                <div >
                    <Withdraw />
                </div>
                <div>
                    <RecentRequest />
                </div>
            </div>}
        </section>
    )
}

Admin.layout = AdminLayout
export default Admin;