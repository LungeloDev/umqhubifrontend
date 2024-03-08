import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Form, Tabs} from "antd";
import {Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useI18n} from "../../../../contexts/i18n";
import {useFetch} from "../../../../helpers/hooks";
import {fetchSettings} from "../../../../helpers/backend_helper";
import OwnEmail from "./own_email";
import OwnSMS from "./own_sms";
import UserEmail from "./user_email";
import UserSMS from "./user_sms";

const Index = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [settings] = useFetch(fetchSettings)
    const [logo,setLogo] = useState('/img/shops.png')

    useEffect(() => {
        if (settings) {
            form.setFieldsValue({
                ...settings,
                logo: undefined,
            })
            setLogo(settings?.logo || '/img/shops.png')
        }
    }, [settings])

    const [active, setActive] = useState(0)
    const options = [
        {
            label: 'Own SMS Groups',
            field: <OwnSMS/>
        },
        {
            label: 'Own Email Groups',
            field: <OwnEmail/>
        },
        {
            label: 'User Email Groups',
            field: <UserEmail/>
        },
        {
            label: 'User Email Groups',
            field: <UserSMS/>
        },

    ]
    return (
        <>
            <PageTitle
                title="Manage Contact"
                breadcrumbs={[
                    {
                        label: 'Dashboard',
                        href: '/admin'
                    },
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
