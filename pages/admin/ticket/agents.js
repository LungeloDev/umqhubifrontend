import {DatePicker, Form, Modal} from 'antd';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Col, Row} from 'react-bootstrap';
import Button from '../../../components/common/button';
import Table from '../../../components/common/table';
import FormInput, {HiddenFormItem} from '../../../components/form/input';
import FormSelect from '../../../components/form/select';
import {
    delUser,
    fetchDepartmentOrCategoryWise,
    fetchDepartmentShortList,
    fetchTicketCategory,
    fetchTicketDepartments, fetchTicketEmployee,
    fetchTicketTypes,
    postEmployee,
} from '../../../helpers/backend_helper';
import {useFetch, useAction} from '../../../helpers/hooks';
import AdminLayout from "../../../layouts/admin";
import PageTitle from "../../../components/common/page-title";
import PhoneNumberInput from '../../../components/form/PhoneInput';
import {useI18n} from '../../../contexts/i18n';

const Employee = () => {
    const i18n = useI18n()
    const [form] = Form.useForm();
    const [employees, getEmployees, {loading, error}] = useFetch(fetchTicketEmployee);
    const [employeeDepartment, getEmployeeDepartment] = useFetch(fetchDepartmentShortList);
    const [rolesPermission, getRolesPermission] = useFetch(fetchDepartmentOrCategoryWise);

    const [ticketDepartment, getTicketDepartment] = useFetch(fetchTicketDepartments);
    const [selectedTicketDepartment, setSelectedTicketDepartment] = useState('');
    const [ticketCategories, getTicketCategories] = useFetch(fetchTicketCategory, {}, false);
    const [ticketTypes, getTicketTypes] = useFetch(fetchTicketTypes);

    // modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(true);

    //set ticket department id and permission id
    // here permission id is rolesPermission called support
    const [selectedEmployeeDepartment, setSelectedEmployeeDepartment] = useState([]);


    const [selectedTticketRoles, setSelectedTicketRoles] = useState('');

    useEffect(() => {
        if (employeeDepartment?.length > 0) {
            employeeDepartment.map((item) => {
                if (item.name === 'ticket') {
                    setSelectedEmployeeDepartment([item]);
                    getRolesPermission({department: item._id})
                }
            })
        }
    }, [employeeDepartment?.length]);

    useEffect(() => {
        if (rolesPermission?.docs?.length > 0) {
            rolesPermission?.docs?.map((item) => {
                if (item.name === 'support') {
                    setSelectedTicketRoles(item._id)
                }
            })
        }
    }, [rolesPermission]);


    let columns = [
        {
            dataField: 'key', text: 'Employee ID', formatter: key => <span className=''>{key}</span>
        },
        {
            dataField: 'name', text: 'Name', formatter: name => <span className='capitalize'>{name}</span>
        },
        {
            dataField: 'email', text: 'Email', formatter: email => <span className=''>{email}</span>
        },
        {
            dataField: 'phone', text: 'Phone', formatter: phone => <span className='capitalize'>{phone}</span>
        },
        {
            dataField: 'ticket_departments',
            text: 'Ticket Departments',
            formatter: department => <span className='capitalize'>{department[0]?.name}</span>
        },
        {
            dataField: 'ticket_categories',
            text: 'Ticket Categories',
            formatter: department => <span className='capitalize'>{department[0]?.name}</span>
        },
        {
            dataField: 'Tickets Assigned',
            text: 'Tickets Assigned',
            formatter: (department, row) => <span className='capitalize'>{row?.assigned_ticket?.length}</span>
        },
        {
            dataField: 'joining_date',
            text: 'Joining Date',
            formatter: joining_date => <span className='capitalize'>{moment(joining_date).format('ll')}</span>
        },
        {
            dataField: 'verified', text: 'Verified', formatter: (verified, data) => (<div className=''>
                <span>{verified ? "Yes" : 'No'}</span>
            </div>)
        },
    ];

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={async () => {
                    await getEmployeeDepartment()
                    form.resetFields();
                    setIsModalVisible(true);
                    setIsEdit(true)
                }}>
                Add Employee
            </Button>
        </div>
    )

    return (
        <main>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <PageTitle title="Agents"/>
                <div className='card_container'>
                    <Table
                        columns={columns}
                        data={employees}
                        pagination={true}
                        noActions={false}
                        action={action}
                        indexed={true}
                        shadow={false}
                        onEdit={async (data) => {

                            await getTicketDepartment()
                            await getTicketCategories({category: true, parent: data?.ticket_departments[0]?._id})
                            await getTicketTypes({
                                department: data?.ticket_departments[0]?._id,
                                category: data?.ticket_categories[0]?._id
                            })
                            form.resetFields(['department'])
                            form.resetFields();
                            form.setFieldsValue({
                                ...data,
                                department: selectedEmployeeDepartment._id,
                                permission: selectedTticketRoles,
                                ticket_departments: data?.ticket_departments[0]?._id,
                                ticket_categories: data?.ticket_categories[0]?._id,
                                ticket_types: data?.ticket_types?.map((item) => item._id),
                                joining_date: moment(data?.joining_date),
                            });
                            setIsModalVisible(true);
                            setIsEdit(false)
                        }}
                        onDelete={delUser}
                        onReload={getEmployees}
                        error={error}
                        loading={loading}
                    />
                </div>
            </section>

            <Modal title={`Employee Details`} visible={isModalVisible} onCancel={handleCancel} destroyOnClose
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
                    <HiddenFormItem name="_id"/>
                    <FormInput
                        name='name'
                        placeholder='Enter full name'
                        label='Name'
                        required/>
                    <PhoneNumberInput
                        name='phone'
                        placeholder='Enter phone number'
                        label='Phone'
                        required
                    />
                    <Row>
                        <Col md={6}>
                            <FormInput
                                name='email'
                                type='email'
                                placeholder='Enter email'
                                label='Email'
                                required/>

                        </Col>
                        <Col md={6}>
                            <Form.Item
                                name='joining_date'
                                label='Joining Data'
                                rules={[{required: true}]}>
                                <DatePicker style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormInput
                                rules={
                                    [{
                                        min: 6,
                                        message: "Password must be at least 6 characters"
                                    }]
                                }
                                name='password'
                                type='password'
                                placeholder='Input strong password'
                                label='Password'
                                required={isEdit}
                            />
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
                                required={isEdit}
                            />
                        </Col>
                    </Row>
                    <Row>
                        {isEdit === false && <Col md={12}>
                            <FormInput name='key' placeholder='Auto' label='Employee Id' disabledDate readOnly/>
                        </Col>}
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormSelect
                                name="department" label='Select Department'
                                required={true}
                                placeholder={'Select a department'}
                                options={selectedEmployeeDepartment}
                                initialValue={selectedEmployeeDepartment[0]?._id}
                                onSelect={e => {
                                    console.log(e)
                                    // getRolesPermission({department: e})
                                }}
                                clearable
                            />
                        </Col>
                        <Col md={6}>
                            <FormSelect
                                name="permission"
                                label='Designation'
                                placeholder='Select permission type'
                                options={rolesPermission?.docs}
                                required={true}
                                initialValue={selectedTticketRoles}
                                clearable
                                onSelect={e => {
                                }}
                            />
                        </Col>
                    </Row>
                    {selectedTticketRoles && <div>
                        <Row>
                            <Col md={6}>
                                <FormSelect
                                    name="ticket_departments" label='Ticket Department'
                                    required={true}
                                    placeholder={'Select a department'}
                                    options={ticketDepartment?.docs }
                                    onSelect={e => {
                                        setSelectedTicketDepartment(e)
                                        getTicketCategories({category: true, parent: e})
                                        form.resetFields(['ticket_categories'])
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
                                        getTicketTypes({department: selectedTicketDepartment, category: e})
                                    }}
                                />
                            </Col>
                        </Row>
                        <FormSelect
                            name="ticket_types"
                            label='Ticket Types'
                            placeholder='Select ticket types'
                            options={ticketTypes?.docs}
                            clearable
                            isMulti={true}
                        />
                    </div>
                    }
                    <Button>{isEdit ? i18n?.t("Add Employee") : i18n?.t("Update Employee")}</Button>
                </Form>
            </Modal>
        </main>
    );
};
Employee.layout = AdminLayout;
export default Employee;
