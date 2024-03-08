import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Form} from "antd";
import {Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Button from "../../../../components/common/button";
import {useI18n} from "../../../../contexts/i18n";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {
    fetchMarketingSettings, postMarketingSettings,
} from "../../../../helpers/backend_helper";
import TextEditor from "../../../../components/form/editor";

const SmsApiGateway = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [settings, getSettings] = useFetch(fetchMarketingSettings)
    const [key, setKey] = useState(0)

    useEffect(() => {
        form.resetFields();
        setKey(key + 1)
    }, [settings])

    return (
        <>
            <PageTitle title={i18n.t('Email Templates')}/>
            <div className={'bg-white p-4 rounded'}>

                <Form layout="vertical" form={form} onFinish={async (values) => {
                    const payload = {
                        email_template: [values.one, values.two],
                        type: 'string'
                    }
                    return useAction(postMarketingSettings, payload, () => {
                        getSettings()
                    })
                }}>
                    <Row>
                        <Form.Item
                            label="First Template"
                            name={"one"}
                            placeholder={'Enter Template'}
                            initialValue={settings?.email_template[0]}
                        >
                            <TextEditor key={key}/>
                        </Form.Item>
                        <Form.Item
                            label="Second Template"
                            name={"two"}
                            placeholder={'Enter Template'}
                            initialValue={settings?.email_template[1]}
                        >
                            <TextEditor key={key + 1}/>
                        </Form.Item>
                    </Row>
                    <Button>Submit</Button>
                </Form>
            </div>
        </>
    )
}

SmsApiGateway.layout = AdminLayout
export default SmsApiGateway
