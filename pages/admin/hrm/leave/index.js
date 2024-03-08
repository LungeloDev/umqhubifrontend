import { DatePicker, Form, Modal, Select } from 'antd';
const { Option } = Select;
import moment from 'moment';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from '../../../../components/common/button';
import Table from '../../../../components/common/table';
import FormInput, { HiddenFormItem } from '../../../../components/form/input';
import FormSelect from '../../../../components/form/select';
import { useI18n } from '../../../../contexts/i18n';
import { useSite } from '../../../../contexts/site';
import { delLeave, fetchEmployee, fetchLeave, fetchLeaveSetting, postLeave } from '../../../../helpers/backend_helper';
import { useFetch, useAction, useActionConfirm } from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";


const EmployeeLeave = () => {
    const site = useSite();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const router = useRouter();
    const [leaves, getLeaves, { loading, error }] = useFetch(fetchLeave);
    const [employees, getEmployees] = useFetch(fetchEmployee);
    const [leaveSetting, getLeaveSetting] = useFetch(fetchLeaveSetting);

    const [employeeID, getEmployeeID] = useState();
    const [leaveSettingID, getLeaveSettingID] = useState();

    const handleChangeStatus = (e, id) => {
        return useActionConfirm(
            postLeave, { status: e, _id: id, },
            getLeaves, `Do you want to ${e} this status?`,
            "Yes"
        );
    }

    const handleEmployeeId = (e) => {
        getEmployeeID(e);
    }

    const handleLeaveSetting = (e) => {
        getLeaveSetting({ _id: e });
        getLeaveSettingID(e);
    }

    let columns = [
        {
            dataField: 'name', text: 'Employee Name',
            formatter: name => <span className='capitalize'>{name}</span>
        },
        {
            dataField: 'leave', text: 'Leave',
            formatter: leave => <span className='capitalize'>{leave}</span>
        },
        {
            dataField: 'type', text: 'Type',
            formatter: type => <span className='capitalize'>{type}</span>
        },
        {
            dataField: 'days', text: 'days',
            formatter: icon => <span className='capitalize'>{icon}</span>
        },
        {
            dataField: 'from', text: 'From',
            formatter: from => <span className='capitalize'>{moment(from).format('ll')}</span>
        },
        {
            dataField: 'to', text: 'To',
            formatter: to => <span className='capitalize'>{moment(to).format('ll')}</span>
        },
        {
            dataField: 'status', text: 'Status',
            formatter: (_, data) => <div className="">
                <Select
                    showSearch
                    className='w-full'
                    placeholder="Change Status"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    allowClear
                    onChange={(e) => handleChangeStatus(e, data)}
                    defaultValue={data?.status}
                >
                    <Option value='pending'><span className='text-purple-500'>Pending</span></Option>
                    <Option value='accepted'><span className='test-teal-600'>Accepted</span></Option>
                    <Option value='rejected'><span className='text-red-500'>Rejected</span></Option>
                </Select>
            </div>
        },
    ];

    // modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reasonView, setReasonView] = useState(null);
    const handleCancel = () => {
        setIsModalVisible(false);
    }

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={() => {
                    form.resetFields();
                    setIsModalVisible(true);
                    setReasonView(null)
                }}>{!!i18n && i18n?.t("Add leave")}</Button>
        </div>)

    return (
        <main>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>{site?.site_name} | Leave</title>
                </Head>
                <div className='card_container'>
                    <Table
                        columns={columns}
                        data={leaves}
                        pagination={true}
                        noActions={false}
                        action={action}
                        indexed={true}
                        shadow={false}
                        onEdit={(data) => {
                            setReasonView(null)
                            form.resetFields();
                            form.setFieldsValue({
                                ...data,
                                employee: data?.name,
                                start_date: moment(data.start_date),
                                end_date: moment(data.end_date),
                                leave_days: data.days
                            });
                            setIsModalVisible(true);
                        }}
                        onView={(data) => {
                            setIsModalVisible(true);
                            setReasonView(data)
                        }}
                        onDelete={delLeave}
                        onReload={getLeaves}
                        error={error}
                        loading={loading}
                    />

                </div>
            </section>

            {/* status updated modal */}
            <Modal title={!!reasonView ? 'Leave Reason' : `Add Leave`} visible={isModalVisible} onCancel={handleCancel} destroyOnClose footer={null} width={569}>
                <Form
                    form={form}
                    onFinish={(values) => {
                        values.employee = employeeID;
                        values.leave = leaveSettingID;
                        values.start_date = moment(values.start_date).format();
                        values.end_date = moment(values.end_date).format();
                        values.leave_days = Number(values.leave_days);
                        return useAction(postLeave, values, () => {
                            getLeaves();
                            getLeaveSetting();
                            setIsModalVisible(false);
                        })
                    }}
                    layout='vertical'
                >
                    {
                        !!reasonView ?
                            <p>{reasonView?.leave_reason}</p>
                            :
                            <div>
                                <HiddenFormItem name="_id" />
                                <FormSelect name='employee' label='Employee' placeholder='Select One' required
                                    options={employees?.docs?.map(d => ({ value: d._id, label: d.name }))}
                                    search
                                    clearable
                                    onChange={handleEmployeeId}
                                />

                                <FormSelect name='leave' label='Leave' placeholder='Select One' required
                                    options={leaveSetting?.docs?.map(d => ({ value: d._id, label: d.title }))}
                                    search
                                    clearable
                                    onChange={handleLeaveSetting}
                                />

                                <Row>
                                    <Col md={6}>
                                        <Form.Item name='start_date' label='Start Leave Data' rules={[{ required: true }]} >
                                            <DatePicker style={{ width: '100%', height: '40px', borderRadius: '10px' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Item name='end_date' label='End Leave Data' rules={[{ required: true }]} >
                                            <DatePicker style={{ width: '100%', height: '40px', borderRadius: '10px' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>


                                <FormInput name='leave_days' label='Leave Days' required type='number' placeholder='Example: for 2 days, enter 2 '
                                    extra={leaveSetting?.days ? `Only ${leaveSetting?.days} days are available` : undefined} />

                                <FormInput name='leave_reason' label='Leave Reason' required textArea />

                                <Button className='mt-4'>Submit</Button>
                            </div>
                    }

                </Form>
            </Modal>
        </main>
    );
};
EmployeeLeave.layout = AdminLayout;
export default EmployeeLeave;