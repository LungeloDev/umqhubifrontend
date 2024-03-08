import React from 'react';
import AdminLayout from "../../../../layouts/admin";
import Table from "../../../../components/common/table";
import PageTitle from "../../../../components/common/page-title";
import {useFetch} from "../../../../helpers/hooks";
import {useRouter} from "next/router";
import {delMarketingEmail, fetchAllMails} from "../../../../helpers/backend_helper";
import moment from "moment/moment";
import {useI18n} from "../../../../contexts/i18n";
import {Popover} from "antd";
import Button from "../../../../components/common/button";
import {TiTick} from "react-icons/ti";
import {ImCross} from "react-icons/im";

const UserEmail = () => {
    const i18n = useI18n();
    const router = useRouter();
    const [allMails, gtAllMails] = useFetch(fetchAllMails,);

    const columns = [
        {
            dataField: 'subject',
            text: 'Subject',
            formatter: (cell) => (
                <span className='capitalize'>
                    <Popover content={<div className='max-w-sm'>{cell}</div>}>
                <span
                    className='capitalize'>{cell?.length > 20 ? `${cell.slice(0, 20)}...` : cell}
                </span>
            </Popover>
                </span>
            )
        },
        {
            dataField: 'content',
            text: 'Content',
            formatter: (cell) => (
                <span className='capitalize'>
                    <Popover content={<div className='max-w-sm'>{extractContent(cell)}</div>}>
                <span
                    className='capitalize'>{extractContent(cell)?.length > 20 ? `${extractContent(cell).slice(0, 20)}...` : extractContent(cell)}
                </span>
            </Popover>
                </span>
            )
        },
        {
            dataField: 'updatedAt',
            text: 'Sent Time',
            formatter: (cell) => moment(cell).format('YYYY-MM-DD HH:mm')
        },
        {
            dataField: 'individual_mail',
            text: 'To Individual',
        },
        {
            dataField: 'group',
            text: 'To Group',
            formatter: (cell, row) =>
                cell?.name ? <Button
                    className={'text-md font-semibold'}
                    onClick={() => router.push(`/admin/marketing/manage_group/group_manage/${cell?._id}`)}>{cell?.name}
                </Button> : '...'
        },
        {
            dataField: 'user',
            text: 'to User',
            formatter: (cell) => cell === true ?  <TiTick className={'h-7 w-7 text-green-500'} /> : <ImCross className={' text-red-500'}/>
        },
        {
            dataField: 'driver',
            text: 'to driver',
            formatter: (cell) => cell === true ? <TiTick className={'h-7 w-7 text-green-500'} />: <ImCross className={'text-red-500'}/>
        },
        {
            dataField: 'employee',
            text: 'to employee',
            formatter: (cell) => cell === true ? <TiTick className={'h-7 w-7 text-green-500'} />: <ImCross className={' text-red-500'}/>
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: (cell) =>
                cell === 'success' ?
                    <span className={'text-md font-semibold text-green-500'}>{cell}</span> :
                    <span className={'text-md font-semibold text-red-500'}>{cell}</span>
        }
    ];

    return (
        <div>
            <PageTitle title={i18n.t("All Email")}/>
            <div className='bg-white rounded p-4'>
                <Table
                    pagination
                    columns={columns}
                    data={allMails}
                    onDelete={delMarketingEmail}
                    shadow={false}
                    onReload={gtAllMails}
                />
            </div>
        </div>
    );
};

UserEmail.layout = AdminLayout;
export default UserEmail;


function extractContent(htmlString) {
    var span = document.createElement('span');
    span.innerHTML = htmlString;
    return span.textContent || span.innerText;
};
