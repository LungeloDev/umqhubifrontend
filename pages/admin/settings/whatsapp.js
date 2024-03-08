import AdminLayout from "../../../layouts/admin";
import PageTitle from "../../../components/common/page-title";
import {Form, Tabs} from "antd";
import FormInput, {HiddenFormItem} from "../../../components/form/input";
import React, {useEffect, useState} from "react";
import Button from "../../../components/common/button";
import {uploadImage} from "../../../helpers/image";
import {useI18n} from "../../../contexts/i18n";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchSettings, postSettings} from "../../../helpers/backend_helper";
import dynamic from 'next/dynamic'

const ReactIconsSelector = dynamic(() => import("../../../components/common/react-icon"), {ssr: false})

const WhatsappSettings = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [settings, getSettings] = useFetch(fetchSettings)
    const [logo, setLogo] = useState('/img/shops.png')

    useEffect(() => {
        if (settings) {
            form.setFieldsValue({
                ...settings,
                logo: undefined,
            })
            setLogo(settings?.logo || '/img/shops.png')
        }
    }, [settings])

    return (
        <>
            <PageTitle title={!!i18n && i18n?.t("Whatsapp Settings")} />
            <div className={'bg-white p-4 rounded'}>
                <Form layout="vertical" form={form} onFinish={async values => {
                    if (!!values.logo) {
                        values.logo = await uploadImage(values.logo, logo)
                    }
                    return useAction(postSettings, values, () => {
                        getSettings()
                    })

                }}>
                    <FormInput name={['whatsapp', 'token']} label="WATI Auth Token" placeholder="Your WATI Auth Token"
                               required/>
                    <FormInput name={['whatsapp', 'endpoint']} label="WATI API Endpoint"
                               placeholder="Your WATI API Endpoint"
                               required/>
                    <FormInput name={['whatsapp', 'otp_template']} label="WATI Verification Code Template Name"
                               placeholder="Your WATI Template Name" required/>
                    <FormInput name={['whatsapp', 'password_template']} label="WATI Password Template Name"
                               placeholder="Your WATI Template Name" required/>

                    <Button>Submit</Button>
                </Form>
            </div>
        </>
    )
}

WhatsappSettings.layout = AdminLayout
export default WhatsappSettings
