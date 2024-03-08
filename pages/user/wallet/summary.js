import Card from '../../../components/common/card'
import DriverDashboardCards from '../../../components/driver/dashboard/cards';
import {GiPayMoney, GiTakeMyMoney} from 'react-icons/gi';
import Table from '../../../components/common/table';
import moment from 'moment';
import {BiWallet} from 'react-icons/bi';
import UserLayout from '../../../layouts/user';
import {useRouter} from 'next/router';
import {useFetch} from '../../../helpers/hooks';
import {getWalletBrief, getWalletUserHistory} from '../../../helpers/backend_helper';
import {useSite} from '../../../contexts/site';
import {useI18n} from '../../../contexts/i18n';

const UserWallet = () => {
    const router = useRouter()
    const i18n = useI18n();
    const [walletBrief] = useFetch(getWalletBrief);
    const {currency_code} = useSite();
    const [walletHistory, getWalletHistory] = useFetch(getWalletUserHistory);

    // table columns 
    let columns = [
        {
            dataField: 'amount', text: 'Amount',
            formatter: amount => <span >{`${currency_code ? currency_code : ""} ${amount}`}</span>
        },
        {
            dataField: 'updatedAt', text: 'Date',
            formatter: updatedAt => <span >{moment(updatedAt).format("MMM DD, YYYY")}</span>
        },
        {
            dataField: 'deposit_method', text: 'Deposit Method',
            formatter: deposit_method => <span >{deposit_method}</span>
        }
    ]

    return (
        <>
            <Card>
                {/* header  */}
                <div className='flex items-center justify-between'>
                    <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t("Wallet")}</h1>
                    <button
                        onClick={() => router.push("/user/wallet/add-money")}
                        className='px-4 py-2 text-twSecondary-shade700 border hover:!bg-twSecondary-shade700 hover:!text-white !border-twSecondary-shade700 text-lg lg:text-xl font-medium rounded-lg'>{!!i18n && i18n?.t("Add Money")}</button>
                </div>
            </Card>

            {/* cards  */}
            <div className='my-[40px] grid lg:grid-cols-3 gap-[33px]'>
                <DriverDashboardCards stat={`${currency_code ? currency_code : ""} ${walletBrief?.deposits || 0}`} title={!!i18n && i18n?.t("Total Deposits")} icon={<BiWallet />} />
                <DriverDashboardCards stat={`${currency_code ? currency_code : ""} ${walletBrief?.spent || 0}`} title={!!i18n && i18n?.t("Total Expense")} icon={<GiPayMoney />} />
                <DriverDashboardCards stat={`${currency_code ? currency_code : ""} ${walletBrief?.currentBalance || 0}`} title={!!i18n && i18n?.t("Available Balance")} icon={<GiTakeMyMoney />} />
            </div>

            {/* table  */}
            <Table
                indexed
                pagination
                columns={columns}
                data={walletHistory}
                onReload={getWalletHistory}
                noActions
                shadow={true}
                title="Deposits"
            />
        </>
    );
};

UserWallet.layout = UserLayout
export default UserWallet;