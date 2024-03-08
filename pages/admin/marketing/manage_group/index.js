import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Form} from "antd";
import {Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useI18n} from "../../../../contexts/i18n";
import {useFetch} from "../../../../helpers/hooks";
import {fetchSettings} from "../../../../helpers/backend_helper";
import UserEmail from "./email_group";
import UserSMS from "./sms_group";
import UserWhatsappSMS from "./whatsapp_sms_group";

const Index = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [settings] = useFetch(fetchSettings)
    const [logo,setLogo] = useState('/img/shops.png')
    const [active, setActive] = useState(0)

    useEffect(() => {
        if (settings) {
            form.setFieldsValue({
                ...settings,
                logo: undefined,
            })
            setLogo(settings?.logo || '/img/shops.png')
        }
    }, [settings])


    const options = [
        {
            label: 'User Sms Groups',
            field: <UserSMS/>
        },
        {
            label: 'User Whatsapp Groups',
            field: <UserWhatsappSMS/>
        },
        {
            label: 'User Email Groups',
            field: <UserEmail/>
        }
    ]
    return (
        <>
            <PageTitle
                title="Manage Group"
                breadcrumbs={[
                    {label: 'Dashboard', href: '/admin'},
                    {label: 'Settings'}
                ]}
            />
            <Row>
                <Col md={3}>
                    <div className="bg-white rounded overflow-hidden shadow-sm">
                        {options?.map((option, index) => (
                            <div
                                onClick={() => setActive(index)}
                                className={`px-4 py-2 text-sm ${active === index ? 'bg-main text-white' : ''}`}
                                role="button" key={index}>
                                {i18n.t(option.label)}
                            </div>
                        ))}
                    </div>
                </Col>
                <Col md={9}>
                    {options[active]?.field}
                </Col>
            </Row>
        </>
    )
}

Index.layout = AdminLayout
export default Index
