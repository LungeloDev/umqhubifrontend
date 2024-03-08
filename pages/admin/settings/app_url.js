import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Tabs, Switch } from 'antd';
const { Option } = Select;
import { DotLoader } from "react-spinners";
import Button from '../../../components/common/button';
import { useAction, useFetch } from '../../../helpers/hooks';
import { fetchSettings, postSettings } from '../../../helpers/backend_helper';
import { HiddenFormItem } from '../../../components/form/input';
import AdminLayout from "../../../layouts/admin";
import { useI18n } from '../../../contexts/i18n';


const AppUrl = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
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
            form1.resetFields();
            form1.setFieldsValue({
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
            <div className='p-3 bg-white rounded p-4'>
                <Form
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout='vertical'
                >
                    <p className="text-[16px] mb-6 border-b-[1px] border-b-[#21ec5e]">{!!i18n && i18n?.t("Application Url")}</p>

                    <HiddenFormItem name="_id" />

                    <Form.Item
                        name={["app_link", 'android']}
                        label='Play Store Link'
                    >
                        <Input placeholder='Please input play store link' />
                    </Form.Item>
                    <Form.Item
                        name={["app_link", 'ios']}
                        label='App Store Link'
                    >
                        <Input placeholder='App Store Link!' />
                    </Form.Item>


                    <div className='relative'>
                        <Form.Item>
                            <Button className='mt-4'>
                                Submit
                            </Button>
                        </Form.Item>

                        {loadingSpinner == true && <div className="flex justify-center absolute top-0 left-[40%]">
                            <div>
                                <DotLoader color="purple" size={20} className='ml-5' />
                                <p className='text-purple-700 font-semibold text-[14px]'>Please Wait...</p>
                            </div>
                        </div>}
                    </div>
                </Form>
            </div>

            <div className='p-3 bg-white rounded p-4 mt-4'>
                <Form
                    form={form1}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout='vertical'
                >
                    <p className="text-[16px] mb-6 border-b-[1px] border-b-[#21ec5e]">{!!i18n && i18n?.t("Site Url")}</p>

                    <HiddenFormItem name="_id" />

                    {/*website*/}
                    <Form.Item
                        name={["url", 'website']}
                        label='Website Link'
                    >
                        <Input placeholder='Enter website link' />
                    </Form.Item>
                    {/*login*/}
                    <Form.Item
                        name={["url", 'login']}
                        label='Log-In Link'
                    >
                        <Input placeholder='Enter login link!' />
                    </Form.Item>
                    {/*signup*/}
                    <Form.Item
                        name={["url", 'signup']}
                        label='Sign-Up Link'
                    >
                        <Input placeholder='Enter signup link!' />
                    </Form.Item>
                    {/*socket*/}
                    <Form.Item
                        name={["url", 'socket_url']}
                        label='Socket Link'
                    >
                        <Input placeholder='Enter socket link...' />
                    </Form.Item>


                    <div className='relative'>
                        <Form.Item>
                            <Button className='mt-4'>
                                Submit
                            </Button>
                        </Form.Item>

                        {loadingSpinner == true && <div className="flex justify-center absolute top-0 left-[40%]">
                            <div>
                                <DotLoader color="purple" size={20} className='ml-5' />
                                <p className='text-purple-700 font-semibold text-[14px]'>Please Wait...</p>
                            </div>
                        </div>}
                    </div>

                </Form>
            </div>
        </div>);
};


AppUrl.layout = AdminLayout
export default AppUrl;