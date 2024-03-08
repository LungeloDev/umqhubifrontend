import {useRouter} from 'next/router';
import React from 'react';
import Table from '../../../../components/common/table';
import {delUser, fetchDrivers, updateUserByAdmin} from '../../../../helpers/backend_helper';
import {useActionConfirm, useFetch} from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";
import {AiFillStar} from "react-icons/ai";
import {FaEye} from "react-icons/fa";
import {BiPencil} from 'react-icons/bi';
import {Switch} from 'antd';
import Head from 'next/head';
import {useI18n} from '../../../../contexts/i18n';
import Card from '../../../../components/common/card';

const AdminRiders = () => {
    const i18n = useI18n();
    const router = useRouter();
    const [riderInfo, setRiderInfo, {loading, error}] = useFetch(fetchDrivers);

    // table column
    const column = [
        {
            dataField: 'name', text: 'Name',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?.name}</span></div>)
        },
        {
            dataField: 'email', text: 'Email',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.email}</span></div>)
        },
        {
            dataField: 'phone', text: 'Phone Number',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?.phone}</span></div>)
        },
        {
            dataField: 'services', text: 'Vehicle Name',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?.vehicle?.name}</span></div>)
        },
        {
            dataField: 'verified', text: 'Account status',
            formatter: (_, data) => (<div className=''>
                <Switch
                    onChange={(e) => useActionConfirm(updateUserByAdmin, {_id: data?._id, verified: e}, () => setRiderInfo())}
                    checkedChildren={'Active'} unCheckedChildren={'Inactive'} checked={data?.verified} />
            </div>)
        },

    ];

    let actions = (data) => (
        <div className="flex">
            <button className="btn btn-outline-primary btn-sm focus:shadow-none me-2"
                title="View details"
                onClick={() => router.push(`/admin/driver/approved-list/details?_id=${data?._id}`)}>
                <FaEye className='cursor-pointer' />
            </button>

            <button className="btn btn-outline-primary btn-sm focus:shadow-none me-2"
                title="Update Driver"
                onClick={() => router.push(`/admin/driver/approved-list/edit?_id=${data?._id}`)}>
                <BiPencil className='cursor-pointer' />
            </button>

            <button className="btn btn-outline-success btn-sm focus:shadow-none me-2"
                title="Manage rating"
                onClick={() => router.push(`/admin/driver/approved-list/ratings?driver=${data?._id}`)}>
                <AiFillStar className='cursor-pointer' />
            </button>
        </div>)

    return (
        <div>
            <Head>
                <title>Driver List</title>
            </Head>

            <Card className={"shadow-sm"}>
                <h1 className={"text-gray-600 text-[16px] font-semibold tracking-wider"}>
                    {!!i18n && i18n?.t("Driver List")}
                </h1>
            </Card>

            <Card className='bg-white rounded-md p-2 shadow-sm'>
                <div className='card_container'>
                    {/* table data show */}
                    <Table
                        columns={column}
                        data={riderInfo}
                        pagination={true}
                        noActions={false}
                        actions={actions}
                        indexed={true}
                        shadow={false}
                        onDelete={delUser}
                        onReload={setRiderInfo}
                        error={error}
                        loading={loading}
                        textCenter={false}
                    />
                </div>
            </Card>

        </div>
    );
};
AdminRiders.layout = AdminLayout;
export default AdminRiders;