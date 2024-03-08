import {Form} from 'antd';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../../layouts/admin";
import {useFetch} from "../../../../helpers/hooks";
import {
    fetchServiceVehicle,
} from "../../../../helpers/backend_helper";
import AddNewVehicle from "./add";


const EditVehicleSetting = () => {
    const [form] = Form.useForm();
    const {query} = useRouter();
    const [vehicle, getVehicle, {loading, error}] = useFetch(fetchServiceVehicle, {}, false);
    const [service, setService] = useState()
    const [images, setImages] = useState()

    // load services data
    useEffect(() => {
        if(query?._id) {
            getVehicle({_id: query?._id})
        }
    }, [query?._id])

    // initialize data if exist
    useEffect(() => {
        if (vehicle?._id) {
            form.setFieldsValue({
                ...vehicle,
                service: vehicle?.service?._id,
                service_category: vehicle?.service_category?._id,
                service_package: vehicle?.service_package?._id,
                name: vehicle?.name?._id,
                image: [vehicle?.image]?.map((d, index) => ({
                    uid: '-' + (index + 1),
                    name: `image${index}.png`,
                    status: 'done',
                    url: d
                })),
            })
            setService(vehicle?.service?._id)
            setImages(form.getFieldValue().image)
        }
    }, [vehicle?._id])

    return (
        <div>
            <AddNewVehicle c_title='edit' form={form} service={service} images={images}/>
        </div>
    );
};
EditVehicleSetting.layout = AdminLayout
export default EditVehicleSetting;