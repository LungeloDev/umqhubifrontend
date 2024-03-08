import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Row, Form, Col, Radio} from "antd";
import FormSelect from "../../../../components/form/select";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {fetchMarketingGroups, deliverEmail, fetchMarketingSettings} from "../../../../helpers/backend_helper";
import FormInput from "../../../../components/form/input";
import TextEditor from "../../../../components/form/editor";
import FormRadio from "../../../../components/form/radio";
import FormDatePicker from "../../../../components/form/date_picker";
import FormCheckbox from "../../../../components/form/cheakbox";

const SendEmail = () => {
    const [form] = Form.useForm();
    const [key, setKey] = useState(0)
    const [time, setTime] = useState(0)
    const [emailGroups, getEmailGroups] = useFetch(fetchMarketingGroups, {type: 'email', status: true});
    const [settings] = useFetch(fetchMarketingSettings)
    const [value, setValue] = useState(0);

    useEffect(() => {
        form.setFieldsValue({content: settings?.email_template[value]})

        setKey(key + 1)
    }, [settings, value])

    const onFinish = async (values) => {
        await useAction(deliverEmail, values, () => getEmailGroups({type: 'email'}))
    }

    return (
        <div>
            <PageTitle title="Send Email"/>
            <div className={'p-4 rounded bg-white'}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <div className={'p-2 my-2 rounded bg-gray-200'}>Email's credentials will be collected from settings.
                    </div>
                    <Row gutter={20}>
                        <Col span={8}>
                            <FormInput
                                name="individual_mail"
                                placeholder={'example@gamil.com'}
                                label="To : Individual"
                            />
                        </Col>
                        <Col span={8}>
                            <FormSelect
                                name="to"
                                label="To : Select Group"
                                options={emailGroups?.map(group => ({
                                    value: group._id,
                                    label: group.name
                                }))}
                            />
                        </Col>
                        <Col span={2} className={'flex flex-col justify-center'}>
                            <FormCheckbox
                                label={'Subscribed User'}
                                name={'subscriber'}
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

                    <FormInput
                        name="subject"
                        placeholder={'Enter Subject...'}
                        label="Subject"
                        required
                    />

                    <Radio.Group onChange={e => setValue(e.target.value)} value={value}>
                        <Radio value={0}>Mail Template:1</Radio>
                        <Radio value={1}>Mail Template:2</Radio>
                    </Radio.Group>

                    <Form.Item name="content" required>
                        <TextEditor key={key}/>
                    </Form.Item>

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
                    {time === "scheduled" &&
                        <FormDatePicker name={'scheduled_date'} lavel={'Select Scheduled Date'}/>}
                    <button className={'px-3 py-2 rounded bg-main '}>Send</button>
                </Form>
            </div>
        </div>);
};

SendEmail.layout = AdminLayout;
export default SendEmail;
