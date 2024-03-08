import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import VehicleCard from '../../../components/admin/vehicle/vCard';
import { fetchServiceList } from '../../../helpers/backend_helper';
import AdminLayout from "../../../layouts/admin";
import { useFetch } from "../../../helpers/hooks";
import Button from "../../../components/common/button";
import { useI18n } from '../../../contexts/i18n';

const Vehicles = () => {
    const router = useRouter();
    const i18n = useI18n();
    const [services, getServices, { error, loading }] = useFetch(fetchServiceList);

    const handleNewAddVehicle = async () => {
        await router.push('/admin/services/add/')
    }

    return (
        <div>
            <section className='bg-white min-h-screen rounded-md p-2'>
                {/* add button */}
                <div className='flex justify-end pr-5 pt-3'>
                    <Button className='' onClick={handleNewAddVehicle}>{!!i18n && i18n?.t("Add Service")}</Button>
                </div>
                {/* services card */}
                <div className='card_container md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                    {
                        services?.docs?.map((vData, i) => <VehicleCard key={vData?._id} data={vData}
                            getVehicles={getServices} />)
                    }
                </div>
            </section>
        </div>
    );
};
Vehicles.layout = AdminLayout;
export default Vehicles;