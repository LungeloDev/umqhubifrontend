import React, {useState} from 'react';
import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Row, Form, Col} from "antd";
import FormSelect from "../../../../components/form/select";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {fetchMarketingGroups, deliverSMS} from "../../../../helpers/backend_helper";
import FormInput from "../../../../components/form/input";
import FormRadio from "../../../../components/form/radio";
import FormDatePicker from "../../../../components/form/date_picker";
import moment from "moment";
import PhoneNumberInput from '../../../../components/form/PhoneInput';
import FormCheckbox from "../../../../components/form/cheakbox";

const SendSms = () => {
    const [form] = Form.useForm();
    const [time, setTime] = useState(0)
    const [smsGroups, getSMSGroups] = useFetch(fetchMarketingGroups, {type: 'sms',status: true});
    const onFinish = async (values) => {
        await useAction(deliverSMS, values, () => getSMSGroups({type: 'sms'}))
    }

    return (
        <div>
            <PageTitle title=" Send SMS" />
            <div className={'p-4 rounded bg-white'}>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <div className={'p-2 my-2 rounded bg-gray-200'}>SMS credentials are collected from settings.</div>
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
                                clearable
                                name="to"
                                label="To : Select Group"
                                options={smsGroups?.map(group => ({
                                    value: group._id,
                                    label: group.name
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
                        <Col span={3} className={'flex flex-col justify-center'}>
                            <FormCheckbox
                                label={'Employee'}
                                name={'employee'}
                            />
                        </Col>
                    </Row>
                    <FormInput
                        name="content"
                        label={'Body'}
                        required
                        type="textArea"
                        placeholder={'Start Writing your message from here...'}
                    />

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

SendSms.layout = AdminLayout;
export default SendSms;
