import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Button from '../../../../components/common/button';
import Table, { TableImage } from '../../../../components/common/table';
import {
    delServiceVehicle, fetchServiceVehicleList,
} from '../../../../helpers/backend_helper';
import { useFetch } from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";
import moment from "moment";
import { useI18n } from '../../../../contexts/i18n';


const Vehicle = () => {
    const { push } = useRouter();
    const i18n = useI18n();
    const [vehicles, getVehicles, { loading, error }] = useFetch(fetchServiceVehicleList);

    let columns = [
        {
            dataField: 'image', text: 'image',
            formatter: d => <TableImage url={d} />
        },
        {
            dataField: 'category', text: 'Category',
            formatter: category => <span className='capitalize'>{category}</span>
        },
        {
            dataField: 'package', text: 'Package',
            formatter: (_, data) => <span className='capitalize'>{data?.package}</span>
        },
        {
            dataField: 'service', text: 'Service',
            formatter: service => <span className='capitalize'>{service}</span>
        },
        {
            dataField: 'name', text: 'Vehicle Name',
            formatter: name => <span className='capitalize'>{name}</span>
        },
        {
            dataField: 'vehicle_model', text: 'Vehicle Model',
            formatter: vehicle_model => <span className='capitalize'>{vehicle_model}</span>
        },
        {
            dataField: 'createdAt', text: 'CreatedAt',
            formatter: createdAt => <span className='capitalize'>{createdAt ? moment(createdAt).format('ll') : ''}</span>
        },
    ];

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={async () => {
                    await push('/admin/services/vehicle/add')
                }}>{!!i18n && i18n?.t("Add Vehicle")}</Button>
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
                        await push(`/admin/services/vehicle/edit?_id=${data?._id}`)
                    }}
                    onDelete={delServiceVehicle}
                    onReload={getVehicles}
                    error={error}
                />
            </div>
        </section>
    );
};
Vehicle.layout = AdminLayout;
export default Vehicle;