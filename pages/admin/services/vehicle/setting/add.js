import React, {useEffect, useState} from 'react';
import {Form, Input, message, Select} from 'antd';
import {
    fetchServiceList,
    fetchVehicleSetting,
    postVehicleSetting
} from '../../../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../../../helpers/hooks';
import {useRouter} from 'next/router';
import AdminLayout from "../../../../../layouts/admin";
import {DotLoader} from "react-spinners";
import {Col, Row} from "react-bootstrap";
import FormInput, {HiddenFormItem} from "../../../../../components/form/input";
import Card from "../../../../../components/common/card";
import Button from "../../../../../components/common/button";
import {FiTrash} from "react-icons/fi";
import FormSelect from "../../../../../components/form/select";
import {useI18n} from '../../../../../contexts/i18n';

const {Option} = Select;


const AddNewVehicleSetting = ({form, c_title = false}) => {
    const i18n = useI18n()
    const {push, query} = useRouter();
    const [loadingSpinner, setLoadSpinner] = useState(false);
    const [services, getServices] = useFetch(fetchServiceList);
    const [vehicleSetting, getVehicleSetting] = useFetch(fetchVehicleSetting, {}, false);

    useEffect(() => {
        if (query?._id) {
            getVehicleSetting({_id: query?._id})
        }
    }, [query?._id])


    // form submit function
    const onFinish = (values) => {
        values.name = values.name.split(' ').join('_').toLowerCase();
        return useAction(postVehicleSetting, values, async () => {
            message.success('Service added successfully')
            await push('/admin/services/vehicle/setting');
        })
    };


    return (
        <div>
            <Card className={'shadow-sm'}>
                <h1 className={'text-gray-600 text-[16px] font-semibold tracking-wider'}>
                    {
                        c_title ? "Update Brand and Models" : "Add New Brand and Models"
                    }
                </h1>
            </Card>

            <section className='bg-white min-h-screen rounded-md p-2'>
                <div className='card_container'>
                    {/* services information collection form */}
                    <div className='vehicle_form md:w-2/3 mx-auto mt-5'>
                        <Form
                            form={form}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            layout='vertical'
                        >
                            <HiddenFormItem name={'_id'} />
                            <Row>
                                <Col md={4}>
                                    <FormSelect name='service' placeholder={!!i18n.t ? i18n.t("Select service") : "Select service"} label={'Select Service'}
                                        initialValue={[]}
                                        options={services?.docs}
                                    />
                                </Col>
                                <Col md={4}>
                                    <FormInput name='name' placeholder={!!i18n.t ? i18n.t("Brand name") : "Brand name"} label='Brand Name' required />
                                </Col>
                            </Row>

                            <h1 className={'my-3 font-semibold text-gray-500'}>Input Models</h1>

                            <Form.List name="models">
                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map(({key, name}) => (
                                            <Row key={key} className="mb-2">
                                                <Col xs={6}>
                                                    <FormInput name={[name, 'name']} placeholder="Model name" required />
                                                </Col>
                                                <Col xs={2}>
                                                    <FiTrash onClick={() => remove(name)} className="mt-2.5 text-danger"
                                                        role="button" size={18} />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Button className="transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg" type="button" onClick={() => add()}>Add Model</Button>
                                    </>
                                )}
                            </Form.List>
                            <div className={'flex items-center gap-5 mt-5'}>
                                <Button className={'bg-twSecondary-shade800 text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'}>Submit</Button>
                                {
                                    loadingSpinner === true &&
                                    <div>
                                        <DotLoader color="purple" size={20} className='ml-5' />
                                        <p className='text-purple-700 font-semibold text-[14px]'>Please Wait...</p>
                                    </div>
                                }
                            </div>
                        </Form>
                    </div>
                </div>
            </section>
        </div>
    );
};
AddNewVehicleSetting.layout = AdminLayout
export default AddNewVehicleSetting;