import React, { useEffect } from 'react';
import Card from '../../../../components/common/card';
import { useFetch } from '../../../../helpers/hooks';
import { fetchDriverVehicle} from '../../../../helpers/backend_helper';
import Head from 'next/head';
import RouteLoader from '../../../../components/common/preloader';
import AdminLayout from '../../../../layouts/admin';
import { useRouter } from 'next/router';

const VehicleDetails = () => {
    const { query } = useRouter();
    const [vehicles, getVehicles] = useFetch(fetchDriverVehicle)

    useEffect(() => {
        getVehicles({ _id: query?._id });
    }, [query?._id]);

    if (!vehicles) {
        return <RouteLoader />
    }

    return (
        <div>
            <Head>
                <title>Vehicles</title>
            </Head>
            <div className=''>
                <Card
                    title={"Vehicle"}
                >
                    {/* vehicle information */}
                    <Card>
                        <div className="grid grid-cols-2 border-b pt-2">
                            <span className="text-lg font-medium text-twContent">Name</span>
                            <span className="text-lg font-bold text-twContent">{vehicles?.name}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b pt-2">
                            <span className="text-lg font-medium text-twContent">Service</span>
                            <span className="text-lg font-bold text-twContent">{vehicles?.service?.name}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b pt-2">
                            <span className="text-lg font-medium text-twContent">Service Category</span>
                            <span className="text-lg font-bold text-twContent">{vehicles?.service_category?.name}</span>
                        </div>
                    </Card>
                    {/* Vehicle Image  */}
                    <Card>
                        <h3 className='text-gray-600 text-[16px] font-semibold tracking-wider mb-2'>Vehicle Images:</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            {
                                vehicles?.images?.map((image, i) => <img key={i} className='shadow-sm' src={image} />)
                            }
                        </div>
                    </Card>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        {/* vehicle specification  */}
                        <Card>
                            <h3 className='text-gray-600 text-[16px] font-semibold tracking-wider'>Vehicle specification:</h3>
                            <div>
                                {
                                    Object.entries(vehicles?.specifications).map(([key, value]) => (
                                        <div key={value} className="grid grid-cols-2 border-b pt-2">
                                            <span className="text-lg font-medium text-twContent">{key}</span>
                                            <span className="text-lg font-bold text-twContent">{value}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </Card>
                        {/* vehicle features  */}
                        <Card>
                            <h3 className='text-gray-600 text-[16px] font-semibold tracking-wider'>Vehicle Features:</h3>
                            <div>
                                {
                                    Object.entries(vehicles?.features).map(([key, value]) => (
                                        <div key={value} className="grid grid-cols-2 border-b pt-2">
                                            <span className="text-lg font-medium text-twContent">{key}</span>
                                            <span className="text-lg font-bold text-twContent">{value}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </Card>
                    </div>
                </Card>
            </div>
        </div>
    );
};
VehicleDetails.layout = AdminLayout
export default VehicleDetails;