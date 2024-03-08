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
import { fetchUsersElement, fetchUsersReport } from '../../../../helpers/backend_helper';
import { useFetch } from '../../../../helpers/hooks';
import {havePermission} from "../../../../layouts/user";
import AdminLayout from "../../../../layouts/admin";


const UserReport = () => {
    const site = useSite();
    const i18n = useI18n();
    const [elements] = useFetch(fetchUsersElement);
    const [report, getReport, {loading, error}] = useFetch(fetchUsersReport, {}, false);

    const [shop, setShop] = useState();
    const [date, setDate] = useState();

    const user = useUserContext();
    const manager = havePermission('purchase_management', user?.permission);
    const admin = havePermission('site_admin', user?.permission);

    let columns = [
        {text: 'Date', dataField: 'date'},
        {text: 'Name', dataField: 'name'},
        {text: 'Email', dataField: 'email'},
        {text: 'Phone', dataField: 'phone'},
        {text: 'Trips Taken', dataField: 'trips_completed'},
        {text: 'Total Spend', dataField: 'total_spend'},
        {text: 'Verified', dataField: 'verified'},
    ]

    return (
        <div>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>Users Report</title>
                </Head>
                <div className='card_container'>
                    <ReportTable
                        action={(
                            <Form layout="vertical" className="w-full" onFinish={values => {
                                getReport({
                                    verified: values.verified,
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
                                    <Col md={3}>
                                        <FormSelect
                                            label="Verified"
                                            name="verified"
                                            placeholder='Select status'
                                            options={[
                                                { label: 'Active', value: true },
                                                { label: 'Inactive', value: false },
                                            ]} clearable />
                                    </Col>
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
                                        <td colSpan={7} style={{ textAlign: "right", paddingRight: 20 }}>Total</td>
                                        <td>$ {report?.reduce((acc, d) => acc + (d?.total_spend || 0), 0)?.toFixed(2)}</td>
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
UserReport.layout = AdminLayout
export default UserReport;