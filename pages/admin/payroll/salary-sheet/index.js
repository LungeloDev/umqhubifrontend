import {Form, Modal} from 'antd';
import moment from 'moment';
import React from 'react';
import {useState} from 'react';
import {
    delSalarySheet,
    fetchPaySalaryElements,
    fetchSalarySheet, postPaySalary, postSalaryGenerate, postSalarySheet,
} from '../../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";
import {useRouter} from "next/router";
import Table from "../../../../components/common/table";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import FormSelect from "../../../../components/form/select";
import Card from "../../../../components/common/card";


const EmployeeSalarySheet = () => {
    const router = useRouter()
    const [form] = Form.useForm()
    const [form1] = Form.useForm()
    const [month, setMonth] = useState(moment().startOf('month'))
    const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [salaries, getSalaries, {loading, error}] = useFetch(fetchSalarySheet)
    const [max, setMax] = useState(0)
    const [elements] = useFetch(fetchPaySalaryElements)

    const statusClass = {
        Paid: 'btn-success',
        Partial: 'btn-primary',
        Unpaid: 'btn-danger'
    }

    let columns = [
        {text: 'Employee Name', dataField: 'employee', formatter: data => `${data?.first_name} ${data?.last_name}`},
        {text: 'Net Salary', dataField: 'net_salary'},
        {text: 'Absence', dataField: 'total_absence'},
        {text: 'Adjustment', dataField: 'adjustment'},
        {text: 'Advanced Salary', dataField: 'advance_salary'},
        {text: 'Payable Salary', dataField: 'total_salary'},
        {text: 'Paid', dataField: 'paid'},
        {text: 'Due', dataField: 'due', formatter: (_, data) => (data?.total_salary - data?.paid).toFixed(2)},
        {
            text: 'Status', dataField: 'payment_status', formatter: (status, data) => {
                return (
                    <div className="flex">
                        <button className={`btn btn-sm ${statusClass[status]} me-2`}>{status}</button>
                        {status === 'Paid' || (
                            <div>
                                <button className="btn btn-sm btn-info" onClick={() => {
                                    setMax(data?.total_salary - data?.paid)
                                    form1.resetFields()
                                    form1.setFieldsValue({
                                        salary_id: data?.id,
                                        amount: (data?.total_salary - data?.paid).toFixed(2)
                                    })
                                    setVisible2(true)
                                }}>Pay
                                </button>
                            </div>
                        )}
                    </div>
                )
            }
        },
    ]

    const handleGenerate = () => {
        return useAction(postSalaryGenerate, {month: month?.format('YYYY-MM-DD')}, () => {
            setVisible1(false)
            getSalaries()
        })
    }

    let action = (
        <button className="btn bg-twPrimary" onClick={() => {
            form.resetFields()
            setVisible1(true)
        }}>Generate</button>
    )

    const [account, setAccount] = useState();
    const onAccountSelect = id => {
        setAccount(elements?.accounts?.find(d => d.id === id))
    }

    return (
        <section>
            <Card className={'shadow-sm'} title={'Salary'}>
                <Table
                    columns={columns}
                    data={[
                        {
                            "_id": 2,
                            "restaurant_id": 1,
                            "manager_id": null,
                            "employee_id": 13,
                            "ref": "payslip-1000002",
                            "workable_days": 26,
                            "total_weekend": 5,
                            "total_holiday": 0,
                            "unpaid_leave": 0,
                            "paid_leave": 0,
                            "total_working_days": 1,
                            "total_absence": 26,
                            "working_on_offday": 1,
                            "schedule_time": "702000",
                            "active_time": "0",
                            "over_time": "0",
                            "remaining_time": "0",
                            "paid_hours": "0",
                            "absence_deduct_salary": "0.00",
                            "working_on_offday_salary": "461.54",
                            "over_time_salary": "0.00",
                            "advance_salary": "0.00",
                            "salary_for_working_hours": "0.00",
                            "working_days_salary": "461.54",
                            "salary_for_paid_leave": "0.00",
                            "unpaid_leave_deduct_salary": "0.00",
                            "net_salary": "12000.00",
                            "adjustment": "0.00",
                            "is_adjustment_deduct": 0,
                            "adjustment_notes": null,
                            "bonus": "0.00",
                            "total_salary": "923.08",
                            "total_payable_salary": "923.08",
                            "paid": "0.00",
                            "payment_status": "Unpaid",
                            "salary_for": "2023-03-01",
                            "generate_date": "2023-03-31",
                            "generate_by": null,
                            "created_at": "2023-03-31T15:34:31.000000Z",
                            "updated_at": "2023-03-31T15:34:31.000000Z",
                            "employee": {
                                "id": 13,
                                "employee_number": "123",
                                "first_name": "Sabbir",
                                "last_name": "Ahmmed",
                                "email": "sabbir.py@gmail.com",
                                "phone": "+8801725151578",
                                "joining_date": "2022-07-02",
                                "designation_id": 8,
                                "designation": {
                                    "id": 8,
                                    "restaurant_id": 1,
                                    "department_id": 1,
                                    "name": "software-eng",
                                    "app_module": null,
                                    "created_at": "2022-12-06T11:23:16.000000Z",
                                    "updated_at": "2022-12-06T11:23:16.000000Z"
                                }
                            }
                        },
                        {
                            "_id": 1,
                            "restaurant_id": 1,
                            "manager_id": null,
                            "employee_id": 10,
                            "ref": "payslip-1000001",
                            "workable_days": 27,
                            "total_weekend": 4,
                            "total_holiday": 0,
                            "unpaid_leave": 0,
                            "paid_leave": 0,
                            "total_working_days": 0,
                            "total_absence": 27,
                            "working_on_offday": 0,
                            "schedule_time": "729000",
                            "active_time": "0",
                            "over_time": "0",
                            "remaining_time": "0",
                            "paid_hours": "0",
                            "absence_deduct_salary": "0.00",
                            "working_on_offday_salary": "0.00",
                            "over_time_salary": "0.00",
                            "advance_salary": "0.00",
                            "salary_for_working_hours": "0.00",
                            "working_days_salary": "0.00",
                            "salary_for_paid_leave": "0.00",
                            "unpaid_leave_deduct_salary": "0.00",
                            "net_salary": "15000.00",
                            "adjustment": "0.00",
                            "is_adjustment_deduct": 0,
                            "adjustment_notes": null,
                            "bonus": "0.00",
                            "total_salary": "0.00",
                            "total_payable_salary": "0.00",
                            "paid": "0.00",
                            "payment_status": "Unpaid",
                            "salary_for": "2023-03-01",
                            "generate_date": "2023-03-31",
                            "generate_by": null,
                            "created_at": "2023-03-31T15:34:31.000000Z",
                            "updated_at": "2023-03-31T15:34:31.000000Z",
                            "employee": {
                                "id": 10,
                                "employee_number": "25",
                                "first_name": "Chef",
                                "last_name": "000",
                                "email": "abrarfahim.pro0@gmail.com",
                                "phone": "+8801956151101",
                                "joining_date": "2022-05-31",
                                "designation_id": 6,
                                "designation": {
                                    "id": 6,
                                    "restaurant_id": 1,
                                    "department_id": 4,
                                    "name": "chef",
                                    "app_module": "chef",
                                    "created_at": "2022-06-06T21:56:34.000000Z",
                                    "updated_at": "2022-06-06T21:56:34.000000Z"
                                }
                            }
                        }
                    ]}
                    pagination={false}
                    noActions={false}
                    action={action}
                    indexed={true}
                    shadow={false}
                    onEdit={(data) => {
                        form.resetFields()
                        form.setFieldsValue({
                            ...data,
                            salary: data.net_salary
                        })
                        setVisible(true)
                    }}
                    onDelete={delSalarySheet}
                    onReload={getSalaries}
                    error={error}
                    loading={loading}
                    onView={data => router.push('/admin/payroll/salary-sheet/view?_id=' + data._id)}
                />
            </Card>

            <Modal title={`Pay Salary`} visible={visible2} onCancel={() => setVisible2(false)} destroyOnClose
                   footer={null}>
                <Form form={form1} layout="vertical" onFinish={(values) => {
                    return useAction(postPaySalary, values, () => {
                        getSalaries()
                        setVisible2(false)
                    })
                }}>
                    <HiddenFormItem name="salary_id"/>
                    <FormSelect name="account_id" label="Account" onSelect={onAccountSelect}
                                options={elements?.accounts?.map(d => ({label: d.name, value: d.id}))} required/>
                    <FormSelect name="category_id" label="Expense Category"
                                options={elements?.categories?.map(d => ({label: d.name, value: d.id}))} required/>
                    <FormInput
                        name="amount"
                        label="Amount"
                        type="number"
                        rules={[
                            () => ({
                                validator(_, value) {
                                    if (value && +value < 1) {
                                        return Promise.reject(new Error('Please enter a amount!'));
                                    }
                                    if (value && +value > +max) {
                                        return Promise.reject(new Error('Employee have only ' + max.toFixed(2) + ' payable amount!'));
                                    }
                                    if (value && account && +value > +account?.balance) {
                                        return Promise.reject(new Error('You have only ' + account?.balance + ' in this account!'));
                                    }
                                    return Promise.resolve();
                                },
                            })
                        ]}
                        required/>
                    <FormSelect name="payment_method" label="Payment Method" options={[{label: 'Cash', value: 'Cash'}, {
                        label: 'Bank Transfer',
                        value: 'Bank Transfer'
                    }]} required/>
                    <Form.Item name="notes" label="Notes" initialValue="">
                        <textarea className="form-control"/>
                    </Form.Item>
                    <div className="text-right">
                        <button className="btn btn-primary">Pay</button>
                    </div>
                </Form>
            </Modal>

            <Modal title={`Generate Salary Sheet`} visible={visible1} onCancel={() => setVisible1(false)} destroyOnClose
                   footer={null}>
                <div className="">
                    <label className="text-lg mb-3">Select Month</label>
                    <div className="flex">
                        <div
                            onClick={() => setMonth(moment().startOf('month').add('month', -1))}
                            className={`btn ${month.isSame(moment().startOf('month').add('month', -1)) ? 'btn-danger' : 'btn-outline-secondary'}  mr-3`}>
                            {moment().startOf('month').add('month', -1).format('MMMM')}
                        </div>
                        <div
                            onClick={() => setMonth(moment().startOf('month'))}
                            className={`btn ${month.isSame(moment().startOf('month')) ? 'btn-danger' : 'btn-outline-secondary'}  mr-3`}>
                            {moment().startOf('month').format('MMMM')}
                        </div>
                    </div>
                    <div className="text-right">
                        <button className="btn btn-primary" onClick={handleGenerate}>Generate</button>
                    </div>
                </div>
            </Modal>

            <Modal title={`Adjustment`} visible={visible} onCancel={() => setVisible(false)} destroyOnClose
                   footer={null}>
                <div className="">
                    <Form form={form} layout="vertical" onFinish={(values) => {
                        return useAction(postSalarySheet, {
                            id: values.id,
                            adjustment: values.adjustment,
                            adjustment_notes: values.adjustment_notes,
                            restaurant_id: localStorage.getItem('currentRestaurant'),
                        }, () => {
                            getSalaries()
                            setVisible(false)
                        })
                    }}>
                        <HiddenFormItem name="id"/>
                        <HiddenFormItem name="employee"/>
                        <HiddenFormItem name="net_salary"/>
                        <HiddenFormItem name="salary"/>
                        <Form.Item className="mb-0" shouldUpdate>
                            {() => {
                                let data = form.getFieldsValue()
                                return (
                                    <>
                                        <p className="text-base mb-1">Name: &nbsp;
                                            <b>{data?.employee?.first_name} {data?.employee?.last_name}</b></p>
                                        <p className="text-base">Salary: &nbsp;<b>{data?.salary}</b></p>
                                    </>
                                )
                            }}
                        </Form.Item>
                        <FormInput label="Adjustment" type="number" onChange={e => {
                            let salary = +form.getFieldValue('net_salary')
                            form.setFieldsValue({salary: salary + +e.target.value})
                        }} initialValue={0} name="adjustment" required/>
                        <Form.Item name="adjustment_notes" label="Notes"
                                   rules={[{required: true, message: 'Please provide adjustment reason'}]}>
                            <textarea className="form-control"/>
                        </Form.Item>
                        <button className="btn btn-primary mt-1">Save</button>
                    </Form>
                </div>
            </Modal>
        </section>
    );
};
EmployeeSalarySheet.layout = AdminLayout
export default EmployeeSalarySheet;