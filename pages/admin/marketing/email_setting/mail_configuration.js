import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import { Tabs} from "antd";
import React from "react";
import {useI18n} from "../../../../contexts/i18n";
import SendGridManageEmail from "./email/sendGrid";
import GmailProvider from "./email/gmailProvider";
import OtherProviderManageEmail from "./email/otherEmailProvider";

const EmailSettings = () => {
    const i18n = useI18n()
    return (
        <>
            <PageTitle title={i18n.t('Email Settings')}/>
            <div className={'bg-white p-4 rounded'}>
                <Tabs defaultActiveKey="1" centered type="card">
                     SendGrid
                    <Tabs.TabPane tab="SendGrid SMTP" key="1">
                        <SendGridManageEmail />
                    </Tabs.TabPane>

                     Other's Provider
                    <Tabs.TabPane tab="Gmail Provider" key="2">
                        <GmailProvider/>
                    </Tabs.TabPane>
                     Other's Provider
                    <Tabs.TabPane tab=" Other's Provider" key="3">
                        <OtherProviderManageEmail/>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </>
    )
}

EmailSettings.layout = AdminLayout
export default EmailSettings
