import {Button, Form, InputNumber, Space} from 'antd';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../../layouts/admin";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {
    createServicePrice, fetchServicePrice,
} from "../../../../helpers/backend_helper";
import {Col, Row} from "react-bootstrap";
import FormSelect from "../../../../components/form/select";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import {MinusCircleOutlined} from "@ant-design/icons";
import {useI18n} from "../../../../contexts/i18n";
import currencies from 'currency-codes';
import Card from "../../../../components/common/card";


const EditServiceFare = () => {
    const [form] = Form.useForm();
    const {query} = useRouter();
    const i18n = useI18n()
    const router = useRouter();
    const currency = currencies.codes() ?? [];
    const [fare, getFare, {error, loading}] = useFetch(fetchServicePrice);

    useEffect(() => {
        if (query?._id) {
            getFare({_id: query?._id})
        }
    }, [query?._id])

    useEffect(() => {
        if (fare?._id) {
            form.resetFields();
            form.setFieldsValue({
                ...fare,
            })
        }
    }, [fare?._id])

    const onFinish = (values) => {
        return useAction(createServicePrice, values, () => {
            setTimeout(async () => {
                await router.push('/admin/services/fare-management')
            }, 3000);
        })
    };

    return (
        <div>
            <Card>
                <div className={'text-center space-y-2 font-semibold'}>
                    <h1 className={'capitalize text-slate-600'}>Category : {fare?.category?.name}</h1>
                    <h1 className={'capitalize text-slate-600'}>Service Name : {fare?.service?.name}</h1>
                    <h1 className={'text-slate-600'}>Vehicle Name: {fare?.service_vehicle?.name} - {fare?.service_vehicle?.model}</h1>
                    <h1 className={'capitalize text-slate-600'}>Service Package : {fare?.service_package?.name}</h1>
                </div>
            </Card>
            <Card className={'shadow-sm'}>
                <div className='w-full h-auto text-gray-500 text-base pb-2 p-5 border border-main rounded-md'>
                    <div className=''>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{remember: true}}
                        >
                            <HiddenFormItem name={"_id"} />
                            <Row>
                                <Col md={6}>
                                    <FormSelect
                                        name={'currency'}
                                        label={i18n.t('Select Currency')}
                                        placeholder={i18n.t('Select currency')}
                                        required
                                        options={currency?.map(crr => ({label: crr, value: crr}))}
                                        search
                                    />
                                </Col>
                                <Col md={6}>
                                    <Form.Item
                                        label={i18n.t('Minimum Fair')}
                                        name="minimum_fair"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input minimum fair!",
                                            },
                                        ]}
                                        style={{border: '0'}}
                                    >
                                        <InputNumber style={{width: "100%"}}
                                                     placeholder={i18n.t('Please enter minimum fair')}
                                                     className={'form-control p-1'}/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Item
                                        label={i18n.t('Base fair')}
                                        name="base_fair"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input base fair!",
                                            },
                                        ]}
                                        style={{border: '0'}}
                                    >
                                        <InputNumber style={{width: "100%"}}
                                                     placeholder={i18n.t('Please input base fair')}
                                                     className={'form-control p-1'}/>
                                    </Form.Item>
                                </Col>
                                <Col md={6}>
                                    <Form.Item
                                        label={i18n.t('Per kilo charge')}
                                        name="per_kilo_charge"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input per kilo charge!",
                                            },
                                        ]}
                                        style={{border: '0'}}
                                    >
                                        <InputNumber style={{width: "100%"}}
                                                     placeholder={i18n.t('Please input service charges')}
                                                     className={'form-control p-1'}/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Item
                                        label={i18n.t('Per Minute Waiting Charge')}
                                        name="waiting_charge"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input waiting charge!",
                                            },
                                        ]}
                                        style={{border: '0'}}
                                    >
                                        <InputNumber style={{width: "100%"}}
                                                     placeholder={i18n.t('Please input waiting charge')}
                                                     className={'form-control p-1'}/>
                                    </Form.Item>
                                </Col>
                                <Col md={6}>
                                    <Form.Item
                                        label={i18n.t('Cancellation Fee')}
                                        name="cancellation_fee"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input cancellation fee!",
                                            },
                                        ]}
                                        style={{border: '0'}}
                                    >
                                        <InputNumber style={{width: "100%"}}
                                                     placeholder={i18n.t('Please input cancellation fee')}
                                                     className={'form-control p-1'}/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <FormSelect
                                        name={'commission_type'}
                                        label={i18n.t('Company Commission Type')}
                                        placeholder={i18n.t('Select commission type')}
                                        required
                                        options={[
                                            {label: 'Fixed Amount', value: 'fixed_amount'},
                                            {label: 'Percentage', value: 'percentage'},
                                        ]}
                                    />
                                </Col>
                                <Col md={6}>
                                    <Form.Item
                                        label={i18n.t('Company Commission')}
                                        name="company_commission"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input company commission!",
                                            },
                                        ]}
                                        style={{border: '0'}}
                                    >
                                        <InputNumber style={{width: "100%"}}
                                                     placeholder={i18n.t('Please input company commission')}
                                                     className={'form-control p-1'}/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className={'mt-3'}>
                                <h1 className={'text-[15px] mb-2'}>Additional Fees</h1>
                            </div>
                            {/* tax name and percentage */}
                            <Form.List name="additional_fees" className={''}>
                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map(({key, name, ...restField}) => (
                                            <Space key={key} className='block' align="baseline">
                                                <Row className={''}>
                                                    <Col md={5}>
                                                        <FormInput name={[name, 'additional_fee_name']}
                                                                   placeholder={i18n.t('Additional Fees Name')}/>
                                                    </Col>
                                                    <Col md={5}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'additional_fee']}

                                                        >
                                                            <InputNumber style={{width: "100%"}}
                                                                         placeholder={i18n.t('Input fees amount')}
                                                                         className={'form-control p-1'}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={2}>
                                                        <p className='text-red-500 font-bold mt-1'>
                                                            <MinusCircleOutlined
                                                                onClick={() => remove(name)}/></p>
                                                    </Col>
                                                </Row>
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block>
                                                <span className='text-green-700'> + Add Addition Fees</span>

                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <div className='flex justify-end relative'>
                                <Form.Item style={{width: '100%', marginTop: '20px'}}>
                                    <button type="submit" className='bg-amber-400 hover:bg-amber-500 w-48 mr-14 px-6 py-2 rounded font-semibold'>
                                        Update
                                    </button>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </div>
            </Card>
        </div>
    );
};
EditServiceFare.layout = AdminLayout
export default EditServiceFare;