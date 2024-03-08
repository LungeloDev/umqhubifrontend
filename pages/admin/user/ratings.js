import {DatePicker, Form, Popover, Rate} from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, {useState} from 'react';
import {FaUserCircle} from 'react-icons/fa';
import Card from '../../../components/common/card';
import RouteLoader from '../../../components/common/preloader';
import Table, {TableImage} from '../../../components/common/table';
import {useI18n} from '../../../contexts/i18n';
import {deleteRatingAdmin, getAllRatingAdmin} from '../../../helpers/backend_helper';
import {useFetch} from '../../../helpers/hooks';
import AdminLayout from '../../../layouts/admin';

const {RangePicker} = DatePicker;

const UserRatings = () => {
    const i18n = useI18n();
    const [ratings, getRatings, {error, loading}] = useFetch(getAllRatingAdmin);
    const [date, setDate] = useState();

    // table column 
    const column = [
        {
            dataField: 'image', text: 'User Image',
            formatter: (_, data) => (<div className=''> {data?.user?.image ? <TableImage url={data?.user?.image}/> :
                <FaUserCircle size="40px"/>}</div>)
        },
        {
            dataField: 'trip', text: 'Trip Id',
            formatter: (_, data) => (
                <span className=''><Link href={`/admin/trip-management/trips/details/?_id=${data?.trip}`}><a
                    className="text-blue-600 underline hover:text-blue-600 hover:underline">{data?.trip}</a></Link></span>)
        },
        {
            dataField: 'name', text: 'User Name',
            formatter: (_, data) => (<span className='capitalize'>{data?.user?.name}</span>)
        },
        {
            dataField: 'email', text: 'User Email',
            formatter: (_, data) => (<span className=''>{data?.user?.email}</span>)
        },
        {
            dataField: 'name', text: 'Driver Name',
            formatter: (_, data) => (<span className='capitalize'>{data?.driver?.name}</span>)
        },
        {
            dataField: 'email', text: 'Driver Email',
            formatter: (_, data) => (<span className=''>{data?.driver?.email}</span>)
        },
        {
            dataField: 'phone', text: 'User Phone Number',
            formatter: (_, data) => (<span className=''>{data?.user?.phone}</span>)
        },
        {
            dataField: 'rating', text: 'Rating',
            formatter: (_, data) => (<span className=''><Rate allowHalf disabled value={data?.rating}></Rate></span>)
        },
        {
            dataField: 'comment', text: 'Comment',
            formatter: (_, data) => (
                <span className='capitalize'><Popover content={<div className='max-w-sm'>{data?.comment}</div>}>
                <span
                    className='capitalize'>{data?.comment?.length > 20 ? `${data?.comment.slice(0, 20)}...` : data?.comment}</span>
            </Popover></span>)
        },
        {
            dataField: 'date', text: 'Date',
            formatter: (_, data) => (<span className=''>{moment(data?.createdAt).format("MMM DD, YYYY")}</span>)
        },
    ];

    if (!ratings) {
        return <RouteLoader/>
    }

    return (
        <div>
            {/* rating list table */}
            <Card title={!!i18n && i18n?.t("Rating List")}>
                <Table
                    columns={column}
                    data={ratings}
                    onReload={getRatings}
                    pagination={true}
                    noActions={false}
                    indexed={true}
                    shadow={false}
                    textCenter={true}
                    onDelete={deleteRatingAdmin}
                    action={
                        <RangePicker
                            disabledDate={(current) => current && current.valueOf() > Date.now()}
                            onChange={(e) => {
                                getRatings({
                                    start: !!e ? moment(e[0])?.startOf('day').add('day', 1).toISOString() : '',
                                    end: !!e ? moment(e[1])?.toISOString() : ''
                                })
                            }}
                        />
                    }
                />
            </Card>
        </div>
    );
};

UserRatings.layout = AdminLayout
export default UserRatings;