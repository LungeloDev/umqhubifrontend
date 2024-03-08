import React, {useEffect} from 'react';
import {Form, Input, message, Space} from "antd";
import {HiddenFormItem} from "../../../../components/form/input";
import {Col, Row} from "react-bootstrap";
import {MinusCircleOutlined} from "@ant-design/icons";
import Button from "../../../../components/common/button";
import Card from "../../../../components/common/card";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {getCategoryInformation, postCategoryInformation} from "../../../../helpers/backend_helper";

const Info = ({_id}) => {
    const [form] = Form.useForm();
    const [info, setInfo] = useFetch(getCategoryInformation);

    useEffect(() => {
        if (!!_id) {
            setInfo({service_category: _id})
        }
    }, [_id]);

    useEffect(() => {
        if (info?._id) {
            form.setFieldsValue({
                ...info
            })
        }
    }, [info?._id]);

    return (
        <div>
            <Card className={'shadow-sm'}>
                <h1 className={'mb-3 text-slate-700 font-semibold'}>Service Category Information</h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={values => {
                        if (!!_id) {
                            let data = {
                                _id: values._id,
                                service_category: _id,
                                brief_info: values.brief_info
                            }
                            return useAction(postCategoryInformation, {...data}, async () => {
                                setInfo()
                            })
                        } else {
                            message.error('Please try again')
                        }
                    }}
                    initialValues={{
                        remember: true,
                    }}
                >
                    <HiddenFormItem name="_id"/>
                    <Form.List name="brief_info">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name, ...restField}) => (
                                    <Space key={key} className='block' align="baseline">
                                        <Row className={''}>
                                            <Col xs={5}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'title']}
                                                >

                                                    <Input style={{width: "100%"}} placeholder='Title'/>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={5}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'information']}

                                                >

                                                    <Input style={{width: "100%"}} placeholder='information'/>

                                                </Form.Item>
                                            </Col>
                                            <Col xs={2} className={'mt-1'}>
                                                <p className='text-red-500 font-bold'><MinusCircleOutlined
                                                    onClick={() => remove(name)}/></p>
                                            </Col>
                                        </Row>
                                    </Space>
                                ))}
                                <Form.Item>
                                            <span onClick={() => add()}>
                                                <span
                                                    className='text-green-700 bg-main px-2 py-1 rounded-md cursor-pointer'> + Add brief information</span>
                                            </span>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Button>Submit</Button>
                </Form>
            </Card>
        </div>
    );
};
export default Info;