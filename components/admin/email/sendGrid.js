import React, {useState, useEffect} from 'react';
import {Form, Input, Select, Tabs, Switch} from 'antd';

const {Option} = Select;
import {DotLoader} from "react-spinners";
import Button from '../../common/button';
import {useAction, useFetch} from '../../../helpers/hooks';
import {fetchSettings, postSettings} from '../../../helpers/backend_helper';
import {HiddenFormItem} from '../../form/input';
import {Col, Row} from 'react-bootstrap';


const SendGridManageEmail = () => {
    const [form] = Form.useForm();
    const [loadingSpinner, setLoadSpinner] = useState(false);
    const [checkedValue, setCheckedValue] = useState(false);
    const [settings, getSettings] = useFetch(fetchSettings)


    // form data loading, if exist
    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
            form.setFieldsValue({
                ...settings
            })

            if (form.getFieldsValue()?.email?.default === 'sendgrid') {
                setCheckedValue(true)
            }
        }
    }, [settings])


    // submit data
    const onFinish = async (values) => {
        return useAction(postSettings, values, () => {
            getSettings();
        })
    };


    return (
        <div className='pt-0'>
            <Form
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                layout='vertical'
            >
                <div className='p-3'>
                    <p className="text-[16px] mb-6 border-b-[1px] border-b-[#21ec5e]">SendGrid SMTP</p>

                    <HiddenFormItem name="_id"/>

                    <Form.Item
                        name={["email", 'sendgrid', 'host']}
                        label='Email Host Address / Server'
                        rules={[
                            {
                                required: true,
                                message: 'Please input host email!',
                            },
                        ]}
                    >
                        <Input placeholder='Please input host email'/>
                    </Form.Item>

                    <Row>
                        <Col md={6}>
                            {/* Email Port section */}
                            <Form.Item
                                name={["email", 'sendgrid', 'port']}
                                label='Email Port Number'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input email port!',
                                    },
                                ]}
                            >
                                <Input placeholder='Please input email port'/>
                            </Form.Item>
                        </Col>
                        <Col md={6}>
                            {/* Email Username section */}
                            <Form.Item
                                name={["email", 'sendgrid', 'username']}
                                label='Email Username'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input email username!',
                                    },
                                ]}
                            >
                                <Input placeholder='Please input email username'/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            {/* Email Password section */}
                            <Form.Item
                                name={["email", 'sendgrid', 'password']}
                                label='Email Password'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input email password!',
                                    },
                                ]}
                            >
                                <Input placeholder='Please input email password' type='password'/>
                            </Form.Item>
                        </Col>
                        <Col md={6}>
                            {/* Email Sender section */}
                            <Form.Item
                                name={["email", 'sendgrid', 'sender_email']}
                                label='Sender Email'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input email sender!',
                                    },
                                ]}
                            >
                                <Input placeholder='Please input sender email'/>
                            </Form.Item>

                        </Col>
                        <Form.Item
                            name={["email", 'default']}
                            label='Make Default'
                            valuePropName="sendgrid">
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

export default SendGridManageEmail;