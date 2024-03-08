import {Form, Input, Select, Switch, Tabs} from 'antd';
const {Option} = Select;
import React, {useState, useEffect} from 'react';
import {DotLoader} from "react-spinners";
import {Col, Row} from 'react-bootstrap';
import Button from "../../../../../components/common/button";
import {useFetch,useAction} from "../../../../../helpers/hooks";
import {HiddenFormItem} from "../../../../../components/form/input";
import {fetchMarketingSettings, postMarketingSettings} from '../../../../../helpers/backend_helper';

const OtherProviderManageEmail = () => {
    const [form] = Form.useForm();
    const [loadingSpinner, setLoadSpinner] = useState(false);
    const [checkedValue, setCheckedValue] = useState(false);
    const [settings, getSettings] = useFetch(fetchMarketingSettings)

    // form data loading, if exist
    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
            form.setFieldsValue({
                ...settings
            })

            if (form.getFieldsValue()?.email?.default === 'other') {
                setCheckedValue(true)
            }
        }
    }, [settings])

    // submit data
    const onFinish = async (values) => {
        return useAction(postMarketingSettings, values, () => {
            getSettings();
        })
    };

    return (
        <div>
            <Form
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                layout='vertical'
            >
                {/* Auth email Information */}
                <div className='p-3'>
                    <p className="text-[16px] mb-6 border-b-[1px] border-b-[#21ec5e]"> Other Email Provider</p>

                    <HiddenFormItem name="_id"/>

                    <Form.Item
                        name={['email', 'other', 'host']}
                        label='Email Host Address'
                        rules={[
                            {
                                required: true,
                                message: 'Please input host email!',
                            },
                        ]}
                        extra='For Hostinger: smtp.hostinger.in'
                    >
                        <Input placeholder='Enter host address'/>
                    </Form.Item>

                    <Row>
                        <Col md={6}>
                            {/* Email Port section */}
                            <Form.Item
                                name={['email', 'other', 'port']}
                                label='Email Port Number'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input email port!',
                                    },
                                ]}
                                extra='For Hostinger: 587'
                            >
                                <Input placeholder='Enter port number'/>
                            </Form.Item>
                        </Col>
                        <Col md={6}>
                            {/* Auth email section */}
                            <Form.Item
                                name={['email', 'other', 'address']}
                                label='Email Address'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input email!',
                                    },
                                ]}
                            >
                                <Input placeholder='Please input email address'/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Item
                                name={['email', 'other', 'password']}
                                label='Email Password'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input Email Password!',
                                    },
                                ]}
                            >
                                <Input placeholder='Please input email password' type='password'/>
                            </Form.Item>
                        </Col>
                        <Col md={6}>
                            {/* Auth Service Provider section */}
                            <Form.Item
                                name={['email', 'other', 'provider_name']}
                                label='Service Provider'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required!',
                                    },
                                ]}
                            >
                                <Select placeholder="Please Select a Provider">
                                    <Option value='hostinger'>Hostinger</Option>
                                    <Option value='other'>Other Provider</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Form.Item
                            name={["email", 'default']}
                            label='Make Default'
                            valuePropName="gmail">
                            <Switch defaultChecked={checkedValue}/>
                        </Form.Item>
                    </Row>

                    <div className='relative'>
                        <Form.Item>
                            <Button className='mt-4'>
                                Submit
                            </Button>
                        </Form.Item>

                        {
                            loadingSpinner == true &&
                            <div className="flex justify-center absolute top-0 left-[40%]">
                                <div>
                                    <DotLoader color="purple" size={20} className='ml-5'/>
                                    <p className='text-purple-700 font-semibold text-[14px]'>Please Wait...</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default OtherProviderManageEmail;