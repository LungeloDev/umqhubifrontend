import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import RouteLoader from '../../../components/common/preloader';
import TripDetails from '../../../components/frontend/common/tripDetails';
import { useSite } from '../../../contexts/site';
import { fetchTrip } from '../../../helpers/backend_helper';
import { useFetch } from '../../../helpers/hooks';
import UserLayout from '../../../layouts/user';

const UserTripDetails = () => {
    const { query } = useRouter();
    const [tripDetails, getTripDetails] = useFetch(fetchTrip, { _id: query?._id });
    const { currency_code } = useSite()

    useEffect(() => {
        getTripDetails({ _id: query?._id });
    }, [query?._id]);

    if (!tripDetails) {
        return <RouteLoader />
    }

    return (
        <TripDetails currency_code={currency_code} tripDetails={tripDetails} getTripDetails={getTripDetails} />
    );
};

UserTripDetails.layout = UserLayout
export default UserTripDetails;