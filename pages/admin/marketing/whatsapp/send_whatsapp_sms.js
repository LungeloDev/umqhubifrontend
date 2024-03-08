import React, {useState} from 'react';
import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Row, Form, Col} from "antd";
import FormSelect from "../../../../components/form/select";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {fetchMarketingGroups, postWhatsappMessage} from "../../../../helpers/backend_helper";
import FormInput from "../../../../components/form/input";
import FormRadio from "../../../../components/form/radio";
import FormDatePicker from "../../../../components/form/date_picker";
import moment from "moment";
import FormInputWithImoje from "../../../../components/form/input_imoje";
import PhoneNumberInput from '../../../../components/form/PhoneInput';
import FormCheckbox from "../../../../components/form/cheakbox";


const SendWhatsappSms = () => {
    const [form] = Form.useForm();
    const [time, setTime] = useState(0)
    const [smsGroups, getSMSGroups] = useFetch(fetchMarketingGroups, {type: 'whatsapp_sms',status: true});
    const onFinish = async (values) => {
        await useAction(postWhatsappMessage, values, () => getSMSGroups({type: 'whatsapp_sms'}))
    }
    return (
        <div>
            <PageTitle title="Send Whatsapp Messages" />
            <div className={'p-4 rounded bg-white'}>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Row gutter={20}>
                        <Col span={8}>
                            <PhoneNumberInput
                                name="individual_number"
                                label="To : Individual's Number"
                                placeholder={'+8801XXXXXXXXX'}
                            />
                        </Col>
                        <Col span={8}>
                            <FormSelect
                                name="to"
                                label="To : select Group"
                                options={smsGroups?.map(group => ({
                                    value: group._id, label: group.name
                                }))}
                            />
                        </Col>
                        <Col span={2} className={'flex flex-col justify-center'}>
                            <FormCheckbox
                                label={'User'}
                                name={'user'}
                            />
                        </Col>
                        <Col span={2} className={'flex flex-col justify-center'}>
                            <FormCheckbox
                                label={'Driver'}
                                name={'driver'}
                            />
                        </Col>
                        <Col span={2} className={'flex flex-col justify-center'}>
                            <FormCheckbox
                                label={'Employee'}
                                name={'employee'}
                            />
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={18}>
                            <FormInputWithImoje
                                name="content"
                                placeholder={'Start Writing your message from here...'}
                                label={'Body'}
                            />
                        </Col>
                    </Row>

                    <FormRadio
                        required
                        onChange={(v) => setTime(v)}
                        name={'delivery_time'}
                        options={[
                            {
                                value: "send_now",
                                text: "Send Now"
                            },
                            {
                                value: "scheduled",
                                text: "Scheduled for Later"
                            }
                        ]}
                    />
                    {time === "scheduled" && <FormDatePicker name={'scheduled_date'} lavel={'Select Scheduled Date'} />}
                    <button className={'px-3 py-2 rounded bg-main '}>Send</button>
                </Form>
            </div>
        </div>);
};

SendWhatsappSms.layout = AdminLayout;
export default SendWhatsappSms;
