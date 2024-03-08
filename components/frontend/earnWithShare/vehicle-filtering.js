import React, {useEffect, useState} from 'react';
import {Form} from "antd";
import {useI18n} from "../../../contexts/i18n";
import {useFetch} from "../../../helpers/hooks";
import {
    fetchService,
    fetchServiceCategories,
    fetchServiceList,
    fetchServiceVehicleList
} from "../../../helpers/backend_helper";
import {Col, Row} from "react-bootstrap";
import FormSelect from "../../form/select";

const VehicleFiltering = ({getServiceVehicle, setVehicleParentsIds, vehicleParentsIds, toggle}) => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    const [categories, getCategories] = useFetch(fetchServiceCategories);
    const [services, getServices] = useFetch(fetchServiceList, {}, false);
    const [servicePackages, getServicePackages] = useFetch(fetchService, {}, false);
    const [serviceVehicles, getServiceVehicles] = useFetch(fetchServiceVehicleList, {}, false);
    const [paramsIds, setParamsIds] = useState({category: '', service: '', service_package: ''})

    useEffect(() => {
        if(toggle === true && vehicleParentsIds?.service_category) {
            getServices({category: vehicleParentsIds?.service_category})
            getServiceVehicles({service: vehicleParentsIds?.service});
            getServicePackages({_id: vehicleParentsIds?.service})
            if(!!vehicleParentsIds?.service_package) {
                getServiceVehicles({service_package: vehicleParentsIds?.service_package});
            }
        }
    },[toggle])

    return (
        <div className="">
            <Row>
                <Col md={6}>
                    <FormSelect
                        name={'category'}
                        label={i18n.t('Select Service Category')}
                        placeholder={i18n.t('Select your service category')}
                        required
                        options={categories?.docs}
                        onSelect={(e) => {
                            setParamsIds(pre => pre = {...paramsIds, category: e})
                            setVehicleParentsIds(pre => pre = {...vehicleParentsIds, service_category: e})
                            getServices({
                                category: e,
                            })
                        }}
                    />
                </Col>
                <Col md={6}>
                    <FormSelect
                        name={'service'}
                        label={i18n.t('Select Service')}
                        placeholder={i18n.t('Select your service')}
                        required
                        options={services?.docs}
                        onSelect={e => {
                            setParamsIds(pre => pre = {...paramsIds, service: e})
                            getServiceVehicles({service: e});
                            getServicePackages({_id: e})
                            setVehicleParentsIds(pre => pre = {...vehicleParentsIds, service: e})
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <FormSelect
                        name={'service_package'}
                        label={i18n.t('Select Service Package')}
                        placeholder={i18n.t('Select services package')}
                        options={servicePackages?.service_packages?.map(d => ({label: `${d?.name} - ${d?.description}`, value: d?._id}))}
                        onSelect={e => {
                            setParamsIds(pre => pre = {...paramsIds, service_package: e})
                            getServiceVehicles({service_package: e});
                            setVehicleParentsIds(pre => pre = {...vehicleParentsIds, service_package: e})
                        }}
                        clearable
                    />
                </Col>
                <Col md={6}>
                    <FormSelect
                        name={'service_vehicle'}
                        label={i18n.t('Select Service Vehicle')}
                        placeholder={i18n.t('Select your service vehicle')}
                        required
                        options={serviceVehicles?.docs?.map(d => ({
                            label: `${d?.name} - ${d?.vehicle_model}`,
                            value: d?._id
                        }))}
                        onSelect={e => {
                            getServiceVehicle({
                                _id: e
                            })
                            setVehicleParentsIds(pre => pre = {...vehicleParentsIds, service_vehicle: e})
                        }}
                    />
                </Col>
            </Row>

        </div>
    );
};
export default VehicleFiltering;