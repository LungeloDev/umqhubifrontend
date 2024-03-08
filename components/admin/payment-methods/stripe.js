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


const StripePaymentMethod = () => {
    const [form] = Form.useForm()
    const [settings, getSettings] = useFetch(fetchSettings)
    const [image, setImage] = useState(null)

    useEffect(() => {
        if (settings) {
            const data = settings.stripe
            form.setFieldsValue({
                ...data
            })
        }
    }, [settings])

    const onFinish = async (values) => {
        values.image = await awsFileUpload(values.image);

        const payload = {
            stripe: {
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
                <FormInput initialValue='stripe' disableInput name={'name'} label="Name"
                    placeholder="Name" required />

                <Form.Item name={'image'} label={"Image"}>
                    <ImageInput onSelect={(url) =>
                        setImage(url)
                    } />
                </Form.Item>
                <img className="h-28 pb-4" src={image || settings?.stripe?.image} alt="" />

                <Form.Item
                    label="Publishable key"
                    name={["credentials", "stripe_publishable_key"]}
                    rules={[
                        {
                            required: true,
                            message: 'Please input publishable key!',
                        },
                    ]}
                >
                    <Input placeholder='Please Provide Publishable key' />
                </Form.Item>

                <Form.Item
                    label="Secret Key"
                    name={["credentials", "stripe_secret_key"]}
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

                <Button>Submit</Button>
            </Form>
        </div>
    );
};

export default StripePaymentMethod;