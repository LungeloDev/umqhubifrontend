import {DatePicker, Form, Modal} from 'antd';
import moment from 'moment';
import Head from 'next/head';
import React, {useState} from 'react';
import {Col, Row} from 'react-bootstrap';
import Button from '../../../components/common/button';
import Table from '../../../components/common/table';
import FormInput, {HiddenFormItem} from '../../../components/form/input';
import FormSelect from '../../../components/form/select';
import {useI18n} from '../../../contexts/i18n';
import {useSite} from '../../../contexts/site';
import {
    delUser,
    fetchDepartmentOrCategoryWise,
    fetchDepartmentShortList,
    fetchEmployee, fetchRole, fetchTicketDepartment, fetchTicketDepartments, fetchTicketTypes,
    postEmployee,
} from '../../../helpers/backend_helper';
import {useFetch, useAction} from '../../../helpers/hooks';
import AdminLayout from "../../../layouts/admin";
import PhoneNumberInput from '../../../components/form/PhoneInput';

const Employee = () => {
    const site = useSite();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [employees, getEmployees, {loading, error}] = useFetch(fetchEmployee);
    const [departmentElements, getDepartmentElements] = useFetch(fetchDepartmentShortList);
    const [ticketDepartment, getTicketDepartment] = useFetch(fetchTicketDepartments);
    const [ticketCategories, getTicketCategories] = useFetch(fetchTicketDepartments, {}, false);
    const [ticketTypes, getTicketTypes] = useFetch(fetchTicketTypes);
    const [roles, getRoles] = useFetch(fetchDepartmentOrCategoryWise);
    const [role, getRole] = useFetch(fetchRole);
    const [ticketDepartmentId, setTicketDepartmentId] = useState('');

    let columns = [
        {
            dataField: 'key', text: 'Employee ID',
            formatter: key => <span className=''>{key}</span>
        },
        {
            dataField: 'name', text: 'Name',
            formatter: name => <span className='capitalize'>{name}</span>
        },
        {
            dataField: 'email', text: 'Email',
            formatter: email => <span className=''>{email}</span>
        },
        {
            dataField: 'phone', text: 'Phone',
            formatter: phone => <span className='capitalize'>{phone}</span>
        },
        {
            dataField: 'department', text: 'Department',
            formatter: department => <span className='capitalize'>{department?.name}</span>
        },
        {
            dataField: 'permission', text: 'Role Type',
            formatter: permission => <span className='capitalize'>{permission?.name}</span>
        },
        {
            dataField: 'joining_date', text: 'Joining Date',
            formatter: joining_date => <span className='capitalize'>{moment(joining_date).format('ll')}</span>
        },
        {
            dataField: 'verified', text: 'Verified',
            formatter: (verified, data) => (<div className=''>
                <span>{verified ? "Yes" : 'No'}</span>
            </div>)
        },
    ];

    // modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(true);
    const handleCancel = () => {
        setIsModalVisible(false);
    }

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={() => {
                    getRole()
                    form.resetFields();
                    setIsModalVisible(true);
                    setIsEdit(false)
                }}>{!!i18n && i18n?.t("Add Employee")}</Button>
        </div>
    )


    return (
        <main>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>{site?.site_name} | Employee</title>
                </Head>
                <div className='card_container'>
                    <Table
                        columns={columns}
                        data={employees}
                        pagination={true}
                        noActions={false}
                        action={action}
                        indexed={true}
                        shadow={false}
                        onEdit={(data) => {
                            form.resetFields();
                            form.setFieldsValue({
                                ...data,
                                department: data?.department?._id,
                                permission: data.permission._id,
                                joining_date: moment(data?.joining_date),
                            });
                            setIsModalVisible(true);
                            setIsEdit(true)
                            getRoles({department: data?.department?._id})
                        }}
                        onDelete={delUser}
                        onReload={getEmployees}
                        error={error}
                        loading={loading}
                    />
                </div>
            </section>

            {/* status updated modal */}
            <Modal title={!!i18n && i18n?.t("Employee Details")} visible={isModalVisible} onCancel={handleCancel} destroyOnClose
                footer={null} width={569}>
                <Form
                    form={form}
                    onFinish={(values) => {
                        values.role = "employee";
                        return useAction(postEmployee, values, () => {
                            getEmployees();
                            setIsModalVisible(false);
                        })
                    }}
                    layout='vertical'
                >
                    <HiddenFormItem name="_id" />
                    <FormInput name='name' placeholder='Enter full name' label='Name' required />
                    <PhoneNumberInput
                        name='phone' placeholder='Enter phone number' label='Phone' required
                    />
                    <Row>
                        <Col md={6}>
                            <FormInput name='email' type='email' placeholder='Enter email' label='Email' required />
                        </Col>
                        <Col md={6}>
                            <Form.Item name='joining_date' label='Joining Data' rules={[{required: true}]}>
                                <DatePicker style={{width: '100%'}} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <FormInput name='password' type='password' placeholder='Input strong password'
                                label='Password' required={isEdit} />
                        </Col>
                        <Col md={6}>
                            <FormInput
                                name='confirm_password'
                                type='password'
                                placeholder='Confirm password'
                                label='Confirm Password'
                                rules={[
                                    {
                                        required: isEdit,
                                    },
                                    ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject("Incorrect Password!")
                                        }
                                    })
                                ]}
                                hasFeedback
                            />
                        </Col>
                    </Row>
                    <Row>
                        {
                            isEdit === false &&
                            <Col md={12}>
                                <FormInput name='key' placeholder='Auto' label='Employee Id' disabledDate readOnly />
                            </Col>
                        }
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormSelect
                                name="department" label='Select Department'
                                required={true}
                                placeholder={'Select a department'}
                                options={departmentElements}
                                onSelect={e => {
                                    getRoles({department: e})
                                }}
                                clearable
                            />
                        </Col>
                        <Col md={6}>
                            <FormSelect
                                name="permission"
                                label='Designation'
                                placeholder='Select permission type'
                                options={roles?.docs}
                                required={true}
                                clearable
                                onSelect={e => {
                                    getRole({_id: e})
                                }}
                            />
                        </Col>
                    </Row>
                    {
                        role?.name === "support" &&
                        <div>
                            <Row>
                                <Col md={6}>
                                    <FormSelect
                                        name="ticket_departments" label='Ticket Department'
                                        required={true}
                                        placeholder={'Select a department'}
                                        options={ticketDepartment?.docs}
                                        onSelect={e => {
                                            setTicketDepartmentId(e)
                                            getTicketCategories({category: true, parent: e})
                                        }}
                                        clearable
                                    />
                                </Col>
                                <Col md={6}>
                                    <FormSelect
                                        name="ticket_categories"
                                        label='Ticket Categories'
                                        placeholder='Select ticket categories'
                                        options={ticketCategories?.docs}
                                        required={true}
                                        clearable
                                        onSelect={e => {
                                            getTicketTypes({department: ticketDepartmentId, category: e})
                                        }}
                                    />
                                </Col>
                            </Row>
                            <FormSelect
                                name="ticket_types"
                                label='Ticket Types'
                                placeholder='Select ticket types'
                                options={ticketTypes?.docs}
                                required={true}
                                clearable
                                isMulti={true}
                            />
                        </div>
                    }
                    <Button>{isEdit ? !!i18n && i18n?.t("Edit Employee") : !!i18n && i18n?.t("Add Employee")}</Button>
                </Form>
            </Modal>
        </main>
    );
};
Employee.layout = AdminLayout;
export default Employee;