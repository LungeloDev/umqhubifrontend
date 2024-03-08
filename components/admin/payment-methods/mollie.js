import React, {useState} from 'react';
import {Checkbox, Form, Input, message, Select} from 'antd';
import {useAction, useFetch} from '../../../helpers/hooks';
import {fetchSettings, postSettings} from '../../../helpers/backend_helper';
import {useEffect} from 'react';
const {Option} = Select;
import Button from '../../common/button';
import FormInput from "../../form/input";
import ImageInput from "../../form/image";
import {awsFileUpload} from "../../common/fileUploadAWS";


const MolliePaymentMethod = () => {
    const [form] = Form.useForm()
    const [settings, getSettings] = useFetch(fetchSettings)
    const [image, setImage] = useState(null)

    useEffect(() => {
        if (settings) {
            const data = settings?.mollie
            form.setFieldsValue({
                ...data
            })
        }
    }, [settings])

    const onFinish = async (values) => {
        values.image = await awsFileUpload(values.image);
        const payload = {
            mollie: {
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
                <FormInput initialValue='mollie' disableInput name={'name'} label="Name"
                    placeholder="Name" required />
                <Form.Item name={'image'} label={"Image"}>
                    <ImageInput onSelect={(url) =>
                        setImage(url)
                    } />
                </Form.Item>
                <img className="h-28 pb-4" src={image || settings?.mollie?.image} alt="" />
                <Form.Item
                    label="Live API key"
                    name={["credentials", "mollie_live_api_key"]}
                    rules={[
                        {
                            required: true,
                            message: 'Please input live api key!',
                        },
                    ]}
                >
                    <Input placeholder='Please Provide Mollie Live API key' />
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

export default MolliePaymentMethod;