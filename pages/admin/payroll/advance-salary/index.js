import {DatePicker, Form, Modal} from 'antd';
import Head from 'next/head';
import React, {useState} from 'react';
import Button from '../../../../components/common/button';
import Table, {TableImage} from '../../../../components/common/table';
import FormInput, {HiddenFormItem} from '../../../../components/form/input';
import {useSite} from '../../../../contexts/site';
import {
    delPayrollAdvanceSalary,
    DepartmentEmployees,
    fetchDepartmentOrCategoryWise,
    fetchDepartmentShortList,
    fetchPayrollAdvanceSalaries,
    postPayrollAdvanceSalary,
} from '../../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";
import {DotLoader} from "react-spinners";
import Card from "../../../../components/common/card";
import FormSelect from "../../../../components/form/select";
import {Col, Row} from "react-bootstrap";
import moment from "moment";
import { useI18n } from '../../../../contexts/i18n';

const PayrollAdvanceSalary = () => {
    const site = useSite();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [advanceSalaries, setAdvanceSalaries, {error, loading}] = useFetch(fetchPayrollAdvanceSalaries)
    const [departmentElements, getDepartmentElements] = useFetch(fetchDepartmentShortList);
    const [roles, getRoles] = useFetch(fetchDepartmentOrCategoryWise);
    const [employees, getEmployee] = useFetch(DepartmentEmployees, {}, false)
    const [loadingSpinner, setLoadSpinner] = useState(false);
    const [departmentId, setDepartmentId] = useState()

    let columns = [
        {
            dataField: 'department', text: 'Department',
            formatter: department => <span className='capitalize'>{department?.name}</span>
        },
        {
            dataField: 'designation', text: 'Designation',
            formatter: designation => <span className='capitalize'>{designation?.name}</span>
        },
        {
            dataField: 'employee', text: 'Employee Name',
            formatter: employee => <span className='capitalize'>{employee?.name}</span>
        },
        {
            dataField: 'date', text: 'Date',
            formatter: date => <span className='capitalize'>{!!date ? moment(date).format('ll') : "-"}</span>
        },
        {
            dataField: 'advance_for', text: 'Advance For',
            formatter: advance_for => <span className='capitalize'>
                {!!advance_for ? moment(advance_for).format('MMM YYYY') : "-"}
            </span>
        },
        {
            dataField: 'amount', text: 'Amount',
            formatter: amount => <span className='capitalize'>{amount}</span>
        },
    ];

    // modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={() => {
                    form.resetFields();
                    setIsModalVisible(true);
                    setIsEdit(false)
                }}>{!!i18n && i18n?.t("Advance Salary")}</Button>
        </div>)

    return (
        <section>
            <Head>
                <title>Service Categories</title>
            </Head>
            <Card className={'shadow-sm'}>
                <h1>{!!i18n && i18n?.t("Advance Salary")}</h1>
            </Card>
            <div className='card_container'>
                <Table
                    columns={columns}
                    data={advanceSalaries}
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
                            designation: data?.designation?._id,
                            employee: data?.employee?._id,
                            date: moment(data?.date),
                            advance_for: moment(data?.advance_for),
                        });
                        getRoles({department: data?.department?._id})
                        getEmployee({
                            department: data?.department?._id,
                            role: data?.designation?._id
                        })
                        setIsModalVisible(true);
                        setIsEdit(true)
                    }}
                    onDelete={delPayrollAdvanceSalary}
                    onReload={setAdvanceSalaries}
                    error={error}
                />
            </div>

            {/* status updated modal */}
            <Modal title={isEdit ? "Update Category" : `Advance Salary`} visible={isModalVisible}
                   onCancel={() => setIsModalVisible(false)}
                   destroyOnClose footer={null}>
                <Form
                    form={form}
                    onFinish={async (values) => {
                        values.advance_for = moment(values.advance_for).format()
                        values.date = moment(values.date).format()
                        return useAction(postPayrollAdvanceSalary, values, () => {
                            setAdvanceSalaries()
                            setIsModalVisible(false);
                        })
                    }}
                    layout='vertical'
                >
                    <HiddenFormItem name="_id"/>
                    <Row>
                        <Col md={6}>
                            <FormSelect
                                name="department" label='Select Department'
                                required={true}
                                placeholder={'Select a department'}
                                options={departmentElements}
                                onSelect={e => {
                                    getRoles({department: e})
                                    setDepartmentId(e)
                                }}
                                clearable
                            />
                        </Col>
                        <Col md={6}>
                            <FormSelect
                                name="designation"
                                label='Designation'
                                placeholder='Select designation'
                                options={roles?.docs}
                                required={true}
                                clearable
                                onSelect={e => {
                                    getEmployee({
                                        department: departmentId,
                                        role: e
                                    })
                                }}
                            />
                        </Col>
                    </Row>
                    <FormSelect
                        name="employee"
                        label='Select Employee'
                        placeholder='Select employee'
                        options={employees?.docs?.map(d => ({label: d?.name + " -> " + d?.email, value: d?._id}))}
                        required={true}
                        clearable
                        search
                    />
                    <Row>
                        <Col md={6}>
                            <Form.Item
                                name='advance_for'
                                label='Advance For'
                            >
                                <DatePicker picker="month" className="form-control" placeholder={'Select month'}/>
                            </Form.Item>
                        </Col>
                        <Col md={6}>
                            <Form.Item
                                name='date'
                                label='Date'
                            >
                                <DatePicker className="form-control"/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <FormInput name='amount' type={'number'} placeholder='Enter amount' label='Amount' required/>
                    <div className={'flex items-center gap-5'}>
                        <Button>{isEdit ? "Update" : "Add Advance"}</Button>
                        {
                            loadingSpinner === true &&
                            <div>
                                <DotLoader color="purple" size={20} className='ml-5'/>
                                <p className='text-purple-700 font-semibold text-[14px]'>Please Wait...</p>
                            </div>
                        }
                    </div>
                </Form>
            </Modal>
        </section>
    );
};
PayrollAdvanceSalary.layout = AdminLayout;
export default PayrollAdvanceSalary;