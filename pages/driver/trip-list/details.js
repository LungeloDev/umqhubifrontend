import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { fetchTrip } from '../../../helpers/backend_helper';
import { useFetch } from '../../../helpers/hooks';
import DriverLayout from '../../../layouts/driver';
import RouteLoader from '../../../components/common/preloader';
import { useSite } from '../../../contexts/site';
import TripDetails from '../../../components/frontend/common/tripDetails';

const DriverTripListDetails = () => {
    const { query } = useRouter();
    const [tripDetails, getTripDetails] = useFetch(fetchTrip, { _id: query?._id });
    const { currency_code } = useSite()

    useEffect(() => {
        getTripDetails({ _id: query?._id });
    }, [query?._id]);

    const column = [
        {
            dataField: '_id', text: 'Id',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?._id}</span></div>)
        },
        {
            dataField: 'amount', text: 'Amount',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.amount}</span></div>)
        },
        {
            dataField: 'method', text: 'Method',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.method}</span></div>)
        },
    ];

    if (!tripDetails) {
        return <RouteLoader />
    }
    const a = "https://maps.google.com/maps?q=22.802053797970732,89.53548733302094&hl=es;z=14&amp;output=embed"

    return (
        <TripDetails currency_code={currency_code} tripDetails={tripDetails} getTripDetails={getTripDetails} />
    );
};

DriverTripListDetails.layout = DriverLayout
export default DriverTripListDetails;