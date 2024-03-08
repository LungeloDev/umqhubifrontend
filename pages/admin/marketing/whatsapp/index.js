import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Col, Row} from "react-bootstrap";
import React, {useState} from "react";
import {useI18n} from "../../../../contexts/i18n";
import SendWhatsappSms from "./send_whatsapp_sms";
import AllWhatsappMessages from "./all_whatsapp_messages";
import DeliveredWhatsappMessages from "./delivered_whatsapp_messages";
import FailedWhatsappMessages from "./failed_whatsapp_messages";
import PendingWhatsappMessages from "./pending_whatsapp_messages";
import ScheduledWhatsappMessages from "./schedule_whatsapp_messages";

const Index = () => {
    const i18n = useI18n()
    const [active, setActive] = useState(0)
    const options = [
        {
            label: 'Send Whatsapp Messages',
            field: <SendWhatsappSms/>
        },
        {
            label: 'All Whatsapp Messages',
            field: <AllWhatsappMessages/>
        },
        {
            label: 'Pending Whatsapp Messages',
            field: <PendingWhatsappMessages/>
        },
        {
            label: 'Delivered Whatsapp Messages',
            field: <DeliveredWhatsappMessages/>
        },
        {
            label: 'Schedule Whatsapp Messages',
            field: <ScheduledWhatsappMessages/>
        },
        {
            label: 'Failed Whatsapp Messages',
            field: <FailedWhatsappMessages/>
        },
    ]
    return (
        <>
            <PageTitle
                title="Whatsapp Options"
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
                                role="button"
                                key={index}
                            >
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
