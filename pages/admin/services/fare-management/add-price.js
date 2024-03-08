import React, {useState} from 'react';
import {MdLocationCity} from "react-icons/md";
import {InputNumber, Form, Select, Button, Space} from 'antd';
import {useRouter} from 'next/router';
import {MinusCircleOutlined} from '@ant-design/icons';
import {ClipLoader} from 'react-spinners';
import currencies from 'currency-codes';
import Head from 'next/head';
import {useAction, useFetch} from '../../../../helpers/hooks';
import {
    createServicePrice,
    fetchService,
    fetchServiceCategories,
    fetchServiceList,
    fetchServiceVehicleList,
} from '../../../../helpers/backend_helper';
import AdminLayout from "../../../../layouts/admin";
import FormSelect from "../../../../components/form/select";
import {useI18n} from "../../../../contexts/i18n";
import {Col, Row} from "react-bootstrap";
import FormInput from "../../../../components/form/input";

const {Option} = Select;


const AddServicePricing = ({id, form, update = null}) => {
    const i18n = useI18n()
    const router = useRouter();
    const [spinnerToggle, setSpinnerToggle] = useState(false);
    const currency = currencies.codes() ?? [];
    const [categories, getCategories] = useFetch(fetchServiceCategories);
    const [services, getServices] = useFetch(fetchServiceList, {}, false);
    const [servicePackages, getServicePackages] = useFetch(fetchService, {}, false);
    const [serviceVehicles, getServiceVehicles] = useFetch(fetchServiceVehicleList, {}, false);

    // add new province form handler
    const onFinish = (values) => {
        return useAction(createServicePrice, values, () => {
            setTimeout(() => {
                router.push('/admin/services/fare-management')
            }, 3000);
        })
    };

    return (
        <div>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>Service Price</title>
                </Head>

                <div className='card_container'>
                    <div className='shadow-sm mt-2 relative rounded bg-white p-4'>
                        {/* upper style */}
                        <div className='h-12'>
                            <div
                                className='absolute w-16 h-16 shadow flex justify-center rounded -top-5 items-center bg-main'>
                                <span><MdLocationCity size={30} className='text-white'/></span>
                            </div>
                            <span className='ml-20 text-xl text-gray-500'>Add Service Price</span>
                        </div>
                        {/* add new province  */}
                        <div className='w-full h-auto text-gray-500 text-base pb-2 p-5 border border-main rounded-md'>
                            <div className=''>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    initialValues={{remember: true}}
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
                                                search
                                            />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormSelect
                                                name={'currency'}
                                                label={i18n.t('Select Currency')}
                                                placeholder={i18n.t('Select your system currency')}
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
                                            <button
                                                type="submit"
                                                className='bg-amber-400 hover:bg-amber-500 w-48 mr-14 px-6 py-2 rounded font-semibold'
                                            >
                                                Save
                                            </button>
                                        </Form.Item>
                                        {
                                            spinnerToggle === true &&
                                            <span className="absolute top-[20%] right-[20%] md:right-[30%]">
                                                <ClipLoader color="purple" size={50}/>
                                            </span>
                                        }
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
AddServicePricing.layout = AdminLayout;
export default AddServicePricing;