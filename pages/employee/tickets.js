import React, {useEffect, useState} from 'react';

import PageTitle from "../../components/common/page-title";
import Table from '../../components/common/table';
import {useFetch} from "../../helpers/hooks";
import {
    featchTickets, fetchProfile, fetchTicketCategory, fetchTicketDepartments, fetchTicketTypes, getTicketPriorities,
} from "../../helpers/backend_helper";
import {useI18n} from "../../contexts/i18n";
import EmployeeLayout from "../../layouts/employee";
import Router from "next/router";
import Button from '../../components/common/button';

const Tickets = () => {
    const i18n = useI18n()
    const [tickets, getTicket] = useFetch(featchTickets, {}, false)
    const [department, getDepartment] = useFetch(fetchTicketDepartments)
    const [allCategories] = useFetch(fetchTicketCategory)
    const [allTypes] = useFetch(fetchTicketTypes)
    const [ticketPriorities, getPriorities] = useFetch(getTicketPriorities)
    const [currentUser] = useFetch(fetchProfile);

    useEffect(() => {
        getTicket({employee_id: currentUser?._id})
    }, [currentUser]);

    return (
        <>
            <PageTitle title="Ticket" />
            <section>
                <div className='card_container'>
                    <Table
                        data={tickets?.assigned_ticket}
                        columns={[
                            {
                                text: 'Tickets No', dataField: '_id'
                            },
                            {
                                //['open', 'pending', 'closed'],
                                text: 'Name', dataField: 'name'
                            },
                            {
                                text: 'Email', dataField: 'email'
                            },
                            {
                                text: 'Subject', dataField: 'subject'
                            },
                            {
                                text: 'Department',
                                dataField: 'department',
                                formatter: (cell) => department?.docs.find(d => d._id === cell)?.name
                            },
                            {
                                text: 'Category',
                                dataField: 'category',
                                formatter: (cell) => allCategories?.docs.find(d => d._id === cell)?.name
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
                                text: 'Date',
                                dataField: 'createdAt',
                                formatter: (cell) => new Date(cell).toLocaleDateString()
                            },
                            {
                                text: 'Status',
                                dataField: 'status',
                                formatter: (cell) => cell === 'pending' ?
                                    <div className={'px-2 py-1 rounded-2xl border-2 border-twSecondary-shade700 text-center text-twSecondary-shade700'}>Pending</div> :
                                    cell === 'closed' ?
                                        <div className={'px-2 py-1 rounded-2xl border-2 border-red-500 text-center text-red-500'}>Closed</div> :
                                        <div className={'px-2 py-1 rounded-2xl border-2 border-green-500 text-center text-green-500'}>Open</div>
                            }
                        ]}
                        shadow={false}
                        actions={(data) =>
                            <Button
                                onClick={() => {
                                    Router.push(`/employee/${data._id}`)
                                }}>
                                Replay
                            </Button>
                        }
                    />
                </div>

            </section>
        </>);
};
Tickets.layout = EmployeeLayout;
export default Tickets;
















