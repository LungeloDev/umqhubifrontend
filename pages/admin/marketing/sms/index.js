import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Col, Row} from "react-bootstrap";
import React, {useState} from "react";
import {useI18n} from "../../../../contexts/i18n";
import DeliveredSMS from "./delivered_sms";
import PendingSms from "./pending_sms";
import FailedSms from "./failed_sms";
import ScheduledSms from "./schedule_sms";
import SendSms from "./send_sms";
import UserSms from "./all_sms";

const Index = () => {
    const i18n = useI18n()
    const [active, setActive] = useState(0)
    const options = [
        {
            label: 'Send SMS',
            field: <SendSms />
        },
        {
            label: 'All SMS',
            field: <UserSms />
        },
        {
            label: 'Pending SMS',
            field: <PendingSms />
        },

        {
            label: 'Delivered SMS',
            field: <DeliveredSMS />
        },
        {
            label: 'Schedule SMS',
            field: <ScheduledSms />
        },
        {
            label: 'Failed SMS',
            field: <FailedSms />
        },
    ]
    return (
        <>
            <PageTitle title="SMS Options" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]} />
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
