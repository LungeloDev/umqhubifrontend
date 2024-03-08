import React, {useState} from 'react';
import AdminLayout from "../../../layouts/admin";
import Table from "../../../components/common/table";
import PageTitle from "../../../components/common/page-title";
import {Form} from "antd";
import {useAction, useFetch} from "../../../helpers/hooks";
import {useRouter} from "next/router";
import {fetchAllMails, fetchNotification} from "../../../helpers/backend_helper";

const UserNotification = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [allNotifications, getAllNotifications] = useFetch(fetchNotification, {status: 'scheduled'});
    const columns = [
        {
            dataField: 'title',
            text: 'Title',
        },
        {
            dataField: 'body',
            text: 'Body',
            formatter: (cell) => cell?.substring(0, 39)
        },

        {
            dataField: 'status',
            text: 'Status',
        },
        {
            dataField: 'scheduled_date',
            text: 'Scheduled Time',
            formatter: (cell) => new Date(cell).toLocaleString()
        },
        {
            dataField: 'group',
            text: 'Group Name',
            formatter: (cell, row) => cell ? <span className={'px-2 py-1 rounded bg-main cursor-pointer'}
                                                   onClick={() => router.push(`/admin/marketing/manage_group/group_manage/${row._id}`)}>Group Details</span> : "...",
        }
    ];

    return (
        <div>
            <PageTitle title="Scheduled Notifications"/>
            <div className='bg-white rounded p-4'>
                <Table
                    columns={columns}
                    data={allNotifications}
                    noActions={true}
                    shadow={false}
                    onReload={getAllNotifications}
                />
            </div>
        </div>
    );
};

UserNotification.layout = AdminLayout;
export default UserNotification;