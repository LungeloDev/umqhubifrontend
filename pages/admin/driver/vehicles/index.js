import { useRouter } from 'next/router';
import { Select, Switch } from 'antd';
import React from 'react';
import {
    delVehicle,
    fetchDriverVehicles,
    updateDriverVehicle,
} from '../../../../helpers/backend_helper';
import moment from 'moment';
import AdminLayout from "../../../../layouts/admin";
import { useAction, useFetch } from "../../../../helpers/hooks";
import Table from "../../../../components/common/table";
import Card from "../../../../components/common/card";
import { FaFileAlt } from 'react-icons/fa';
import { useI18n } from '../../../../contexts/i18n';

const DriverVehicles = () => {
    const i18n = useI18n();
    const router = useRouter();
    const [vehicles, getVehicles, { error, loading }] = useFetch(fetchDriverVehicles)

    const columns = [
        {
            dataField: 'service_category', text: 'Service Category',
            formatter: (service_category) => (<div className=''><span className='capitalize'>{service_category?.name}</span></div>)
        },
        {
            dataField: 'name', text: 'Vehicle Name',
            formatter: (name) => (
                <div className=''><span className=''>{name ? name : ''}</span></div>)
        },
        {
            dataField: 'model_name', text: 'Model',
            formatter: (model_name) => (<div className=''><span className=''>{model_name ? model_name : ''}</span></div>)
        },
        {
            dataField: 'driver', text: 'Driver',
            formatter: (driver) => (<div className=''><span className='capitalize'>{driver?.name}</span></div>)
        },
        {
            dataField: 'driver', text: 'Driver Email',
            formatter: (driver) => (<div className=''><span className=''>{driver?.email}</span></div>)
        },
        {
            dataField: 'driver', text: 'Driver Phone',
            formatter: (driver) => (<div className=''><span className='capitalize'>{driver?.phone}</span></div>)
        },
        {
            dataField: 'createdAt', text: 'Applied At',
            formatter: (createdAt) => (<div className=''><span className='capitalize'>{createdAt && moment(createdAt).format('ll')}</span></div>)
        },
        {
            dataField: 'approved', text: 'Verified status',
            formatter: (approved, data) => (<div className=''>
                <Switch onChange={(e) => useAction(updateDriverVehicle,
                    { _id: data?._id, approved: e },
                    () => getVehicles())}
                    checkedChildren={'Verified'}
                    unCheckedChildren={'Unverified'}
                    checked={approved}
                />
            </div>)
        },
        {
            dataField: 'documents', text: 'Documents',
            formatter: (_, data) => (<button className='hover:text-twSecondary-shade800' onClick={() => router.push(`/admin/driver/vehicles/documents?_id=${data?._id}`)}><FaFileAlt size={24} className='text-twSecondary-shade800 hover:text-twSecondary' /></button>)
        },
    ];

    return (
        <div>
            <Card className={'shadow-sm text-font_color font-semibold'}>
                <h1 className=''>
                    {!!i18n && i18n?.t("Driver Vehicle List")}
                </h1>
            </Card>
            <Card className='bg-white rounded-md p-2 shadow-sm'>
                <div className='card_container'>
                    {/* table data show */}
                    <Table
                        columns={columns}
                        data={vehicles}
                        pagination={true}
                        noActions={false}
                        indexed={true}
                        shadow={false}
                        onView={(data) => {
                            router.push(`/admin/driver/vehicles/view?_id=${data?._id}`)
                        }}
                        onEdit={(data) => {
                            router.push(`/admin/driver/vehicles/edit?_id=${data?._id}&driver=${data?.driver?._id}`)
                        }}
                        onDelete={delVehicle}
                        onReload={getVehicles}
                        error={error}
                        loading={loading}
                    />
                </div>
            </Card>
        </div>
    );
};
DriverVehicles.layout = AdminLayout
export default DriverVehicles;