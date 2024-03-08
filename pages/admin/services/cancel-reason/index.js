import {Form} from 'antd';
import Head from 'next/head';
import React, {useEffect} from 'react';
import Button from '../../../../components/common/button';
import FormInput, {HiddenFormItem} from '../../../../components/form/input';
import AdminLayout from "../../../../layouts/admin";
import {useI18n} from '../../../../contexts/i18n';
import Card from "../../../../components/common/card";
import {Col, Row} from "react-bootstrap";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {fetchSiteSettings, postSettings} from "../../../../helpers/backend_helper";
import {FiTrash} from "react-icons/fi";

const ServiceCancelReason = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [site, getSite] = useFetch(fetchSiteSettings)

    useEffect(() => {
        form.resetFields()
        form.setFieldsValue({
            ...site,
            cancellation_reason: site?.cancellation_reason?.map(d => ({reason: d}))
        })
    }, [site?._id]);


    return (
        <section>
            <Head>
                <title>Trip cancel reasons</title>
            </Head>

            <Form
                form={form}
                onFinish={async (values) => {
                    values.cancellation_reason = values?.cancellation_reason?.map(d => d?.reason);
                    return useAction(postSettings, values, ()=>{getSite()})
                }}
                layout='vertical'
                className={'bg-white p-5'}
            >
                <HiddenFormItem name="_id"/>
                <Card>
                    <h3 className={'font-semibold mb-2'}>{!!i18n && i18n.t("Default Cancellation Reason")}</h3>
                    <FormInput name='auto_cancel_reason' placeholder='Enter auto cancel reason' label='Auto cancel reason' required/>
                </Card>

                <Card>
                    <h3 className={'font-semibold mb-3'}>{!!i18n && i18n.t("Cancellation Reasons")}</h3>
                    <Form.List name="cancellation_reason">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name }) => (
                                    <Row key={key} className="mb-2">
                                        <Col xs={10}>
                                            <FormInput name={[name, 'reason']} placeholder="Enter cancel reason" required />
                                        </Col>
                                        <Col xs={1}>
                                            <FiTrash onClick={() => remove(name)} className="mt-2.5 text-danger" role="button" size={18} />
                                        </Col>
                                    </Row>
                                ))}
                                <span className={'bg-purple-500 hover:bg-purple-600 py-1 px-2 rounded-md text-white cursor-pointer'} onClick={() => add()}>Add Reason</span>
                            </>
                        )}
                    </Form.List>
                </Card>

                <Button>Submit</Button>
            </Form>
        </section>
    );
};

ServiceCancelReason.layout = AdminLayout;
export default ServiceCancelReason;