import React, {useState} from 'react';
import AdminLayout from "../../../../layouts/admin";
import {useUserContext} from "../../../../contexts/user";
import {useRouter} from "next/router";
import {useAction, useActionConfirm, useFetch} from "../../../../helpers/hooks";
import {fetchPaySalaryElements, fetchPayslip, postPaySalary} from "../../../../helpers/backend_helper";
import {Form} from "antd";
import {Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row, Table} from "reactstrap";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import FormSelect from "../../../../components/form/select";
import moment from "moment";

const PayrollSalaryDetails = () => {
    const user = useUserContext()
    const router = useRouter()
    const {_id} = router.query || {}
    const [slip, getSlip] = useFetch(fetchPayslip, {_id})
    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)
    const [elements] = useFetch(fetchPaySalaryElements)

    return (
        <div>
            <Row>
                <Col lg="12">
                    <Card>
                        <CardBody>
                            <div className="flex justify-between">
                                <h4 className="font-size-16">
                                    Payslip for the month
                                    of {moment(slip?.salary?.salary_for, 'YYYY-MM-DD').format('MMMM YY')}
                                </h4>
                                <h4 className="font-size-16">
                                    # {slip?.salary.ref}
                                </h4>
                            </div>
                            <hr/>
                            <Row>
                                <Col xs="6">
                                    <address>
                                        <div className="mb-4">
                                            <img src={slip?.restaurant?.restaurant_image?.image} style={{height: 64}}
                                                 alt=""/>
                                            <strong className="text-lg mt-1 block">{slip?.restaurant?.name}</strong>
                                            <span
                                                className="font-medium">{slip?.restaurant?.address}<br/>{slip?.restaurant?.city}, &nbsp;
                                                {slip?.restaurant?.state}, &nbsp;
                                                {slip?.restaurant?.country}
                                            </span>
                                        </div>
                                    </address>
                                </Col>
                                <Col xs="6" className="text-end">
                                    <address>
                                        <strong
                                            className="text-lg">{slip?.salary?.employee?.first_name} {slip?.salary?.employee?.last_name}</strong>
                                        <br/>
                                        <span
                                            className="font-medium text-base">{slip?.salary?.employee?.designation?.name}</span><br/>
                                        <span className="font-medium">
                                            Employee ID: {slip?.salary?.employee?.employee_number} <br/>
                                            Joining Date: {slip?.salary?.employee?.joining_date}
                                        </span>
                                    </address>
                                </Col>
                            </Row>

                            {slip?.employee_salary_settings?.hourly_basis_salary_allow === 1 ? (
                                <>
                                    <h3 className="font-size-15 fw-bold bg-info px-2 py-1 text-white">Earnings</h3>
                                    <ul className="border-1 border-gray-300 text-sm font-medium p-0">
                                        <li className="flex justify-between px-2 py-2">
                                            <span>Hourly</span>
                                            <span>{slip?.employee_salary_settings?.hourly_rate}</span>
                                        </li>
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <Row>
                                        <Col md={6}>
                                            <h3 className="font-size-15 fw-bold bg-info px-2 py-1 text-white">Earnings</h3>
                                            <ul className="border-1 border-gray-300 text-sm font-medium p-0">
                                                <li className="flex justify-between px-2 py-2">
                                                    <span>Basic</span>
                                                    <span>{slip?.employee_salary_settings?.net_salary}</span>
                                                </li>
                                                {slip?.employee_salary_settings?.is_over_time_allow === 1 && (
                                                    <li className="flex justify-between px-2 py-2 border-t border-gray-300">
                                                        <span>Over Time Rate</span>
                                                        <span>{slip?.employee_salary_settings?.over_time_rate} /hr</span>
                                                    </li>
                                                )}
                                                {slip?.employee_salary_settings?.categories?.filter(category => category?.settings?.type === 'Addition')?.map((category, index) => (
                                                    <li className="flex justify-between px-2 py-2 border-t border-gray-300" key={index}>
                                                        <span>{category?.settings?.title}</span>
                                                        <span>{category?.value}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Col>
                                        <Col md={6}>
                                            <h3 className="font-size-15 fw-bold bg-warning px-2 py-1 text-white">Deductions</h3>
                                            <ul className="border-1 border-gray-300 text-sm font-medium p-0">
                                                {slip?.employee_salary_settings?.categories?.filter(category => category?.settings?.type === 'Subtraction')?.map((category, index) => (
                                                    <li key={index}
                                                        className={`flex justify-between px-2 py-2 ${index > 0 ? 'border-t' : ''} border-gray-300`}>
                                                        <span>{category?.settings?.title}</span>
                                                        <span>{category?.value}</span>
                                                    </li>
                                                ))}
                                                {slip?.employee_salary_settings?.absent_deduct_allow === 1 && (
                                                    <li className="flex justify-between px-2 py-2 border-t border-gray-300">
                                                        <span>Absence Deduction Rate</span>
                                                        <span>{slip?.employee_salary_settings?.absent_deduct_rate} /day</span>
                                                    </li>
                                                )}
                                            </ul>
                                        </Col>
                                    </Row>
                                </>
                            )}

                            {slip?.employee_salary_settings?.hourly_basis_salary_allow === 1 || (
                                <>
                                    <div className="py-2 mt-1">
                                        <h3 className="font-size-15 fw-bold bg-info px-2 py-1 text-white">Working
                                            History</h3>
                                    </div>
                                    <Row>
                                        <Col md={6}>
                                            <ul className="border-1 border-gray-300 text-sm font-medium p-0">
                                                <li className="flex justify-between px-2 py-2">
                                                    <span>Working Days</span>
                                                    <span>{slip?.salary?.workable_days}</span>
                                                </li>
                                                <li className="flex justify-between px-2 py-2 border-t border-gray-300">
                                                    <span>Present</span>
                                                    <span>{(slip?.salary?.workable_days - slip?.salary?.total_absence) || 0}</span>
                                                </li>
                                                <li className="flex justify-between px-2 py-2 border-t border-gray-300">
                                                    <span>Absence</span>
                                                    <span>{slip?.salary?.total_absence}</span>
                                                </li>
                                                <li className="flex justify-between px-2 py-2 border-t border-gray-300">
                                                    <span>Working on Off Day</span>
                                                    <span>{slip?.salary?.working_on_offday}</span>
                                                </li>
                                            </ul>
                                        </Col>
                                        <Col md={6}>
                                            <ul className="border-1 border-gray-300 text-sm font-medium p-0">
                                                <li className="flex justify-between px-2 py-2">
                                                    <span>Schedule Time</span>
                                                    <span>{getTimeFormat(+slip?.salary?.schedule_time)} hr</span>
                                                </li>
                                                <li className="flex justify-between px-2 py-2 border-t border-gray-300">
                                                    <span>Working Time</span>
                                                    <span>{getTimeFormat(+slip?.salary?.active_time)} hr</span>
                                                </li>
                                                <li className="flex justify-between px-2 py-2 border-t border-gray-300">
                                                    <span>Late Time</span>
                                                    <span>{getTimeFormat(+slip?.salary?.remaining_time)} hr</span>
                                                </li>
                                                <li className="flex justify-between px-2 py-2 border-t border-gray-300">
                                                    <span>Over Time</span>
                                                    <span>{getTimeFormat(+slip?.salary?.over_time)} hr</span>
                                                </li>
                                            </ul>
                                        </Col>
                                    </Row>
                                </>
                            )}
                            <div className="py-2 mt-1">
                                <h3 className="font-size-15 fw-bold bg-info px-2 py-1 text-white">Salary</h3>
                            </div>
                            <div className="table-responsive">
                                <Table className="table-nowrap">
                                    <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th className="text-end">Amount</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Monthly Salary</td>
                                        <td className="text-end">{slip?.salary?.salary_for_working_hours}</td>
                                    </tr>
                                    {slip?.employee_salary_settings?.hourly_basis_salary_allow === 0 && (
                                        <>
                                            {slip?.employee_salary_settings?.is_over_time_allow === 1 && (
                                                <tr>
                                                    <td>Overtime Salary</td>
                                                    <td className="text-end">{slip?.salary?.over_time_salary}</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td>Off Day Working Salary</td>
                                                <td className="text-end">{slip?.salary?.working_on_offday_salary}</td>
                                            </tr>
                                            <tr>
                                                <td>Absent Deduct</td>
                                                <td className="text-end text-danger">{slip?.salary?.absence_deduct_salary}</td>
                                            </tr>
                                        </>
                                    )}
                                    <tr>
                                        <td className="border-0 text-end">
                                            <strong>Total</strong>
                                        </td>
                                        <td className="border-0 text-end">
                                            <h4 className="m-0">
                                                {slip?.salary?.total_salary}
                                            </h4>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </div>
                            <div className="py-2 mt-1">
                                <h3 className="font-size-15 fw-bold bg-info px-2 py-1 text-white">Payments</h3>
                            </div>
                            <div className="table-responsive">
                                <Table className="table-nowrap">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th className="d-print-none">Account</th>
                                        <th>Paid By</th>
                                        <th>Payment Method</th>
                                        <th className="text-end">Amount</th>
                                        <th className="text-end d-print-none">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {slip?.salary?.payments?.map((payment, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{payment?.date}</td>
                                            <td className="d-print-none">{payment?.account?.name}</td>
                                            <td>{payment?.manager?.first_name} {payment?.manager?.last_name}</td>
                                            <td>{payment?.payment_method}</td>
                                            <td className="text-end">{payment?.amount}</td>
                                            <td className="text-end d-print-none">
                                                <div>
                                                    <button className="btn btn-outline-primary btn-sm edit me-2"
                                                            title="Edit" onClick={() => {
                                                        form.setFieldsValue(payment)
                                                        setVisible(true)
                                                    }}>
                                                        <i className="fas fa-pencil-alt" title="View"/>
                                                    </button>
                                                    <button className="btn btn-outline-danger btn-sm edit me-2"
                                                            title="Delete" onClick={async () => {
                                                         await useActionConfirm(
                                                            onDelete,
                                                            {
                                                                restaurant_id: localStorage.getItem('currentRestaurant'),
                                                                id: data.id
                                                            },
                                                            getSlip, 'Are you sure you want to delete this item?', 'Yes, Delete')
                                                    }}><i className="fas fa-trash-alt" title="Delete"/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                            <Modal isOpen={visible} toggle={() => setVisible(false)}>
                                <ModalHeader
                                    className="p-3"
                                    close={(
                                        <button type="button" className="close" onClick={() => setVisible(false)} aria-label="Close"
                                                style={{padding: 28}}>
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    )}>
                                    Pay Salary
                                </ModalHeader>
                                <ModalBody className="p-4">
                                    <Form form={form} layout="vertical" onFinish={(values) => {
                                        return useAction(postPaySalary, values, () => {
                                            getSlip()
                                            setVisible(false)
                                        })
                                    }}>
                                        <HiddenFormItem name="id"/>
                                        <HiddenFormItem name="salary_id"/>
                                        <FormSelect name="account_id" label="Account" disabled options={elements?.accounts?.map(d => ({label: d.name, value: d.id}))} required/>
                                        <FormSelect name="category_id" label="Expense Category" options={elements?.categories?.map(d => ({label: d.name, value: d.id}))} required/>
                                        <FormInput
                                            name="amount"
                                            label="Amount"
                                            type="number"
                                            rules={[
                                                () => ({
                                                    validator(_, value) {
                                                        if(value && +value < 1) {
                                                            return Promise.reject(new Error('Please enter a amount!'));
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                })
                                            ]}
                                            required/>
                                        <FormSelect name="payment_method" label="Payment Method" options={[{label: 'Cash', value: 'Cash'}, {label: 'Bank Transfer', value: 'Bank Transfer'}]}/>
                                        <Form.Item name="notes" label="Notes" initialValue="">
                                            <textarea className="form-control"/>
                                        </Form.Item>
                                        <div className="text-right">
                                            <button className="btn btn-primary">Update</button>
                                        </div>
                                    </Form>
                                </ModalBody>
                            </Modal>
                            <div className="d-print-none">
                                <div className="float-end">
                                    <button className="btn btn-primary" onClick={() => window.print()}>Print</button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
PayrollSalaryDetails.layout = AdminLayout
export default PayrollSalaryDetails;

const getTimeFormat = seconds => {
    return seconds > 0 ? `${(seconds / 3600).toFixed(0)}.${((seconds / 60 >> 0) % 60).toString().padStart(2, '0')}` : '0.00'
}