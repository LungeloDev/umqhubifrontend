import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import Table from '../../../../components/common/table';
import {useAction, useFetch} from "../../../../helpers/hooks";
import {
    featchTickets,
    fetchEmployee,
    fetchProfile,
    fetchTicketCategory,
    fetchTicketDepartments,
    fetchTicketTypes,
    getTicketPriorities,
    postTicket,
} from "../../../../helpers/backend_helper";
import Router from "next/router";
import Button from "../../../../components/common/button";
import {useI18n} from "../../../../contexts/i18n";
import {Form, Select, Popover} from "antd";

import {getAwsUploadImagesUrl} from "../../../../components/common/fileUploadAWS";

const Tickets = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    // modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit] = useState(false);
    const [tickets, getTickets] = useFetch(featchTickets)
    const [user, setUser] = useFetch(fetchProfile);
    const [department] = useFetch(fetchTicketDepartments, {active: true})
    const [allTypes] = useFetch(fetchTicketTypes)
    const [ticketPriorities] = useFetch(getTicketPriorities)
    const [allcategories] = useFetch(fetchTicketCategory,)
    const [categories, getCategories] = useFetch(fetchTicketCategory, {}, false)
    const [types, getTypes] = useFetch(fetchTicketTypes, {}, false)
    const [selected_department, setSelectedDepartment] = useState(null)
    const [selected_category, setSelectedCategory] = useState(null)
    const [key, setKey] = useState(0)
    const [employees] = useFetch(fetchEmployee)

    useEffect(() => {
        if (selected_department) getCategories({parent: selected_department})
        form.resetFields(["category"])
    }, [selected_department])


    useEffect(() => {
        form.resetFields(["type"])
        getTypes({department: selected_department, category: selected_category, active: true})
    }, [selected_category])

    const onFinish = async (values) => {
        values.files = await getAwsUploadImagesUrl(values.files);
        values.created_by = user._id;
        useAction(postTicket, values, (res) => {
            getTickets()
            setIsModalVisible(false);
        });
    }

    const items = [
        {
            text: 'Ticket No', dataField: '_id'
        },
        {
            text: 'Name', dataField: 'name'
        },
        {
            text: 'Email', dataField: 'email'
        },
        {
            text: 'Phone', dataField: 'phone',
            formatter: (cell, row) => row?.created_by?.phone
        },
        {
            text: 'Subject', dataField: 'subject',
            formatter: (_, data) => (<span className='capitalize'><Popover content={<div className='max-w-sm'>{data?.subject}</div>}>
                <span className='capitalize'>{data?.subject?.length > 20 ? `${data?.subject.slice(0, 20)}...` : data?.subject}</span>
            </Popover></span>)
        },
        {
            text: 'Department',
            dataField: 'department',
            formatter: (cell) => department?.docs.find(d => d._id === cell)?.name
        },
        {
            text: 'Category',
            dataField: 'category',
            formatter: (cell) => allcategories?.docs.find(d => d._id === cell)?.name
        },
        {
            text: 'Type',
            dataField: 'type',
            formatter: (cell) => allTypes?.docs.find(d => d._id === cell)?.name
        },
        {
            text: 'Priorities',
            dataField: 'priorities',
            formatter: (d) => ticketPriorities?.filter(e => e._id === d)[0].name
        },
        {
            text: 'Assign TO',
            dataField: 'assigned_to',
            formatter: (cell) => <div><p>{cell?.name}</p><p>{cell?.email}</p></div>
        },
        {
            text: 'Date', dataField: 'createdAt', formatter: (cell) => new Date(cell).toLocaleDateString()
        },
        {
            text: 'Status',
            dataField: 'status',
            formatter: (cell) => cell === 'pending' ?
                <div className={'px-2 py-1 rounded-2xl border-2 border-twSecondary-shade700 text-center text-twSecondary-shade700'}>Pending</div> :
                cell === 'closed' ?
                    <div className={'px-2 py-1 rounded-2xl border-2 border-red-500 text-center text-red-500'}>Closed</div> :
                    <div className={'px-2 py-1 rounded-2xl border-2 border-green-500 text-center text-green-500'}>Open</div>
        },
    ]

    return (
        <>
            <PageTitle title="Tickets" />
            <section>
                <div className='card_container'>
                    <Table
                        pagination
                        columns={items}
                        data={tickets}
                        shadow={false}
                        onView={(data) => {
                            Router.push(`/admin/ticket/tickets/${data._id}`)
                        }}
                        action={
                            (
                                <div key={key} className={'flex items-center space-x-6'}>

                                    <h3>filter by: </h3>
                                    <Select defaultValue="Department"
                                        allowClear
                                        style={{
                                            width: 130,
                                        }}
                                        onSelect={(v) => {
                                            setKey(key + 1)
                                            setSelectedDepartment(v);
                                            getTickets({filter: 'department', department: v})
                                        }}>
                                        {department?.docs.map((d, i) => <Select.Option key={i}
                                            value={d._id}>{d.name}</Select.Option>)}

                                    </Select>

                                    <Select defaultValue="Category" allowClear
                                        style={{
                                            width: 120,
                                        }}
                                        onSelect={(v) => {
                                            setKey(key + 1)
                                            getTickets({filter: 'category', category: v})
                                        }}>
                                        {categories?.docs.map((d, i) => <Select.Option key={i}
                                            value={d._id}>{d.name}
                                        </Select.Option>)}
                                    </Select>

                                    <Select defaultValue="Priority" allowClear
                                        style={{
                                            width: 120,
                                        }}
                                        onSelect={(v) => {
                                            setKey(key + 1)
                                            getTickets({filter: 'priority', priority: v})
                                        }}>
                                        {ticketPriorities?.map((d, i) => <Select.Option key={i}
                                            value={d._id}>{d.name}
                                        </Select.Option>)}
                                    </Select>

                                    <Select defaultValue="Status" allowClear
                                        style={{
                                            width: 120,
                                        }}
                                        onSelect={(v) => {
                                            setKey(key + 1)
                                            getTickets({filter: 'status', status: v})
                                        }}>
                                        <Select.Option value={"open"}>Open</Select.Option>
                                        <Select.Option value={"closed"}>Closed</Select.Option>
                                    </Select>

                                    <Select defaultValue="Assign To" allowClear
                                        style={{
                                            width: 220,
                                        }}
                                        onSelect={(v) => {
                                            setKey(key + 1)
                                            setSelectedDepartment(v);
                                            getTickets({filter: 'assigned_to', assigned_to: v})
                                        }}>
                                        {employees?.docs.map((d, i) => <Select.Option key={i}
                                            value={d._id}>{d.name}<br />{d.email}
                                        </Select.Option>)}
                                    </Select>

                                    <Button onClick={() => {
                                        getTickets({filter: ''})
                                        setKey(key + 1);
                                    }} >Reset Filters</Button>

                                </div>
                            )
                        }
                        onReload={getTickets}
                    />
                </div>
            </section>
        </>
    );
};
Tickets.layout = AdminLayout;
export default Tickets;
















