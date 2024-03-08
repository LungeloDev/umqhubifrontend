import Head from 'next/head';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import Button from '../../../../../components/common/button';
import Table, {TableImage} from '../../../../../components/common/table';
import {
    delServiceSetting,
    fetchVehicleSettings,
} from '../../../../../helpers/backend_helper';
import {useFetch} from '../../../../../helpers/hooks';
import AdminLayout from "../../../../../layouts/admin";


const VehicleSetting = () => {
    const {push} = useRouter();
    const [vehicles, getVehicles, {error, loading}] = useFetch(fetchVehicleSettings);

    let columns = [
        {
            dataField: 'service', text: 'Service',
            formatter: service => <span className='capitalize'>{service?.name}</span>
        },
        {
            dataField: 'name', text: 'Brand Name',
            formatter: name => <span className='capitalize'>{name}</span>
        },
    ];

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={async () => {
                    await push('/admin/services/vehicle/setting/add')
                }}>Add Brand</Button>
        </div>)

    return (
        <section>
            <Head>
                <title>Vehicle list</title>
            </Head>
            <div className='card_container'>
                <Table
                    columns={columns}
                    data={vehicles}
                    pagination={true}
                    noActions={false}
                    action={action}
                    indexed={true}
                    shadow={false}
                    onEdit={async (data) => {
                        await push(`/admin/services/vehicle/setting/edit?_id=${data?._id}`)
                    }}
                    onDelete={delServiceSetting}
                    onReload={getVehicles}
                    error={error}
                />
            </div>
        </section>
    );
};
VehicleSetting.layout = AdminLayout;
export default VehicleSetting;