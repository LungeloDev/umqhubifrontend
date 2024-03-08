import React, {useState} from 'react';
import {Checkbox, Form, Input, message, Select} from 'antd';
const {Option} = Select;
import {useAction, useFetch} from '../../../helpers/hooks';
import {fetchSettings, postSettings} from '../../../helpers/backend_helper';
import {useEffect} from 'react';
import Button from '../../common/button';
import FormInput from "../../form/input";
import ImageInput from "../../form/image";
import {awsFileUpload} from "../../common/fileUploadAWS";


const PaypalPaymentMethod = () => {
    const [form] = Form.useForm()
    const [settings, getSettings] = useFetch(fetchSettings)
    const [image, setImage] = useState(null)

    useEffect(() => {
        if (settings) {
            const data = settings?.paypal
            form.setFieldsValue({
                ...data
            })
        }
    }, [settings])

    const onFinish = async (values) => {
        values.image = await awsFileUpload(values.image);
        const payload = {
            paypal: {
                ...values
            }
        }
        return useAction(postSettings, payload, () => {
            getSettings()
        })
    };

    return (
        <div className='border p-5'>
            <Form
                form={form}
                onFinish={onFinish}
                layout='vertical'
            >
                <FormInput initialValue='paypal' disableInput name={'name'} label="Name"
                    placeholder="Name" required />

                <Form.Item name={'image'} label={"Image"}>
                    <ImageInput onSelect={(url) =>
                        setImage(url)
                    } />
                </Form.Item>
                <img className="h-28 pb-4" src={image || settings?.paypal?.image} alt="" />

                <div className='relative'>
                    <Form.Item
                        label="Paypal Live Base URL"
                        name={["credentials", "paypal_base_url"]}
                        rules={[
                            {
                                required: true,
                                message: 'Please input paypal base url link!',
                            },
                        ]}
                    >
                        <Input placeholder='For Example: https://api-m.sandbox.paypal.com' />
                    </Form.Item>

                    <small className='text-gray-500 absolute top-0 right-0'>Collect Live link here : <a href='https://developer.paypal.com/api/rest/urls/' target="_blank" rel="noreferrer">Click</a></small>
                </div>

                <Form.Item
                    label="Client ID"
                    name={["credentials", "paypal_client_id"]}
                    rules={[
                        {
                            required: true,
                            message: 'Please input client_id!',
                        },
                    ]}
                >
                    <Input placeholder='Please Provide Client ID' />
                </Form.Item>

                <Form.Item
                    label="Secret Key"
                    name={["credentials", "paypal_secret_key"]}
                    rules={[
                        {
                            required: true,
                            message: 'Please input secret key!',
                        },
                    ]}
                >
                    <Input placeholder='Please Provide Secret Key' />
                </Form.Item>

                <Form.Item
                    label="Status"
                    name={["credentials", "active"]}
                    rules={[
                        {
                            required: true,
                            message: 'Please select payment status!',
                        },
                    ]}
                >
                    <Select
                        placeholder="Select Payment Status"

                    >
                        <Option value={true}>Enable</Option>
                        <Option value={false}>Disable</Option>
                    </Select>
                </Form.Item>

                <Button >Submit</Button>
            </Form>
        </div>
    );
};

export default PaypalPaymentMethod;