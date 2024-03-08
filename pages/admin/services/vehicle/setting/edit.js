import {Form} from 'antd';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../../../layouts/admin";
import {useFetch} from "../../../../../helpers/hooks";
import {fetchVehicleSetting} from "../../../../../helpers/backend_helper";
import AddNewVehicleSetting from "./add";


const EditVehicleSetting = () => {
    const [form] = Form.useForm();
    const {query} = useRouter();
    const [vehicle, getVehicle] = useFetch(fetchVehicleSetting, {}, false);

    useEffect(() => {
        if(query?._id) {
            getVehicle({_id: query?._id})
        }
    }, [query?._id])

    useEffect(() => {
        if (vehicle?._id) {
            form.setFieldsValue({
                ...vehicle,
            })
        }
    }, [vehicle?._id])

    return (
        <div>
            <AddNewVehicleSetting c_title='edit' form={form} />
        </div>
    );
};
EditVehicleSetting.layout = AdminLayout
export default EditVehicleSetting;