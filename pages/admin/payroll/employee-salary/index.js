import {Form, Modal, Switch} from 'antd';
import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import Button from '../../../../components/common/button';
import Table from '../../../../components/common/table';
import FormInput, {HiddenFormItem} from '../../../../components/form/input';
import {
    delSalary,
    fetchPayrollSalarySettings,
    fetchSalaries, fetchSalary,
    fetchSalaryElements,
} from '../../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";
import Card from "../../../../components/common/card";
import FormSelect from "../../../../components/form/select";
import {Col, Row} from "react-bootstrap";


const PayrollEmployeeSalary = () => {
    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)
    const [salaries, getSalaries, {loading, error}] = useFetch(fetchSalaries)
    const [salarySettings] = useFetch(fetchPayrollSalarySettings)
    const [employees] = useFetch(fetchSalaryElements)

    let columns = [
        {text: 'Employee Name', dataField: 'employee', formatter: data => `${data?.name}`},
        {
            text: 'Salary',
            dataField: 'net_salary',
            formatter: (salary, data) => data?.hourly_basis_salary_allow === true ? `${data?.hourly_rate} /hr` : salary
        },
        {
            text: 'OverTime',
            dataField: 'is_over_time_allow',
            formatter: (value, data) => <span
                className="">{data?.hourly_basis_salary_allow === false && value === true ? data?.over_time_rate + ' /hr' : ''}</span>
        },
        {
            text: 'Absent Reduce',
            dataField: 'absent_deduct_allow',
            formatter: (value, data) => <span
                className="">{data?.hourly_basis_salary_allow === false && value === true ? data?.absent_deduct_rate + ' /day' : ''}</span>
        },
    ]

    const [required, setRequired] = useState({
        overTime: false,
        absent: false,
        hourly: false,
    })

    let action = (
        <button className="btn bg-twPrimary" onClick={() => {
            setRequired({
                overTime: false,
                absent: false,
                hourly: false,
            })
            setEmployee(undefined)
            form.resetFields()
            setVisible(true)
        }}>Add Salary</button>
    )

    let settings = {}
    salarySettings?.docs?.forEach(setting => {
        settings[setting._id] = setting
    })

    const calculateNetSalary = () => {
        let values = form?.getFieldsValue()
        if (+values?.basic_salary > 0) {
            let net_salary = +values?.basic_salary
            Object.keys(values?.categories ?? {})?.map(key => {
                let value = +values?.categories[key]?.value
                if (value > 0) {
                    value = settings[key].value_type === 'percentage' ? (+values?.basic_salary * (value / 100)) : value
                    net_salary += settings[key]?.setting_type === "addition" ? value : -value
                }
            })
            form.setFieldsValue({net_salary})
        } else {
            form.setFieldsValue({net_salary: 0})
        }
    }
    const [employee, setEmployee] = useState()
    let options = employee ? [employee] : employees

    // modal width size
    const [modalWith, setModalWidth] = useState()
    useEffect(() => {
        if (window.innerWidth > 800) {
            setModalWidth(800)
        } else {
            setModalWidth("100%")
        }
    }, [])

    return (
        <section>
            <Head>
                <title>Employee Salary</title>
            </Head>
            <Card className={'shadow-sm'}>
                <h1>Salary Settings</h1>
            </Card>
            <div className='card_container'>
                <Table
                    columns={columns}
                    data={salaries}
                    pagination={true}
                    noActions={false}
                    action={action}
                    indexed={true}
                    shadow={false}
                    onEdit={(data) => {
                        setEmployee(data.employee)
                        form.resetFields()
                        let categories = {}
                        data?.categories?.forEach(category => {
                            categories[category.salary_settings_id] = {
                                value: category.value,
                            }
                        })
                        form.setFieldsValue({
                            ...data,
                            is_over_time_allow: data.is_over_time_allow === true,
                            absent_deduct_allow: data.absent_deduct_allow === true,
                            hourly_basis_salary_allow: data.hourly_basis_salary_allow === true,
                            categories,
                        })
                        setRequired({
                            overTime: data.is_over_time_allow === true,
                            absent: data.absent_deduct_allow === true,
                            hourly: data.hourly_basis_salary_allow === true
                        })
                        setVisible(true)
                    }}
                    onDelete={delSalary}
                    onReload={getSalaries}
                    error={error}
                    loading={loading}
                />
            </div>

            <Modal
                title={"Employee Salary"}
                visible={visible}
                onCancel={() => setVisible(false)}
                destroyOnClose footer={null}
                width={modalWith}
            >
                <Form
                    form={form}
                    onFinish={async (values) => {
                        values.is_over_time_allow = values.is_over_time_allow ? true : false
                        values.absent_deduct_allow = values.absent_deduct_allow ? true : false
                        values.hourly_basis_salary_allow = values.hourly_basis_salary_allow ? true : false
                        values.categories = Object.keys(values.categories)?.map(key => ({
                            salary_settings_id: key,
                            ...values.categories[key]
                        }))
                        return useAction(fetchSalary, values, () => {
                            getSalaries()
                            setVisible(false);
                        })
                    }}
                    layout='vertical'
                >
                    <HiddenFormItem name={'_id'} />
                    <div style={{display: required?.hourly ? 'block' : 'none'}}>
                        <FormSelect name="employee_id" label="Employee" options={options?.map(data => ({
                            value: data?._id,
                            label: (<span className={data?.alreadyAdded === true ? "text-green-500" : ''}
                                title={data?.alreadyAdded && "Already Added"}>{`${data?.name} - ${data?.email}`}</span>)
                        }))} required search={true} clearable={true} placeholder={'Select an employee'} />
                    </div>
                    <Row style={{display: required?.hourly ? 'none' : 'flex'}}>
                        <Col md={6}>
                            <FormSelect name="employee_id" label="Employee" options={options?.map(data => ({
                                value: data?._id,
                                label: (<span className={data?.alreadyAdded === true ? "text-green-500" : ''}
                                    title={data?.alreadyAdded && "Already Added"}>{`${data?.name} - ${data?.email}`}</span>)
                            }))} required search={true} clearable={true} placeholder={'Select an employee'} />
                            <label className="text-danger text-lg mb-1 p-0">Earnings</label>
                            <FormInput name="basic_salary" label="Basic Salary" initialValue={0}
                                onChange={calculateNetSalary} type="number" required={!required.hourly} />
                            {salarySettings?.docs?.filter(data => data?.status === true && data?.setting_type === 'addition').map(data => (
                                <FormInput onChange={calculateNetSalary} key={data?._id}
                                    name={['categories', data?._id?.toString(), 'value']}
                                    initialValue={data?.value}
                                    label={data?.title + (data?.value_type === 'percentage' ? ' (%)' : '')} />
                            ))}

                        </Col>
                        <Col md={6}>
                            <FormInput name="net_salary" initialValue={0} label="Net Salary" type="number" readOnly />
                            <label className="text-danger text-lg mb-1 mt-0.5 p-0">Deduction</label>
                            {salarySettings?.docs?.filter(data => data.status === true && data?.setting_type === 'subtraction').map(data => (
                                <FormInput key={data?._id} onChange={calculateNetSalary}
                                    name={['categories', data?._id, 'value']} initialValue={data?.value}
                                    label={data?.title + (data?.value_type === 'percentage' ? ' (%)' : '')} />
                            ))}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <div style={{display: required?.hourly ? 'none' : 'block'}}>
                                <Form.Item name="is_over_time_allow" label="Allow OverTime"
                                    valuePropName="checked">
                                    <Switch onChange={value => setRequired({...required, overTime: value})} />
                                </Form.Item>
                                <Form.Item name="absent_deduct_allow" label="Allow Absent Deduct"
                                    valuePropName="checked">
                                    <Switch onChange={value => setRequired({...required, absent: value})} />
                                </Form.Item>
                            </div>
                            <Form.Item name="hourly_basis_salary_allow" label="Allow Hourly Salary"
                                valuePropName="checked">
                                <Switch onChange={value => setRequired({...required, hourly: value})} />
                            </Form.Item>
                        </Col>
                        <Col md={6}>
                            <div style={{display: required?.hourly ? 'none' : 'block'}}>
                                <FormInput name="over_time_rate" label="OverTime Rate (Per Hour)" initialValue={0}
                                    type="number" required={required.overTime} />
                                <FormInput name="absent_deduct_rate" label="Absent Deduct Rate  (Per Day)"
                                    initialValue={0} type="number" required={required.absent} />
                            </div>
                            <FormInput name="hourly_rate" label="Hourly Rate" initialValue={0} type="number"
                                required={required.hourly} />
                        </Col>
                    </Row>
                    <Button>Submit</Button>
                </Form>
            </Modal>
        </section>
    );
};
PayrollEmployeeSalary.layout = AdminLayout;
export default PayrollEmployeeSalary;