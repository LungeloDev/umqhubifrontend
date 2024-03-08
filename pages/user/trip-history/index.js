import moment from 'moment';
import {useRouter} from 'next/router';
import React from 'react';
import {FaEye} from 'react-icons/fa';
import Table from '../../../components/common/table';
import {useSite} from '../../../contexts/site';
import {fetchUserTripList, paymentChecking} from '../../../helpers/backend_helper';
import {useFetch} from '../../../helpers/hooks';
import UserLayout from '../../../layouts/user';
import Card from "../../../components/common/card"
import {useI18n} from '../../../contexts/i18n';
import {message} from "antd";

const TripHistory = () => {
    const [userTripList, getUserTripList] = useFetch(fetchUserTripList)
    const i18n = useI18n();
    const {currency_code} = useSite()
    const {push} = useRouter()
    const column = [
        {
            dataField: 'name', text: 'Driver Name',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?.driver?.name}</span></div>)
        },
        {
            dataField: 'date', text: 'Date',
            formatter: (_, data) => (<div className=''> <span className=''>{moment(data?.createdAt).format("MMM DD, YYYY")}</span></div>)
        },
        {
            dataField: 'time', text: 'Time',
            formatter: (_, data) => (<div className=''> <span className=''>{moment(data?.createdAt).format("hh:mm A")}</span></div>)
        },
        {
            dataField: 'userPhone', text: 'Total Fare',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{`${currency_code ? currency_code : ""} ${data?.total}`}</span></div>)
        },
        {
            dataField: 'rating', text: 'Status',
            formatter: (_, data) => <span
                className={`capitalize ${data?.status?.toLowerCase() === 'completed' && 'text-green-500'} 
                    ${data?.status?.toLowerCase() === 'pending' && 'text-yellow-500'}
                    ${data?.status?.toLowerCase() === 'accepted' && 'text-blue-500'}
                    ${data?.status?.toLowerCase() === 'declined' && 'text-red-500'}`
                }
            >
                {data?.status}
            </span>
        },
        {
            dataField: 'userPhone', text: 'Check Payment',
            formatter: (_, data) => (
                <button className="btn btn-accent btn-sm text-gray-800 focus:shadow-none me-2"
                        title="Check payment status"
                        onClick={async () => {
                            const res = await paymentChecking({trip: data?._id});
                            if(res?.error === false) {
                                if(res?.data?.payment === false) {
                                    const token = localStorage.getItem('authToken') ?? '';
                                    await push(`/payment?tripId=${data?._id}&token=${token}&web_payment=true`)
                                } else if(res?.data?.payment === true) {
                                    message.success("Trip successfully paid")
                                }
                            } else {
                                message.success("Please try again...")
                            }
                        }}>
                    {
                        data?.due > 0 ?
                            <span className={'text-red-500'}>due to be paid</span>
                            :
                            "Already paid"
                    }
                </button>
            )
        },
    ];

    let actions = (data) => (
        <div className="flex">
            <button className="btn btn-outline-primary btn-sm focus:shadow-none me-2"
                title="View details"
                onClick={() => push(`/user/trip-history/details?_id=${data?._id}`)}>
                <FaEye className='cursor-pointer' />
            </button>
        </div>)

    return (
        <div className='font-Poppins text-twContent'>
            <Card>
                <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t("Trip History")}</h1>
            </Card>
            {/* table  */}
            <div className='my-6'>
                <Table
                    columns={column}
                    data={userTripList}
                    pagination={true}
                    noActions={false}
                    actions={actions}
                    indexed={true}
                    shadow={true}
                    onReload={getUserTripList}
                    textCenter={true}
                />
            </div>
        </div>
    );
};

TripHistory.layout = UserLayout;
export default TripHistory;