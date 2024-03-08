import React, {useState} from 'react';
import AdminLayout from "../../../layouts/admin";
import PageTitle from "../../../components/common/page-title";
import {Row, Form, Col, Radio} from "antd";
import FormSelect from "../../../components/form/select";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchMarketingGroups, postNotification,} from "../../../helpers/backend_helper";
import FormInput from "../../../components/form/input";
import FormRadio from "../../../components/form/radio";
import FormDatePicker from "../../../components/form/date_picker";
import FormInputWithImoje from "../../../components/form/input_imoje";

const SendNotification = () => {
    const [form] = Form.useForm();
    const [time, setTime] = useState(0)

    const [emailGroups] = useFetch(fetchMarketingGroups, {type: 'notification',status:true});
    const [value, setValue] = useState(1);

    const onFinish = async (values) => {
        values.to_users = value
        if (values.delivery_time === '') {
            values.delivery_time = 'send_now'
        }
        await useAction(postNotification, values)
    }

    return (
        <div>
            <PageTitle title="Push Notification Portal"/>
            <div className={'p-4 rounded bg-white'}>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Row gutter={12}>
                        <Col span={8}>
                            <FormSelect
                                name="to"
                                label="To : select Group"
                                options={emailGroups?.map(group => ({
                                    value: group._id, label: group.name
                                }))}
                            />
                        </Col>
                        <Radio.Group
                            className={'flex items-center '}
                            onChange={e => setValue(e.target.value)}
                            value={value}
                        >
                            <Radio value='all_user'>All Users </Radio>
                            <Radio value='user'>Users </Radio>
                            <Radio value='driver'>Drivers</Radio>
                        </Radio.Group>

                    </Row>
                    <br/>
                    <br/>
                    <Row gutter={10}>
                        <Col span={14}>
                            <FormInput name="title" label="Title" required placeholder={'Enter Title'}/>
                        </Col>
                    </Row>

                    <Row gutter={10}>
                        <Col span={24}>
                            <FormInputWithImoje
                                name="body"
                                placeholder={'Start writing....'}
                                label={'Body'}
                            />
                        </Col>
                    </Row>
                    <br/>
                    <FormRadio required onChange={(v) => setTime(v)} name={'delivery_time'}
                               options={[{value: "send_now", text: "Send Now"}, {
                                   value: "scheduled", text: "Scheduled for Later"
                               }]}/>
                    {time === "scheduled" && <FormDatePicker name={'scheduled_date'} lavel={'Select Scheduled Date'}/>}
                    <button className={'px-3 py-2 rounded bg-main '}>Send</button>
                </Form>
            </div>
        </div>);
};

SendNotification.layout = AdminLayout;
export default SendNotification;
