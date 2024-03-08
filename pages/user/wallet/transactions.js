import moment from 'moment';
import React from 'react';
import Card from '../../../components/common/card';
import Table from '../../../components/common/table';
import {useI18n} from '../../../contexts/i18n';
import {useSite} from '../../../contexts/site';
import {getWalletUserTransaction} from '../../../helpers/backend_helper';
import {useFetch} from '../../../helpers/hooks';
import UserLayout from '../../../layouts/user';

const WalletTransactions = () => {
    const i18n = useI18n();
    const {currency_code} = useSite();
    const [walletTransactions, getWalletTransactions] = useFetch(getWalletUserTransaction);

    // table columns 
    let columns = [
        {
            dataField: 'tran_id', text: 'Transaction Id',
            formatter: tran_id => <span >{tran_id}</span>
        },
        {
            dataField: 'amount', text: 'Amount',
            formatter: amount => <span >{`${currency_code ? currency_code : ""} ${amount}`}</span>
        },
        {
            dataField: 'createdAt', text: 'Date',
            formatter: createdAt => <span >{moment(createdAt).format("MMM DD, YYYY")}</span>
        },
        {
            dataField: 'createdAt', text: 'Time',
            formatter: createdAt => <span >{moment(createdAt).format("hh:mm A")}</span>
        },
        {
            dataField: 'payment_method', text: 'Payment Method',
            formatter: payment_method => <span >{payment_method}</span>
        },
        {
            dataField: 'status', text: 'Status',
            formatter: status => <span
                className={`capitalize ${status?.toLowerCase() === 'completed' && 'text-green-500'} 
                    ${status?.toLowerCase() === 'pending' && 'text-yellow-500'}
                    ${status?.toLowerCase() === 'accepted' && 'text-blue-500'}
                    ${status?.toLowerCase() === 'declined' && 'text-red-500'}
                    ${status?.toLowerCase() === 'paid' && 'text-green-500'}`
                }
            >
                {status}
            </span>
        },
    ]

    return (
        <>
            {/* header  */}
            <Card>
                <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t("Wallet Transaction List")}</h1>
            </Card >

            {/* table  */}
            <Table
                inde pagination
                columns={columns}
                data={walletTransactions}
                onReload={getWalletTransactions}
                // loading={loading}
                noActions
                shadow={true}
                title="Deposits"
            />
        </>
    );
};

WalletTransactions.layout = UserLayout
export default WalletTransactions;