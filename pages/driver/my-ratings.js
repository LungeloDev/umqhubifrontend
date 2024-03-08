import React, { useEffect } from 'react';
import Card from '../../components/common/card';
import { useFetch } from '../../helpers/hooks';
import DriverLayout from '../../layouts/driver';
import { fetchProfile, getApprovedDriversRatings } from '../../helpers/backend_helper';
import RouteLoader from '../../components/common/preloader';
import moment from 'moment';
import Table from '../../components/common/table';
import { FaUserCircle } from 'react-icons/fa';
import { Popover, Rate } from 'antd';
import Link from 'next/link';
import { useI18n } from '../../contexts/i18n';

const MyRatings = () => {
    const [user] = useFetch(fetchProfile);
    const i18n = useI18n();
    const [ratings, getRatings] = useFetch(getApprovedDriversRatings, {}, false)

    useEffect(() => {
        user?._id && getRatings({ driver: user?._id })
    }, [user?._id])

    // table column 
    const column = [
        {
            dataField: 'image', text: 'User Image',
            formatter: (_, data) => (<div className=''> {data?.user?.image ? <img src={data?.user?.image} className='w-10 rounded-full' /> : <FaUserCircle size="40px" />}</div >)
        },
        {
            dataField: 'trip', text: 'Trip Id',
            formatter: (_, data) => (<span className=''><Link href={`/driver/trip-list/details/?_id=${data?.trip}`}><a className="text-blue-600 underline hover:text-blue-600 hover:underline" >{data?.trip}</a></Link></span>)
        },
        {
            dataField: 'name', text: 'User Name',
            formatter: (_, data) => (<span className='capitalize'>{data?.user?.name}</span>)
        },
        {
            dataField: 'phone', text: 'User Phone Number',
            formatter: (_, data) => (<span className='capitalize'>{data?.user?.name}</span>)
        },
        {
            dataField: 'rating', text: 'Rating',
            formatter: (_, data) => (<span className=''><Rate allowHalf disabled value={data?.rating}></Rate></span>)
        },
        {
            dataField: 'comment', text: 'Comment',
            formatter: (_, data) => (<span className='capitalize'><Popover content={<div className='max-w-sm'>{data?.comment}</div>}>
                <span className='capitalize'>{data?.comment?.length > 20 ? `${data?.comment.slice(0, 20)}...` : data?.comment}</span>
            </Popover></span>)
        },
        {
            dataField: 'date', text: 'Date',
            formatter: (_, data) => (<span className=''>{moment(data?.createdAt).format("MMM DD, YYYY")}</span>)
        },
    ];

    if (!ratings) {
        return <RouteLoader />
    }

    return (
        <div>
            {/* header  */}
            <Card>
                <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t("My Ratings")}</h1>
            </Card >

            {/* rating info  */}
            <Card>
                <div className='space-y-3 text-xl font-medium'>
                    <h3>Total Ratings: {ratings?.docs?.length}</h3>
                    <h3>Average Rating: {ratings?.element?.rating.toFixed(2)}</h3>
                </div>
            </Card>

            {/* rating list table */}
            <Card>
                <Table
                    title={!!i18n && i18n?.t("Ratings List")}
                    columns={column}
                    data={ratings}
                    onReload={getRatings}
                    pagination={true}
                    noActions={true}
                    indexed={true}
                    shadow={false}
                    textCenter={true}
                />
            </Card>
        </div>
    );
};

MyRatings.layout = DriverLayout
export default MyRatings;