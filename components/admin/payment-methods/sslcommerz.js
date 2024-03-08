import React, {useState, useEffect} from 'react';
import {Form, Input, Select} from 'antd';
import {useAction, useFetch} from '../../../helpers/hooks';
import {fetchSettings, postSettings} from '../../../helpers/backend_helper';
import Button from '../../common/button';
import ImageInput from "../../form/image";
import FormInput from "../../form/input";
import {awsFileUpload} from "../../common/fileUploadAWS";

const {Option} = Select;


const SslcommerzPaymentMethod = () => {
    const [form] = Form.useForm()
    const [settings, getSettings] = useFetch(fetchSettings)
    const [image, setImage] = useState(null)

    useEffect(() => {
        if (settings) {
            const data = settings?.ssl_commercez
            form.setFieldsValue({
                ...data
            })
        }
    }, [settings])

    const onFinish = async (values) => {
        values.image = await awsFileUpload(values.image);

        const payload = {
            ssl_commercez: {
                ...values
            }
        }

        return useAction(postSettings, payload, () => {
            getSettings()
        })
    };

    return (<div className='border p-5'>
        <Form
            form={form}
            onFinish={onFinish}
            layout='vertical'
        >
            <FormInput initialValue='sslcommerz' disableInput name={'name'} label="Name"
                placeholder="Name" required />

            <Form.Item name={'image'} label={"Image"}>
                <ImageInput onSelect={(url) =>
                    setImage(url)
                } />
            </Form.Item>
            <img className="h-28 pb-4" src={image || settings?.ssl_commercez?.image} alt="" />

            {/* SSLCOMMERZ credentials */}
            <div className='relative'>
                <Form.Item
                    label="SSLCOMMERZ Live Base URL"
                    name={["credentials", "sslcommerz_url"]}
                    rules={[{
                        required: true, message: 'Please input paypal base url link!',
                    },]}
                >
                    <Input placeholder='For Example: https://securepay.sslcommerz.com' />
                </Form.Item>

                <small className='text-gray-500 absolute top-0 right-0'>Collect Live link here : <a
                    href='https://sslcommerz.com/' target="_blank" rel="noreferrer">Click</a></small>
            </div>

            {/* SSLCOMMERZ store id */}
            <Form.Item
                label="SSLCOMMERZ Store ID"
                name={["credentials", "sslcommerz_store_id"]}
                rules={[{
                    required: true, message: 'Please input SSLCOMMERZ Store ID!',
                },]}
            >
                <Input placeholder='Please Provide SSLCOMMERZ Store ID' />
            </Form.Item>

            {/* SSLCOMMERZ store password */}
            <Form.Item
                label="SSLCOMMERZ Store Password"
                name={["credentials", "sslcommerz_store_password"]}
                rules={[{
                    required: true, message: 'Please input SSLCOMMERZ Store Password!',
                },]}
            >
                <Input placeholder='Please Provide SSLCOMMERZ Store Password' />
            </Form.Item>

            {/* SSLCOMMERZ success URL */}
            <Form.Item
                label="SSLCOMMERZ Success URL"
                name={["credentials", "sslcommerz_seccess_url"]}
                rules={[{
                    required: true, message: 'Please input SSLCOMMERZ Success url!',
                },]}
            >
                <Input placeholder='Please Provide SSLCOMMERZ Success url' />
            </Form.Item>

            {/*  SSLCOMMERZ fail URL */}
            <Form.Item
                label="SSLCOMMERZ Fail URL"
                name={["credentials", "sslcommerz_fail_url"]}
                rules={[{
                    required: true, message: 'Please input SSLCOMMERZ Fail URL!',
                },]}
            >
                <Input placeholder='Please Provide SSLCOMMERZ Fail URL' />
            </Form.Item>

            <Form.Item
                label="SSLCOMMERZ Cancel URL"
                name={["credentials", "sslcommerz_cancel_url"]}
                rules={[{
                    required: true, message: 'Please input SSLCOMMERZ Cancel URL!',
                },]}
            >
                <Input placeholder='Please Provide SSLCOMMERZ Cancel URL' />
            </Form.Item>
            <Form.Item
                label="SSLCOMMERZ IPN URL"
                name={["credentials", "sslcommerz_ipn_url"]}
                rules={[{
                    required: true, message: 'Please input SSLCOMMERZ IPN URL!',
                },]}
            >
                <Input placeholder='Please Provide SSLCOMMERZ IPN URL' />
            </Form.Item>

            <Form.Item
                label="Active Status"
                name={["credentials", "active"]}
                rules={[{
                    required: true, message: 'Please select payment status!',
                },]}
            >
                <Select
                    placeholder="Select Payment Status"

                >
                    <Option value={true}>Enable</Option>
                    <Option value={false}>Disable</Option>
                </Select>
            </Form.Item>

            <div className='pt-4'></div>

            <Button type="primary" htmlType="submit">
                Submit
            </Button>

        </Form>
    </div>);
};

export default SslcommerzPaymentMethod;