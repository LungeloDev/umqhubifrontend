import {Form} from 'antd';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {fetchService} from "../../../helpers/backend_helper";
import AdminLayout from "../../../layouts/admin";
import AddNewService from "./add";


const EditVehicle = () => {
    const [form] = Form.useForm();
    const { query = '' } = useRouter();
    const [service, setService] = useState({});
    const [images, setImages] = useState()

    // load services data
    useEffect(() => {
        fetchService({_id: query?._id}).then(res => {
            if (res?.error === false) {
                setService(res?.data);
            }
        })
    }, [query?._id])

    // initialize data if exist
    useEffect(() => {
        if (service?._id) {
            form.setFieldsValue({
                ...service,
                categories: service?.categories?.map( d => (d?._id)),
                service_packages: service?.service_packages?.map( d => (d?._id)),
                image: [service?.image]?.map((d, index) => ({
                    uid: '-' + (index + 1),
                    name: `image${index}.png`,
                    status: 'done',
                    url: d
                })),
            })
            setImages(form.getFieldValue().image)
        }
    }, [service?._id])

    return (
        <div>
            <AddNewService c_title='edit' form={form} images={images}/>
        </div>
    );
};
EditVehicle.layout = AdminLayout
export default EditVehicle;