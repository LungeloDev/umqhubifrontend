import React from 'react';
import { Form, Input, Select, Space } from 'antd';
import { useState } from 'react';
import { MinusCircleOutlined } from '@ant-design/icons';
import { useAction, useFetch } from "../../../../helpers/hooks";
import Button from "../../../../components/common/button";
import { postFormFieldAPI } from "../../../../helpers/backend_helper";

const { Option } = Select;

const CreateNewField = ({ getFormFields, onClose }) => {
    const [inputTypeSelect, setInputTypeSelect] = useState(false);
    const catchInputType = (input_type) => {
        setInputTypeSelect(input_type)
    }

    const onFinish = (values) => {
        return useAction(postFormFieldAPI, values, () => setTimeout(() => {
            onClose()
            getFormFields()
        }, 1500)
        )
    };

    return (
        <div>
            <section className='min-h-screen'>
                <div className='bg-gray-50 p-10 shadow-md rounded-md'>
                    <div className=''>
                        <h6 className='text-teal-500 underline text-center pb-4'>Add Document Input Field</h6>
                    </div>
                    <Form
                        onFinish={onFinish}
                        layout='vertical'
                    >
                        <Form.Item
                            label="Input Name"
                            name="input_name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input name!',
                                },
                            ]}
                        >
                            <Input placeholder='Input Name' />
                        </Form.Item>
                        <Form.Item
                            label="Input Type"
                            name="input_type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input type!',
                                },
                            ]}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Select'
                                onChange={catchInputType}
                            >
                                <Option value='text'>Text</Option>
                                <Option value='number'>Number</Option>
                                <Option value='password'>Password</Option>
                                <Option value='textarea'>Textarea</Option>
                                <Option value='image'>Image</Option>
                                <Option value='checkbox'>Terms and conditions</Option>
                            </Select>
                        </Form.Item>
                        {/* option name */}
                        {
                            (inputTypeSelect === 'select' || inputTypeSelect === 'radio_button') &&
                            <Form.List name="select_options">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} className='block' align="baseline">
                                                <div className={'flex gap-3'}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name]}
                                                        className='w-full md:w-[500px] lg:w-[500px]'
                                                    >

                                                        <Input placeholder='Name of Option' />
                                                    </Form.Item>

                                                    <p className='text-red-500 font-bold'><MinusCircleOutlined
                                                        onClick={() => remove(name)} /></p>
                                                </div>
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <span onClick={() => add()}>
                                                <span
                                                    className='text-green-700 bg-main px-2 py-1 rounded-md cursor-pointer'> + Add New Option</span>
                                            </span>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        }
                        {/* link add, if needed for checkbox */}
                        {
                            (inputTypeSelect === 'checkbox') &&
                            <Form.Item
                                label="Add link"
                                name="link"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Add a link!',
                                    },
                                ]}
                            >
                                <Input placeholder='Add a link, if needed' />
                            </Form.Item>
                        }
                        <Form.Item
                            label="Input Placeholder"
                            name="placeholder"
                            rules={[
                                {
                                    required: false,
                                    message: 'Please input placeholder!',
                                },
                            ]}
                        >
                            <Input placeholder='Placeholder title that you want to show in input field' />
                        </Form.Item>
                        <Form.Item
                            label="Is it require?"
                            name="field_required"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input required option!',
                                },
                            ]}
                            extra="If it is mandatory, select 'Yes'"
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Select'
                            >
                                <Option value={true}>Yes</Option>
                                <Option value={false}>No</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                            extra='true means, this field will show in form immediately'
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Select'
                            >
                                <Option value={true}>True</Option>
                                <Option value={false}>False</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                Create
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </section>
        </div>
    );
};
export default CreateNewField;