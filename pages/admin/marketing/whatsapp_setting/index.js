import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Form,} from "antd";
import {Col, Row} from "react-bootstrap";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import React, {useEffect, useState} from "react";
import Button from "../../../../components/common/button";
import {uploadImage} from "../../../../helpers/image";
import {useI18n} from "../../../../contexts/i18n";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {
    fetchMarketingSettings,
    postMarketingSettings,
} from "../../../../helpers/backend_helper";
import FormSelect from "../../../../components/form/select";

const WhatsappSettings = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [settings, getSettings] = useFetch(fetchMarketingSettings)
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
            <div>
                <PageTitle title={i18n.t('Twilio Credentials for Whatsapp')}/>
                <div className={'p-4 bg-white rounded shadow'}>
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={async values => {
                            if (!!values.logo) {
                                values.logo = await uploadImage(values.logo, logo)
                            }
                            return useAction(postMarketingSettings, values, () => {
                                getSettings()
                            })
                        }}
                    >
                        <Row>
                            <HiddenFormItem name="_id"/>
                            <Col md={6}>
                                <FormInput
                                    name={['whatsapp', 'twilio_auth_token']}
                                    label="Twilio Whatsapp Auth Token"
                                    placeholder="Your Twilio Whatsapp Auth Token"
                                    required
                                />
                            </Col>
                            <Col md={6}>
                                <FormInput
                                    name={['whatsapp', 'twilio_sender_number']}
                                    label="Twilio Whatsapp  Sender Number"
                                    placeholder="Your Twilio  Whatsapp Sender number"
                                    required
                                />
                            </Col>
                            <Col md={6}>
                                <FormInput
                                    name={['whatsapp', 'twilio_account_sid']}
                                    label="Twilio Whatsapp  Account SID"
                                    placeholder="Your  Whatsapp Twilio Account SID"
                                    required
                                />
                            </Col>
                            <Col md={6}>
                                <FormSelect
                                    name={['whatsapp', 'status']} label="Status"
                                    initialValue={false}
                                    options={[{label: 'Enable', value: true}, {label: 'Disable', value: false}]}
                                    required
                                />
                            </Col>
                        </Row>
                        <Button>Submit</Button>
                    </Form>
                </div>
            </div>


        </>
    )
}

WhatsappSettings.layout = AdminLayout
export default WhatsappSettings





















