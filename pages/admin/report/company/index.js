import { Form } from 'antd';
import moment from 'moment';
import Head from 'next/head';
import React from 'react';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from '../../../../components/common/button';
import ReportTable from '../../../../components/common/report';
import DateRangePicker from '../../../../components/form/date-range';
import FormSelect from '../../../../components/form/select';
import { useI18n } from '../../../../contexts/i18n';
import { useSite } from '../../../../contexts/site';
import { useUserContext } from '../../../../contexts/user';
import {fetchCompanyReport, fetchUsersElement} from '../../../../helpers/backend_helper';
import { useFetch } from '../../../../helpers/hooks';
import {havePermission} from "../../../../layouts/user";
import AdminLayout from "../../../../layouts/admin";


const CompanyReport = () => {
    const site = useSite();
    const i18n = useI18n();
    const [elements] = useFetch(fetchUsersElement);
    const [report, getReport, {loading, error}] = useFetch(fetchCompanyReport, {}, false);

    const [shop, setShop] = useState();
    const [date, setDate] = useState();

    const user = useUserContext();
    const manager = havePermission('purchase_management', user?.permission);
    const admin = havePermission('site_admin', user?.permission);

    let columns = [
        {text: 'User registered', dataField: 'new_user'},
        {text: 'Driver registered', dataField: 'new_driver'},
        {text: 'Vehicle Added', dataField: 'new_vehicle'},
        {text: 'Payment Received', dataField: 'payment_received'},
        {text: 'Withdraw Received', dataField: 'withdraw_received'},
        {text: 'Company Revenue', dataField: 'company_revenue'},
    ]

    return (
        <div>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>Drivers Report</title>
                </Head>
                <div className='card_container'>
                    <ReportTable
                        action={(
                            <Form layout="vertical" className="w-full" onFinish={values => {
                                getReport({
                                    verified: values.verified = true,
                                    start: values.date.start?.startOf('day').toISOString(),
                                    end: values.date.end?.endOf('day').toISOString()
                                })
                            }}>
                                <Row>
                                    {elements?.shops?.length > 0 && (
                                        <Col md={3}>
                                            <FormSelect label="Shop" name="shop" options={elements?.shops}
                                                        onSelect={value => setShop(elements?.shops?.find(d => d._id === value))}
                                                        clearable />
                                        </Col>
                                    )}
                                    {elements?.companies?.length > 0 && (
                                        <Col md={3}>
                                            <FormSelect label="Company" name="company" options={elements?.companies}
                                                        onSelect={value => setShop(elements?.companies?.find(d => d._id === value))}
                                                        clearable />
                                        </Col>
                                    )}
                                    <Col md={4}>
                                        <Form.Item
                                            name="date"
                                            initialValue={{
                                                start: moment(),
                                                end: moment()
                                            }} label={"Date"}
                                            rules={[
                                                { required: true, message: 'Please select date' },
                                            ]}>
                                            <DateRangePicker left={true} onChange={setDate} />
                                        </Form.Item>
                                    </Col>
                                    <Col md={2} className="pt-7">
                                        <Button>Get Report</Button>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                        columns={columns}
                        data={(report || [])?.map(d => ({
                            ...d,
                            date: moment(d.date).format('Do MMM, YYYY hh:mm A'),
                            total: `$${d.total?.toFixed(2)}`,
                            credit_charge: d.method === 'credit' ? `$${d.credit_charge?.toFixed(2)}` : '-',
                            price: `$${d.price?.toFixed(2)}`,
                            total_fee: `$${(d.total_fee || 0)?.toFixed(2)}`,
                        }))}
                        loading={loading}
                        title="Users Report"
                        subtitle={`Company: ${site?.site_name || ''}`}
                        customRows={(
                            <>
                                {report && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "right", paddingRight: 20 }}>Company Revenue</td>
                                        <td>{site?.currency_code} {report?.reduce((acc, d) => acc + (d?.company_revenue || 0), 0)?.toFixed(2)}</td>
                                    </tr>
                                )}
                            </>
                        )}
                        date={date}
                        error={error}
                    />
                </div>
            </section>
        </div>
    );
};
CompanyReport.layout = AdminLayout
export default CompanyReport;