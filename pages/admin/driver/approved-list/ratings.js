import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import Card from '../../../../components/common/card';
import Table from '../../../../components/common/table';
import {delRating, getApprovedDriversRatings, postActiveStatus} from '../../../../helpers/backend_helper';
import {useFetch} from '../../../../helpers/hooks';
import AdminLayout from '../../../../layouts/admin';
import moment from 'moment';
import {Popover, Switch} from 'antd';

const Ratings = () => {
    const [driverRatings, getDriverRatings, {loading, error}] = useFetch(getApprovedDriversRatings, {}, false);
    const {query} = useRouter()

    const handleActive = async (id, checked) => {
        const data = {
            _id: id,
            active: checked
        }
        const {error, msg} = await postActiveStatus(data)
        if (error === false) {
            getDriverRatings()
        }
    }

    useEffect(() => {
        if (!!query?.driver) {
            getDriverRatings({driver: query?.driver})
        }
    }, [query?.driver])

    // table columns 
    const column = [
        {
            dataField: 'name', text: 'User',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?.user?.name}</span></div>)
        },
        {
            dataField: 'userEmail', text: 'User Email',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.user?.email}</span></div>)
        },
        {
            dataField: 'userPhone', text: 'User Phone',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.user?.phone}</span></div>)
        },
        {
            dataField: 'rating', text: 'Rating',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?.rating}</span></div>)
        },
        {
            dataField: 'comment', text: 'Comment',
            formatter: (_, data) => (<div className=''>
                <Popover content={<div className='max-w-sm'>{data?.comment}</div>}>
                    <span className='capitalize underline text-teal-500 cursor-pointer'>{`${data?.comment.slice(0, 10)}...`}</span>
                </Popover></div>)
        },
        {
            dataField: 'createdAt', text: 'Created at',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{moment(data?.createdAt).format("MMMM d, YYYY")}</span></div>)
        },
        {
            dataField: 'active', text: 'Active',
            formatter: (_, data) => (
                <div className='antd-switch'>
                    <span className='capitalize'>{
                        <Switch onChange={(checked) => handleActive(data?._id, checked)} checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked={data?.active} />}
                    </span>
                </div>)
        },
    ];

    return (
        <div>
            <Card className={'shadow-sm'}>
                <h1 className={'text-gray-600 text-[16px] font-semibold tracking-wider'}>Driver Ratings</h1>
            </Card>
            {/* driver information  */}
            <Card className={'shadow-sm'}>
                <h1 className={'text-gray-600 text-[16px] font-semibold tracking-wider mb-4'}>Driver Information</h1>
                <div className='max-w-fit'>
                    <div className="grid grid-cols-2 gap-x-4 border-b py-[8px] px-2">
                        <p>Name</p>
                        <p>
                            {driverRatings?.element?.driver?.name}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 border-b py-[8px] px-2">
                        <p>Email</p>
                        <p>
                            {driverRatings?.element?.driver?.email}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 border-b py-[8px] px-2">
                        <p>Phone</p>
                        <p>
                            {driverRatings?.element?.driver?.phone}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 border-b py-[8px] px-2">
                        <p>Average Rating</p>
                        <p>
                            {driverRatings?.element?.rating.toFixed(2)}
                        </p>
                    </div>
                </div>

            </Card>
            {/* Ratings  */}
            <Card>
                <Table
                    columns={column}
                    data={driverRatings}
                    pagination={true}
                    noActions={false}
                    indexed={true}
                    shadow={false}
                    onDelete={delRating}
                    onReload={getDriverRatings}
                    error={error}
                    loading={loading}
                    textCenter={false}
                />
            </Card>
        </div>
    );
};

Ratings.layout = AdminLayout
export default Ratings;