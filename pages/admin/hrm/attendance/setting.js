import { Form, TimePicker, Select } from 'antd';
import moment from 'moment';
import Head from 'next/head';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaRegCheckSquare } from 'react-icons/fa';
import Button from '../../../../components/common/button';
import { HiddenFormItem } from '../../../../components/form/input';
import { useI18n } from '../../../../contexts/i18n';
import { useSite } from '../../../../contexts/site';
import { fetchAttendanceSettings, postAttendanceSettings } from '../../../../helpers/backend_helper';
import { useFetch, useAction } from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";


const EmployeeAttendanceSetting = () => {
    const site = useSite();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [attendanceSetting, getAttendanceSetting, { loading, error }] = useFetch(fetchAttendanceSettings);
    const [selectedWeekend, setSelectedWeekend] = useState();

    const options = [];
    const weekends = ['Saturdays', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (let i = 0; i < weekends.length; i++) {
        options.push({
            value: weekends[i],
            label: weekends[i],
        });
    }

    const handleChange = (value) => {
        setSelectedWeekend(value);
    };

    useEffect(() => {
        if (attendanceSetting?._id) {
            form.setFieldsValue({
                ...attendanceSetting,
                start_work: moment(attendanceSetting?.start_work),
                end_work: moment(attendanceSetting?.end_work),
                start_break: moment(attendanceSetting?.start_break),
                end_break: moment(attendanceSetting?.end_break),
            })
        }
    }, [attendanceSetting?._id])


    return (
        <main>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>{site?.site_name} | Attendance Setting</title>
                </Head>
                <div className='card_container'>
                    <div className='md:p-10 bg-white rounded-md'>
                        <p className='text-gray-700 font-medium text-[18px] mb-6 md:mb-10 flex items-center gap-2'> <FaRegCheckSquare className='text-main' /> {!!i18n && i18n?.t("Attendance Setting")} </p>
                        <Form
                            form={form}
                            layout='vertical'
                            name='attendance_setting'
                            onFinish={(values) => {
                                values.start_work = moment(values.start_work).format();
                                values.end_work = moment(values.end_work).format();
                                values.start_break = moment(values.start_break).format();
                                values.end_break = moment(values.end_break).format();
                                values.weekends = selectedWeekend;
                                return useAction(postAttendanceSettings, values, () => {
                                    getAttendanceSetting()
                                });
                            }}
                        >
                            <HiddenFormItem name='_id' />
                            <Row>
                                <Col md={6}>
                                    <Form.Item name='start_work' label='Start Work' rules={[{ required: true }]} >
                                        <TimePicker use12Hours format="h:mm a" style={{ width: '100%', height: '40px', borderRadius: '10px' }} />
                                    </Form.Item>
                                </Col>
                                <Col md={6}>
                                    <Form.Item name='end_work' label='End Work' rules={[{ required: true }]} >
                                        <TimePicker use12Hours format="h:mm a" style={{ width: '100%', height: '40px', borderRadius: '10px' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Item name='start_break' label='Start Break' rules={[{ required: true }]} >
                                        <TimePicker use12Hours format="h:mm a" style={{ width: '100%', height: '40px', borderRadius: '10px' }} />
                                    </Form.Item>
                                </Col>
                                <Col md={6}>
                                    <Form.Item name='end_break' label='End Break' rules={[{ required: true }]} >
                                        <TimePicker use12Hours format="h:mm a" style={{ width: '100%', height: '40px', borderRadius: '10px' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name='weekends' label='Weekends' rules={[{ required: true }]}  >
                                <Select
                                    mode="tags"
                                    onChange={handleChange}
                                    className='attendance_setting'
                                    tokenSeparators={[',']}
                                    options={options}
                                    placeholder='Select Weekends'
                                />
                            </Form.Item>

                            <div className='mt-5'>
                                <Button>Submit</Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </section>
        </main>
    );
};
EmployeeAttendanceSetting.layout = AdminLayout
export default EmployeeAttendanceSetting;