import React from 'react';
import AdminLayout from "../../../layouts/admin"
import Card from "../../../components/common/card"
import Table, {TableImage} from '../../../components/common/table';
import {useActionConfirm, useFetch} from '../../../helpers/hooks';
import {deleteUserAdmin, fetchUsers, updateUserByAdmin} from '../../../helpers/backend_helper';
import {Switch} from 'antd';
import {FaTrashAlt} from 'react-icons/fa';
import {useRouter} from 'next/router';
import {BiPencil, BiUserCircle} from 'react-icons/bi';
import {initI18n} from '../../../contexts/i18n';

const User = () => {
    const i18n = initI18n();
    const [userList, getUserList] = useFetch(fetchUsers)
    const router = useRouter()

    // table columns 
    const columns = [
        {
            dataField: 'image', text: 'Image',
            formatter: (_, data) => <div>{data?.image ? <TableImage url={data?.image} /> : <BiUserCircle size={26} />}</div>
        },
        {
            dataField: 'name', text: 'User Name',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?.name}</span></div>)
        },
        {
            dataField: 'email', text: 'Email',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.email}</span></div>)
        },
        {
            dataField: 'verified', text: 'Account Status',
            formatter: (_, data) => (
                <Switch
                    onChange={(e) => useActionConfirm(updateUserByAdmin, {_id: data?._id, verified: e}, () => getUserList())}
                    checkedChildren={'Active'} unCheckedChildren={'Inactive'} checked={data?.verified} />
            ),
        },
    ];
    let actions = (data) => (
        <div className="flex">
            <button className="btn btn-outline-primary btn-sm focus:shadow-none me-2"
                title="View details"
                onClick={() => router.push(`/admin/user/user-details/?_id=${data?._id}`)}>
                <BiPencil className='cursor-pointer' />
            </button>
            <button className="btn btn-outline-danger btn-sm focus:shadow-none me-2"
                title="View details"
                onClick={() => useActionConfirm(deleteUserAdmin, {_id: data?._id}, () => getUserList())}>
                <FaTrashAlt className='cursor-pointer' />
            </button>
        </div>)

    return (
        <div>
            <Card title={!!i18n && i18n?.t("User List")}>
                <Table
                    columns={columns}
                    data={userList}
                    pagination={true}
                    noActions={false}
                    actions={actions}
                    indexed={true}
                    shadow={false}
                    onReload={getUserList}
                    textCenter={true}
                />
            </Card>
        </div>
    );
};

User.layout = AdminLayout
export default User;