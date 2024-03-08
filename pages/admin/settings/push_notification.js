import React, {useState, useEffect} from 'react';
import {Form, Upload} from 'antd';

import Button from '../../../components/common/button';
import {useAction, useFetch} from '../../../helpers/hooks';
import {fetchSettings, postNotificationSettingJson} from '../../../helpers/backend_helper';
import AdminLayout from "../../../layouts/admin";
import {UploadOutlined} from "@ant-design/icons";
import {useI18n} from '../../../contexts/i18n';


const AppUrl = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const [settings, getSettings] = useFetch(fetchSettings)

    const onFinish = async (values) => {
        const file = values.file.file.originFileObj;
        const reader = new FileReader();
        reader.onload = function (event) {
            const contents = event.target.result;
            return useAction(postNotificationSettingJson, {
                push_notification_json: {
                    file_name: values.file.file.name, json_value: contents
                },
            }, (res) => {
                getSettings();
            })
        };
        reader.readAsText(file);
        return useAction(postNotificationSettingJson, values, (res) => {
        })
    };


    return (<div className='pt-0'>
            <Form
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                layout='vertical'
            >
                <div className='p-3 bg-white rounded p-4'>
                    <p className="text-[16px] mb-6 border-b-[1px] border-b-[#21ec5e]">{!!i18n && i18n?.t("Application Url")}</p>

                    <Form.Item
                        name={'file'}
                        label='Chose Firebase Json File'
                    >
                        <Upload>
                            <div className={'bg-main p-2 rounded'} icon={<UploadOutlined/>}>Click to Upload</div>
                        </Upload>
                    </Form.Item>

                    <div className={'p-4 flex'}>
                        <p>File Name : '</p>  {settings?.push_notification_json?.file_name} <p>'</p>
                    </div>

                    <div className='relative'>
                        <Form.Item>
                            <Button className='mt-4'>
                                Submit
                            </Button>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </div>
    );
};


AppUrl.layout = AdminLayout
export default AppUrl;