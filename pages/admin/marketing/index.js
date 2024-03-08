import {
    fetchAllMails,
    fetchAllMarketingUsers,
    fetchAllSMS, fetchAllWhatsappMessage,
    fetchMarketingGroups, fetchMarketingSubscribers,
    fetchSettings
} from "../../../helpers/backend_helper";
import {useI18n} from "../../../contexts/i18n";
import {Col, Row} from "antd";
import {useFetch} from "../../../helpers/hooks";
import PageTitle from "../../../components/common/page-title";
import AdminLayout from "../../../layouts/admin";
import {
    FcAlarmClock, FcApproval, FcBookmark, FcButtingIn,
    FcClock, FcCollaboration,
    FcContacts, FcDataBackup,
    FcDownRight,
    FcExpired,
    FcFeedback,
    FcInvite,
    FcLeave, FcMoneyTransfer, FcPortraitMode,
    FcSms, FcVoicePresentation
} from "react-icons/fc";
import {AiOutlineWhatsApp} from "react-icons/ai";

const Card = ({title, count, color, img}) => {
    return (
        <div className={`shadow my-2 p-4 rounded bg-white`}>
            <Row gutter={6}>
                <Col span={9} className={'flex justify-center items-center'}>{img}</Col>
                <Col span={15}>
                    <h3 className={`text-sm md:text-lg font-semibold`}>{title}</h3>
                    <h1 className={`text-${color}-500 text-4xl font-bold`}>{count}</h1>
                </Col>
            </Row>
        </div>
    )
}

const Index = () => {
    const i18n = useI18n()
    const [allSms] = useFetch(fetchAllSMS,{size:2**54});
    const [allSuccessSms] = useFetch(fetchAllSMS, {status: 'success',size:2**54});
    const [allFailedSms] = useFetch(fetchAllSMS, {status: 'failed',size:2**54});
    const [scheduledSms] = useFetch(fetchAllSMS, {status: 'scheduled',size:2**54});

    const [allWhatsapp] = useFetch(fetchAllWhatsappMessage,{size:2**54});
    const [allSuccessWhatsapp] = useFetch(fetchAllWhatsappMessage, {status: 'success',size:2**54});
    const [allFailedWhatsapp] = useFetch(fetchAllWhatsappMessage, {status: 'failed',size:2**54});
    const [scheduledWhatsapp] = useFetch(fetchAllWhatsappMessage, {status: 'scheduled',size:2**54});


    const [allMail] = useFetch(fetchAllMails,{size:2**54} );
    const [allSuccessMails] = useFetch(fetchAllMails, {status: 'success',size:2**54});
    const [allFailedMails] = useFetch(fetchAllMails, {status: 'failed',size:2**54});
    const [scheduledMails] = useFetch(fetchAllMails, {status: 'scheduled',size:2**54});
    const [emailGroups] = useFetch(fetchMarketingGroups, {type: 'email',size:2**54});
    const [smsGroups] = useFetch(fetchMarketingGroups, {type: 'sms',size:2**54});

    const [banUsers] = useFetch(fetchAllMarketingUsers, {marketing_status: 'banned',size:2**54})
    const [subscribedUsers] = useFetch(fetchMarketingSubscribers, {marketing_status: 'all',size:2**54});

    return (
        <>
            <PageTitle title={i18n.t("Dashboard")}/>
            {/*SMS portion*/}
            <Row gutter={16} className={'bg-white rounded p-4'}>
                <Col span={24} className={'py-2 font-bold text-2xl'}>{i18n.t("SMS Details")}</Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Total SMS')} count={allSms?.docs?.length} color='green'
                                          img={<FcSms className={'h-16 w-16'}/>}/> </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Total Success SMS')} count={allSuccessSms?.docs?.length}
                                          color='red'
                                          img={<FcDownRight className={' h-16 w-16'}/>}/> </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Total Failed SMS')} count={allFailedSms?.docs?.length}
                                          color='red'
                                          img={<FcExpired className={' h-16 w-16'}/>}/> </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Scheduled SMS')} count={scheduledSms?.docs?.length}
                                          color='green'
                                          img={<FcAlarmClock className={' h-16 w-16'}/>}/> </Col>
            </Row>

            {/*Whatsapp portion*/}
            <Row gutter={16} className={'bg-white rounded p-4'}>
                <Col span={24} className={'py-2 font-bold text-2xl'}>{i18n.t("Whatsapp Details")}</Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Total Whatsapp')} count={allWhatsapp?.docs?.length} color='green'
                                          img={<AiOutlineWhatsApp className={'h-16 w-16'}/>}/> </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Total Success Whatsapp')} count={allSuccessWhatsapp?.docs?.length}
                                          color='red'
                                          img={<FcApproval className={' h-16 w-16'}/>}/> </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Total Failed Whatsapp')} count={allFailedWhatsapp?.docs?.length}
                                          color='red'
                                          img={<FcBookmark className={' h-16 w-16'}/>}/> </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Scheduled Whatsapp')} count={scheduledWhatsapp?.docs?.length}
                                          color='green'
                                          img={<FcDataBackup className={' h-16 w-16'}/>}/> </Col>
            </Row>

            {/*Email portion*/}
            <Row gutter={16} className={'bg-white rounded p-4 my-4'}>
                <Col span={24} className={'py-2 font-bold text-2xl'}>{i18n.t('Email Details')}</Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Total Email')} count={allMail?.docs?.length} color='green'
                                          img={<FcInvite className={'h-16 w-16'}/>}/> </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Total Success Email')} count={allSuccessMails?.docs?.length}
                                          color='green'
                                          img={<FcFeedback className={' h-16 w-16'}/>}/> </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Total Failed Email')} count={allFailedMails?.docs?.length}
                                          color='red'
                                          img={<FcLeave className={' h-16 w-16'}/>}/> </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Scheduled Email')} count={scheduledMails?.docs?.length}
                                          color='green'
                                          img={<FcClock className={' h-16 w-16'}/>}/> </Col>
            </Row>

            {/*Marketing Groups*/}
            <Row gutter={16} className={'bg-white rounded p-4 my-4'}>
                <Col span={24} className={'py-2 font-bold text-2xl'}>{i18n.t('Users Details')} </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Email Groups')} count={emailGroups?.length} color='blue'
                                          img={<FcContacts className={'h-16 w-16'}/>}/> </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('SMS Groups')} count={smsGroups?.length} color='red'
                                          img={<FcVoicePresentation className={' h-16 w-16'}/>}/> </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Banned Users')} count={banUsers?.docs?.length} color='red'
                                          img={<FcButtingIn className={' h-16 w-16'}/>}/> </Col>
                <Col xs={24} md={12} xl={8} xxl={6}><Card title={i18n.t('Subscribed Users')} count={subscribedUsers?.docs?.length}
                                          color='green'
                                          img={<FcMoneyTransfer className={' h-16 w-16'}/>}/> </Col>
            </Row>
        </>
    )
}

Index.layout = AdminLayout
export default Index
