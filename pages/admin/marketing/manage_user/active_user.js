import React from 'react';
import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {fetchAllMarketingUsers, postMarketingUser, } from "../../../../helpers/backend_helper";
import {useAction, useFetch} from "../../../../helpers/hooks";
import Table from "../../../../components/common/table";

const AllUser = () => {
    const [allUsers, getAlleUsers] = useFetch(fetchAllMarketingUsers, {marketing_status: 'active'})
    const columns = [
        {
            dataField: 'name', text: 'User Name',
        },
        {
            dataField: 'phone', text: 'Contacts',
        },
        {
            dataField: 'email', text: 'Email'
        },
        {
            dataField: 'marketing_status', text: 'Status', formatter: (d, dd) => {
                return <div
                    className="text-green-600 font-semibold">Active</div>
            }
        }
    ];

    const handleUser = async (values) => {
        const payload = {_id: values._id, marketing_status: 'banned'}
        useAction(postMarketingUser, payload, () => getAlleUsers());
    }

    return (
        <>
            <PageTitle title={`All Users`} />
            <Table
                pagination
                columns={columns}
                actions={(values) => <div
                    className="bg-red-600 text-white px-2 py-1 rounded cursor-pointer"
                    onClick={() => handleUser(values)}>Ban User
                </div>}
                data={allUsers}
                shadow={false}
                onReload={getAlleUsers}
            />
        </>
    );
};

AllUser.layout = AdminLayout;
export default AllUser;

