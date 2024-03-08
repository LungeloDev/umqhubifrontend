import React, {useEffect} from "react";
import {useSite} from "../../../../contexts/site";
import {useFetch} from "../../../../helpers/hooks";
import AdminLayout from "../../../../layouts/admin";
import {fetchTrip} from "../../../../helpers/backend_helper";
import {useRouter} from "next/router";
import TripDetails from "../../../../components/frontend/common/tripDetails";
import RouteLoader from "../../../../components/common/preloader";

const AdminTripDetails = () => {
    const {query} = useRouter();
    const [tripDetails, getTripDetails] = useFetch(fetchTrip, {_id: query?._id});
    const {currency_code} = useSite()

    useEffect(() => {
        getTripDetails({_id: query?._id});
    }, [query?._id]);

    if (!tripDetails) {
        return <RouteLoader/>
    }

    return (
        <TripDetails currency_code={currency_code} tripDetails={tripDetails} getTripDetails={getTripDetails}/>
    );
};

AdminTripDetails.layout = AdminLayout;
export default AdminTripDetails;
