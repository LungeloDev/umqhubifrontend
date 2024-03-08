import React, {useEffect, useState} from 'react';
import {Form, Select} from "antd";
import {
    createServicePrice, fetchOneServicePrice,
    fetchService,
    fetchServiceCategories,
    fetchServiceList,
    fetchServiceVehicleList,
} from '../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../helpers/hooks';
import {Col, Row} from "react-bootstrap";
import FormSelect from "../../form/select";
import {useI18n} from "../../../contexts/i18n";

const {Option} = Select;


const FairPrice = ({getServicePrice}) => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    const [categories, getCategories] = useFetch(fetchServiceCategories);
    const [services, getServices] = useFetch(fetchServiceList, {}, false);
    const [servicePackages, getServicePackages] = useFetch(fetchService, {}, false);
    const [serviceVehicles, getServiceVehicles] = useFetch(fetchServiceVehicleList, {}, false);
    const [paramsIds, setParamsIds] = useState({category: '', service: '', service_package: ''})

    return (
        <div className="pb-4">
            <Form
                form={form}
                layout="vertical"
                onFinish={values => {
                    return useAction(createServicePrice, values, () => {
                        getServicePrice()
                        setRefresh(true)
                    })
                }}
                className={'pr-3'}
            >
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
                            options={servicePackages?.service_packages}
                            onSelect={e => {
                                setParamsIds(pre => pre = {...paramsIds, service_package: e})
                                getServiceVehicles({service_package: e});
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
                                getServicePrice({
                                    ...paramsIds,
                                    service_vehicle: e
                                })
                            }}
                        />
                    </Col>
                </Row>
            </Form>
        </div>
    );
};
export default FairPrice;