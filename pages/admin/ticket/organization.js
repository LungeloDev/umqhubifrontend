import {Col, Form, Modal, Row} from 'antd';
import React, {useState} from 'react';
import {useEffect} from 'react';
import Button from '../../../components/common/button';
import Table from '../../../components/common/table';
import FormInput, {HiddenFormItem} from '../../../components/form/input';
import {
    fetchPage, fetchLanguages, postPage
} from '../../../helpers/backend_helper';
import {useAction, useActionConfirm, useFetch} from '../../../helpers/hooks';
import AdminLayout from '../../../layouts/admin';
import {useI18n} from "../../../contexts/i18n";
import {FaTrashAlt} from "react-icons/fa";

const Organization = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [organizations, getOrganizations] = useFetch(fetchPage, {pages: 'organization'}, false);
    const [languages] = useFetch(fetchLanguages);
    const [language, setLanguage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        languages?.forEach((d) => {
            if (d.default === true) {
                setLanguage(d.code);
            }
        })
    }, [languages])

    useEffect(() => {
        if (!!language) {
            form.resetFields();
            getOrganizations({lang: language})
        }
    }, [language])

    const onFinish = async (values) => {
        let data = (organizations?.content?.organizations?.value || [])
        if (values.id !== '') {
            data[values.id] = values
        } else {
            values.id = data.length
            data.push(values)
        }
        return useAction(postPage, {
            title: "Organization ", page: "organization", content: {
                organizations: {
                    type: "object",
                    name: 'organizations',
                    value: data,
                    lang: language
                }
            }
        }, () => {
            getOrganizations()
            setIsModalVisible(false);
        })
    }


    const handleCancel = () => {
        setIsModalVisible(false);
    }

    let action = (
        <div className={'flex justify-end space-x-8'}>
            {languages?.map((d, index) => (<button key={index}
                                                   className={`px-4 py-2 rounded bg-main2 ${language === d.code ? 'bg-[#FFE57E]' : ''}`}
                                                   onClick={() => setLanguage(d.code)}>{d.name}</button>))}
            <Button
                className="mr-2"
                onClick={() => {
                    form.resetFields();
                    setIsModalVisible(true);
                    setIsEdit(false)
                }}>
                Add organization
            </Button>
        </div>
    )

    let columns = [{
        dataField: 'name',
        text: 'Name',
    },{
        dataField: 'email',
        text: 'Email',
    },{
        dataField: 'address',
        text: 'Address',
    },{
        dataField: 'phone',
        text: 'Phone',
    },{
        dataField: 'city',
        text: 'City',
    },{
        dataField: 'postal_code',
        text: 'Postal Code',
    },{
        dataField: 'country',
        text: 'Country',
    },
    ];

    return (<section>
        <div className='card_container'>
            <div
                className='h-16 border bg-white flex items-center justify-center text-[18px] font-semibold rounded-md'>
                <h1 className=''>Organization </h1>
            </div>

            <Table
                columns={columns}
                data={organizations?.content?.organizations?.value?.map((d, index) => ({...d, id: index}))}
                noActions={false}
                action={action}
                indexed={true}
                shadow={false}
                onEdit={(data) => {
                    form.resetFields();
                    form.setFieldsValue({
                        ...data,
                    });
                    setIsModalVisible(true);
                    setIsEdit(true)
                }}
                afterActions={({id}) => (
                    <button className="btn btn-outline-danger btn-sm focus:shadow-none me-2"
                            title="Delete" onClick={async () => {
                        let data = (organizations?.content?.organizations?.value || [])
                        data.splice(id, 1)
                        await useActionConfirm(
                            postPage,
                            {
                                title: "Organization", page: "organization", content: {
                                    organizations: {
                                        type: "object",
                                        name: 'organizations',
                                        value: data,
                                        lang: language
                                    }
                                }
                            }, () => {
                                getOrganizations()
                            }, 'Are you sure you want to delete this item?', 'Yes, Delete', i18n.t)
                    }}>
                        <FaTrashAlt/>
                    </button>
                )}
                onReload={getOrganizations}
            />
        </div>

        {/* status updated modal */}
        <Modal title={`Organization Details`} visible={isModalVisible} onCancel={handleCancel} destroyOnClose
               footer={null}
               width={888}>
            <Form
                form={form}
                onFinish={onFinish}
                layout='vertical'
            >
                <HiddenFormItem name="id" initialValue=""/>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <FormInput
                            label="Name"
                            name={"name"}
                            required
                            placeholder={'Enter Name'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            label="Email"
                            name={"email"}
                            required
                            placeholder={'Enter email'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            label="Address"
                            name={"address"}
                            required
                            placeholder={'Enter address'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            label="Phone"
                            name={"phone"}
                            required
                            placeholder={'Enter phone number'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            label="City"
                            name={"city"}
                            required
                            placeholder={'Enter city'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            label="Postal Code"
                            name={"postal_code"}
                            required
                            placeholder={'Enter Postal Code'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            label="Country"
                            name={"country"}
                            required
                            placeholder={'Enter Country'}
                        />
                    </Col>
                </Row>

                <Button>{isEdit ? "Update Organization" : "Add Organization"}</Button>
            </Form>
        </Modal>
    </section>);
};

Organization.layout = AdminLayout;
export default Organization;
