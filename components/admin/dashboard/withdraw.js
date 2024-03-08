import React, {useEffect} from 'react';
import Table from '../../common/table';
import {useFetch} from '../../../helpers/hooks';
import {fetchWithdrawRequest} from '../../../helpers/backend_helper';
import {useSite} from '../../../contexts/site';
import {useRouter} from 'next/router';
import {useI18n} from '../../../contexts/i18n';

const Withdraw = () => {
    const i18n = useI18n()
    const {currency_code} = useSite();
    const {push} = useRouter()
    const [withdraw, getWithdraw, {loading, error}] = useFetch(fetchWithdrawRequest, {}, false);

    useEffect(() => {
        getWithdraw({size: 5})
    }, [])

    // table column 
    let columns = [
        {
            dataField: 'by', text: 'Driver Name',
            formatter: by => <span className='capitalize'>{by?.name}</span>
        },
        {
            dataField: 'amount', text: 'Amount',
            formatter: amount => <span className='capitalize'>{`${currency_code ? currency_code : ""} ${amount}`}</span>
        },
        {
            dataField: 'payment_accept', text: 'Method',
            formatter: payment_accept => <span className='capitalize'>{`${payment_accept?.method_name}`}</span>
        },
        {
            dataField: 'status', text: 'Status',
            formatter: status => <span
                className={`capitalize ${status.toLowerCase() === 'completed' && 'text-green-500'} 
                    ${status.toLowerCase() === 'pending' && 'text-yellow-500'}
                    ${status.toLowerCase() === 'cancelled' && 'text-red-500'}`}>
                {status}
            </span>
        },
    ]

    return (
        <div className='shadow-md rounded-lg'>
            <div className='card_container'>
                <Table
                    indexed
                    columns={columns}
                    title={!!i18n?.t && i18n?.t("Withdraw")}
                    data={withdraw?.docs}
                    loading={loading}
                    noActions
                    onReload={getWithdraw}
                    shadow={false}
                    action={<div onClick={() => push("/admin/withdraw/withdraw-request/")} className='text-blue-600 cursor-pointer underline'>view all</div>}
                />
            </div>
        </div>
    );
};

export default Withdraw;