import {Form} from 'antd';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {fetchServiceLocations} from "../../../../helpers/backend_helper";
import { useFetch } from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";
import AddLocation from './add';


const EditLocation = () => {
    const [form] = Form.useForm();
    const {query} = useRouter();
    const [location, getLocation] = useFetch(fetchServiceLocations, query)
    const [timeZoneData, setTimeZoneData] = useState();
    const [coordinatesData, setCoordinatesData] = useState();
    
    // initialize data if exist
    useEffect(() => {
        if (location?.docs[0]._id) {
            form.setFieldsValue({
                ...location?.docs[0],
            })
            setCoordinatesData(location?.docs[0].location)
            setTimeZoneData(location?.docs[0].timezone)
        }
    }, [location?.docs[0]?._id])
 

    return (
        <div>
            <AddLocation c_title='edit' form={form} timeZoneData={timeZoneData} coordinatesData={coordinatesData} />
        </div>
    );
};
EditLocation.layout = AdminLayout
export default EditLocation;