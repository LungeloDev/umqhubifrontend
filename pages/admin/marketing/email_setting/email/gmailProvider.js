import React, {useState, useEffect} from 'react';
import {Form, Input, Switch} from 'antd';
import {DotLoader} from "react-spinners";
import {useAction, useFetch} from '../../../../../helpers/hooks';
import {fetchMarketingSettings, fetchSettings, postMarketingSettings} from '../../../../../helpers/backend_helper';
import {HiddenFormItem} from "../../../../../components/form/input";
import Button from "../../../../../components/common/button";

const GmailProvider = () => {
    const [form] = Form.useForm();
    const [loadingSpinner, setLoadSpinner] = useState(false);
    const [checkedValue, setCheckedValue] = useState(false);
    const [settings, getSettings] = useFetch(fetchSettings)

    // form data loading, if exist
    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
            form.setFieldsValue({...settings})
            if (form.getFieldsValue()?.email?.default === 'gmail') {
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
                    <p className="text-[16px] mb-6 border-b-[1px] border-b-[#21ec5e]">Gmail Provider</p>
                    <HiddenFormItem name="_id" />
                    {/* Auth email section */}
                    <Form.Item
                        name={['email', 'gmail', 'auth_email']}
                        label='Email Address'
                        rules={[
                            {
                                required: true,
                                message: 'Please input email!',
                            },
                        ]}
                    >
                        <Input placeholder='Please input email address' />
                    </Form.Item>

                    <Form.Item
                        name={['email', 'gmail', 'password']}
                        label='Email App Password'
                        rules={[
                            {
                                required: true,
                                message: 'Please input Auth Email Password!',
                            },
                        ]}
                    >
                        <Input placeholder='Please input app password' type='password' />
                    </Form.Item>

                    {/* Auth Service Provider section */}
                    <Form.Item
                        name={['email', 'gmail', 'service_provider']}
                        label='Service Provider'
                        initialValue='gmail'
                        rules={[
                            {
                                required: true,
                                message: 'Required!',
                            },
                        ]}
                    >
                        <Input disabled defaultValue='gmail' placeholder='Please input service provider name' />
                    </Form.Item>
                    <Form.Item
                        name={["email", 'default']}
                        label='Make Default'
                        valuePropName="gmail">
                        <Switch defaultChecked={checkedValue} />
                    </Form.Item>

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
                                    <DotLoader color="purple" size={20} className='ml-5' />
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

export default GmailProvider;