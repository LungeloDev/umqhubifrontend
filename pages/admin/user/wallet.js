import moment from 'moment';
import React from 'react';
import {BiPencil, BiUserCircle} from 'react-icons/bi';
import {FaTrashAlt} from 'react-icons/fa';
import Card from '../../../components/common/card';
import Table, {TableImage} from '../../../components/common/table';
import {useI18n} from '../../../contexts/i18n';
import {useSite} from '../../../contexts/site';
import {
    delWalletDepositAdmin,
    getWalletDepositListAdmin
} from '../../../helpers/backend_helper';
import {useActionConfirm, useFetch} from '../../../helpers/hooks';
import AdminLayout from '../../../layouts/admin';

const UserWalletDeposit = () => {
    const i18n = useI18n();
    const {currency_code} = useSite()
    const [deposits, getDeposits, {error, loading}] = useFetch(getWalletDepositListAdmin)

    // table columns 
    const columns = [
        {
            dataField: 'image', text: 'Image',
            formatter: (_, data) => <div>{data?.user?.image ? <TableImage url={data?.user?.image} /> :
                <BiUserCircle size={26} />}</div>
        },
        {
            dataField: 'name', text: 'User Name',
            formatter: (_, data) => (<div className=''><span className='capitalize'>{data?.user?.name}</span></div>)
        },
        {
            dataField: 'phone', text: 'Phone Number',
            formatter: (_, data) => (<div className=''><span className=''>{data?.user?.phone}</span></div>)
        },
        {
            dataField: 'email', text: 'Email',
            formatter: (_, data) => (<div className=''><span className=''>{data?.user?.email}</span></div>)
        },
        {
            dataField: 'date', text: 'Deposit Date',
            formatter: (_, data) => (
                <div className=''><span className=''>{moment(data?.createdAt).format("MMM DD, YYYY")}</span></div>)
        },
        {
            dataField: 'amount', text: 'Amount',
            formatter: (_, data) => (
                <div className=''><span className=''>{`${currency_code ? currency_code : ""} ${data?.amount}`}</span></div>)
        },
        {
            dataField: 'deposit_method', text: 'Deposit Method',
            formatter: (_, data) => (<div className=''><span className=''>{data?.deposit_method}</span></div>)
        },

    ];
    let actions = (data) => (
        <div className="flex">
            <button className="btn btn-outline-danger btn-sm focus:shadow-none me-2"
                title="View details"
                onClick={() => useActionConfirm(delWalletDepositAdmin, {_id: data?._id}, () => getDeposits())}>
                <FaTrashAlt className='cursor-pointer' />
            </button>
        </div>)

    return (
        <div>

            <Card title={!!i18n && i18n?.t("User Deposit Records")}>
                <Table
                    columns={columns}
                    data={deposits}
                    pagination={true}
                    noActions={false}
                    actions={actions}
                    indexed={true}
                    shadow={false}
                    onReload={getDeposits}
                    error={error}
                    loading={loading}
                    textCenter={true}
                />
            </Card>
        </div>
    );
};

UserWalletDeposit.layout = AdminLayout
export default UserWalletDeposit;