import React, {useEffect} from 'react';
import moment from "moment";
import Table from '../../common/table';
import {useFetch} from '../../../helpers/hooks';
import {fetchTripsList} from '../../../helpers/backend_helper';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useI18n} from '../../../contexts/i18n';

const RecentRequest = () => {
    const i18n = useI18n()
    const {push} = useRouter()
    const [recentRequest, getRecentRequest, {error, loading}] = useFetch(fetchTripsList, {}, false)

    useEffect(() => {
        getRecentRequest({size: 5})
    }, [])

    // table columns 
    let columns = [
        {
            dataField: '_id', text: 'Trip Id',
            formatter: _id => <Link href={`/admin/trip-management/trips/details/?_id=${_id}`} ><a className='text-blue-600 underline'>{_id}</a></Link>
        },
        {
            dataField: 'driver', text: 'Driver Name',
            formatter: driver => <span className='capitalize'>{driver?.name}</span>
        },
        {
            dataField: 'createdAt', text: 'Date',
            formatter: createdAt => <span className=''>{moment(createdAt).format("DD MMM, YYYY")}</span>
        },
        {
            dataField: 'user', text: 'Customer Name',
            formatter: user => <span className='capitalize'>{user?.name}</span>
        },
        {
            dataField: 'status', text: 'Status',
            formatter: status => <span
                className={`capitalize ${status?.toLowerCase() === 'completed' && 'text-green-500'} 
                ${status?.toLowerCase() === 'paid' && 'text-green-500'} 
                ${status?.toLowerCase() === 'pending' && 'text-yellow-500'}
                ${status?.toLowerCase() === 'accepted' && 'text-blue-500'}
                ${status?.toLowerCase() === 'declined' && 'text-red-500'}`
                }
            >
                {status}
            </span>
        },
    ]

    return (
        <div className='shadow-md rounded-lg'>
            <div className='card_container'>
                <Table
                    indexed
                    columns={columns}
                    title={!!i18n?.t ? i18n?.t("Recent Request") : "Recent Request"}
                    onReload={getRecentRequest}
                    data={recentRequest?.docs}
                    loading={loading}
                    scroll="scroll"
                    noActions
                    shadow={false}
                    action={<div className='text-blue-600 underline cursor-pointer' onClick={() => push("/admin/trip-management/trips/")}>view all</div>}
                />
            </div>
        </div>
    );
};

export default RecentRequest;