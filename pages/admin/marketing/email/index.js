import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Col, Row} from "react-bootstrap";
import React, {useState} from "react";
import {useI18n} from "../../../../contexts/i18n";
import SendEmail from "./send_email";
import DeliveredSMS from "./delivered_emails";
import AllEmail from "./all_email";
import PendingEmails from "./pending_email";
import FailedEmails from "./failed_emails";
import ScheduledEmails from "./schedule_emails";

const Index = () => {
    const i18n = useI18n()
    const [active, setActive] = useState(0)
    const options = [
        {
            label: 'Send Email',
            field: <SendEmail/>
        },
        {
            label: 'All Email',
            field: <AllEmail/>
        },
        {
            label: 'Pending Email',
            field: <PendingEmails/>
        },
        {
            label: 'Delivered Email',
            field: <DeliveredSMS/>
        },
        {
            label: 'Schedule Email',
            field: <ScheduledEmails/>
        },
        {
            label: 'Failed Email',
            field: <FailedEmails/>
        },

    ]
    return (
        <>
            <PageTitle title="Email Options" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]}/>
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
