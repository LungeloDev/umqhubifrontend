import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Col, Row} from "react-bootstrap";
import React, {useState} from "react";
import {useI18n} from "../../../../contexts/i18n";
import MailConfiguration from "./mail_configuration";
import MailTemplates from "./mail_templates";

const Index = () => {
    const i18n = useI18n()
    const [active, setActive] = useState(0)
    const options = [
        {
            label: 'Email Configuration',
            field: <MailConfiguration/>
        }, {
            label: 'Email Templates',
            field: <MailTemplates/>
        },
    ]
    return (
        <>
            <PageTitle title="Email Setting" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]}/>
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
