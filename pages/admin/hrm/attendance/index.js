import Head from 'next/head';
import React, {useEffect} from 'react';
import {Col, Row} from 'react-bootstrap';
import Button from '../../../../components/common/button';
import Table from '../../../../components/common/table';
import {useSite} from '../../../../contexts/site';
import {delAttendance, fetchAttendance, fetchAttendancePunch, fetchEmployee, fetchPunchInOut, postAttendance} from '../../../../helpers/backend_helper';
import {useFetch, useAction} from '../../../../helpers/hooks';
import {DatePicker, Form, Modal, Tabs, TimePicker, Select} from 'antd';
import FormInput, {HiddenFormItem} from '../../../../components/form/input';
import {useState} from 'react';
import {useRouter} from 'next/router';
import FormSelect from '../../../../components/form/select';
import moment from 'moment';
import {MdOutlinePlayCircleFilled, MdOutlineStopCircle} from 'react-icons/md';
import {getTimeFormat} from '../../../../components/common/utilities';
import AdminLayout from "../../../../layouts/admin";
import {useI18n} from '../../../../contexts/i18n';
const {RangePicker} = DatePicker;
const {Option} = Select;

function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
}

const EmployeeAttendance = () => {
    const site = useSite();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const router = useRouter();
    const [attendances, getAttendances, {loading, error}] = useFetch(fetchAttendance);
    const [employees, getEmployees] = useFetch(fetchEmployee);
    const [employeesPunched, getEmployeesPunched] = useFetch(fetchAttendancePunch);
    const [punchInOut, getPunchInOut] = useFetch(fetchPunchInOut);
    const [handleEmployeeSelectId, setHandleEmployeeSelectId] = useState()
    const [startEndTime, setStartEndTime] = useState()
    const [punchData, setPunchData] = useState()
    const [punchToggle, setPunchToggle] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    useEffect(() => {
        const restaurantData = localStorage.getItem('pickgo_restaurant') ?? '';
        getAttendances({restaurant: restaurantData})
    }, [])

    let columns = [
        {
            dataField: 'employee', text: 'Employee Name',
            formatter: employee => <span className=''>{employee}</span>
        },
        {
            dataField: 'date', text: 'Date',
            formatter: date => <span className='capitalize'>{moment(date).format('ll')}</span>
        },
        {
            dataField: 'start_time', text: 'Clock In',
            formatter: start_time => <span className=''>{moment(start_time).format('LT')}</span>
        },
        {
            dataField: 'end_time', text: 'Clock Out',
            formatter: end_time => <span className=''>{end_time && moment(end_time).format('LT')}</span>
        },
        {
            dataField: 'active_time', text: 'Active Time',
            formatter: active_time => <span className=''>{
                getTimeFormat(active_time)
            } {active_time && "h"}</span>
        },
        {
            dataField: 'total_break_time', text: 'Break Time',
            formatter: total_break_time => <span className=''>{
                getTimeFormat(total_break_time)
            } {total_break_time && "h"}</span>
        },
    ];

    // modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const handleDate = (e) => {
        if (!!e) {
            const start_time = moment(e[0]).format();
            const end_time = moment(e[1]).format();
            setStartEndTime({start_time, end_time});
            getAttendances({start_time, end_time})
        }
        setStartEndTime(undefined)
        getAttendances({start_time: undefined, end_time: undefined})
    }
    const handleEmployeeSelect = (e) => {
        getAttendances({employee_key: e, ...startEndTime})
    }

    const handlePunch = (data) => {
        setIsModalVisible(true);
        setPunchData(data);
        setPunchToggle(true);
    }


    let action = (
        <div className="">
            <Row>
                <Col md={4}>
                    <RangePicker onChange={handleDate} style={{width: '100%', height: '36px', borderRadius: '10px'}} />
                </Col>
                <Col md={4}>
                    <Select
                        showSearch
                        className='attendances_main'
                        style={{width: '100%', height: '36px', borderRadius: '10px'}}
                        placeholder="Select Employee"
                        optionFilterProp="children"
                        onChange={handleEmployeeSelect}
                        allowClear
                    >
                        {
                            employees?.docs?.map((emp, ind) => <Option value={emp?.key} key={emp?.key}>{emp?.name}</Option>)
                        }
                    </Select>
                </Col>
                <Col md={4}>
                    <Button
                        className="mr-2"
                        onClick={() => {
                            setHandleEmployeeSelectId(undefined)
                            form.resetFields();
                            setIsEdit(false)
                            setIsModalVisible(true);
                        }}>{!!i18n && i18n?.t("Add Attendance")}</Button>
                </Col>
            </Row>
        </div>)


    return (
        <div>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>{capitalizeFirstLetter(site?.site_name)} | Attendance</title>
                </Head>
                <div className='card_container'>
                    <Row>
                        {/* attendance data show into table */}
                        <Col md={8} >
                            <Table
                                columns={columns}
                                data={attendances}
                                pagination={true}
                                noActions={false}
                                action={action}
                                indexed={true}
                                shadow={false}
                                onEdit={(data) => {
                                    setHandleEmployeeSelectId(undefined)
                                    form.resetFields();
                                    form.setFieldsValue({
                                        ...data,
                                        date: moment(data?.date),
                                        time: [moment(data?.start_time), moment(data?.end_time)],
                                    });
                                    setIsEdit(true)
                                    setPunchToggle(false)
                                    setIsModalVisible(true);
                                }}
                                onDelete={delAttendance}
                                onReload={getAttendances}
                                error={error}
                                loading={loading}
                            />
                        </Col>

                        <Col md={4} >
                            <div className='mx-2 p-4 bg-white'>
                                <p className='font-medium text-gray-600'>Today&apos;s Attendance</p>
                                {/* all employee list for clock in/out */}
                                <Tabs defaultActiveKey="1" centered>
                                    <Tabs.TabPane tab={`All (${employeesPunched?.docs?.length || 0})`} key="1">

                                        {
                                            employeesPunched?.docs?.map(d =>
                                                <div key={d?._id} className="border-b hover:bg-gray-50 p-2 mb-2 rounded-md">
                                                    <Row>
                                                        <Col md={8}>
                                                            <span className='text-[14px] capitalize whitespace-pre text-gray-700 font-medium'>{d?.employee}</span>
                                                            <span className='block capitalize text-gray-500 whitespace-pre'>
                                                                {
                                                                    (d?.end_time && d?.start_time) ?
                                                                        `Out - ${moment(d?.end_time).calendar()}`
                                                                        :
                                                                        `In - ${moment(d?.start_time).calendar()}`
                                                                }
                                                            </span>
                                                        </Col>
                                                        <Col md={4}>
                                                            <span className='flex items-center justify-center'>
                                                                {
                                                                    ((d?.end_time && d?.start_time) || (!d?.attendance_id && !d?.end_time)) ?
                                                                        <MdOutlinePlayCircleFilled onClick={() => handlePunch(d)} size={23} className='cursor-pointer shadow-md hover:shadow-lg rounded-full text-green-600' title="Punch In" />
                                                                        :
                                                                        <MdOutlineStopCircle onClick={() => handlePunch(d)} size={23} className='cursor-pointer shadow-md rounded-full text-red-600' title="Punch Out" />
                                                                }
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        }
                                    </Tabs.TabPane>

                                    {/* // all employee list for clock in */}
                                    <Tabs.TabPane tab={`In (${punchInOut?.totalIn || 0})`} key="2">
                                        {
                                            punchInOut?.punchIn?.map(d =>
                                                <div key={d?._id} className="border-b hover:bg-gray-50 p-2 mb-2 rounded-md">
                                                    <Row>
                                                        <Col md={8}>
                                                            <span className='text-[14px] capitalize whitespace-pre text-gray-700 font-medium'>{d?.employee}</span>
                                                            <span className='block capitalize text-gray-500 whitespace-pre'>
                                                                {
                                                                    (d?.end_time && d?.start_time) ?
                                                                        `Out - ${moment(d?.end_time).calendar()}`
                                                                        :
                                                                        `In - ${moment(d?.start_time).calendar()}`
                                                                }
                                                            </span>
                                                        </Col>
                                                        <Col md={4}>
                                                            <span className='flex items-center justify-center'>
                                                                {
                                                                    ((d?.end_time && d?.start_time) || (!d?.attendance_id && !d?.end_time)) ?
                                                                        <MdOutlinePlayCircleFilled onClick={() => handlePunch(d)} size={23} className='cursor-pointer shadow-md hover:shadow-lg rounded-full text-green-600' title="Punch In" />
                                                                        :
                                                                        <MdOutlineStopCircle onClick={() => handlePunch(d)} size={23} className='cursor-pointer shadow-md rounded-full text-red-600' title="Punch Out" />
                                                                }
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        }
                                    </Tabs.TabPane>

                                    {/* // all employee list for clock out */}
                                    <Tabs.TabPane tab={`Out (${punchInOut?.totalOut || 0})`} key="3">
                                        {
                                            punchInOut?.punchOut?.map(d =>
                                                <div key={d?._id} className="border-b hover:bg-gray-50 p-2 mb-2 rounded-md">
                                                    <Row>
                                                        <Col md={8}>
                                                            <span className='text-[14px] capitalize whitespace-pre text-gray-700 font-medium'>{d?.employee}</span>
                                                            <span className='block capitalize text-gray-500 whitespace-pre'>
                                                                {
                                                                    (d?.end_time && d?.start_time) ?
                                                                        `Out - ${moment(d?.end_time).calendar()}`
                                                                        :
                                                                        `In - ${moment(d?.start_time).calendar()}`
                                                                }
                                                            </span>
                                                        </Col>
                                                        <Col md={4}>
                                                            <span className='flex items-center justify-center'>
                                                                {
                                                                    ((d?.end_time && d?.start_time) || (!d?.attendance_id && !d?.end_time)) ?
                                                                        <MdOutlinePlayCircleFilled onClick={() => handlePunch(d)} size={23} className='cursor-pointer shadow-md hover:shadow-lg rounded-full text-green-600' title="Punch In" />
                                                                        :
                                                                        <MdOutlineStopCircle onClick={() => handlePunch(d)} size={23} className='cursor-pointer shadow-md rounded-full text-red-600' title="Punch Out" />
                                                                }
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        }
                                    </Tabs.TabPane>
                                </Tabs>
                            </div>
                        </Col>
                    </Row>

                </div>
            </section>

            {/* status updated modal */}
            <Modal title={"Attendance"} visible={isModalVisible} onCancel={handleCancel} destroyOnClose footer={null} width={569}>
                {
                    punchToggle === true ?
                        <div>
                            <Form
                                onFinish={(values) => {
                                    const restaurant = localStorage.getItem('pickgo_restaurant');
                                    values.start_time = values?.start_time && moment(values.start_time).format();
                                    values.end_time = values?.end_time && moment(values.end_time).format();
                                    values.date = moment(values.date).format();
                                    values.employee_key = punchData?.key;
                                    if (punchData?.status === 'in') {
                                        values._id = punchData?.attendance_id;
                                        values.status = 'out';
                                    } else {
                                        values.status = 'in';
                                        values.restaurant_id = restaurant;
                                    }
                                    return useAction(postAttendance, values, () => {
                                        getAttendances();
                                        getPunchInOut();
                                        getEmployeesPunched();
                                        setIsModalVisible(false);
                                    })
                                }}
                                layout='vertical'
                            >
                                <Form.Item name='date' label='Data' rules={[{required: true}]} initialValue={moment(Date.now())} >
                                    <DatePicker style={{width: '100%', height: '40px', borderRadius: '10px'}} />
                                </Form.Item>

                                {
                                    (punchData?.status === 'in') ?
                                        <div>
                                            <Form.Item
                                                name='end_time'
                                                label='Clock Out'
                                                rules={[{required: true, message: 'Please select time'}]}
                                                initialValue={moment(Date.now())}
                                            >
                                                <TimePicker use12Hours format="h:mm a" style={{width: '100%', height: '40px', borderRadius: '10px'}} />
                                            </Form.Item>

                                            <Button className='mt-3'>Clock Out</Button>
                                        </div>
                                        :
                                        <div>
                                            <Form.Item
                                                name='start_time'
                                                label='Clock In'
                                                rules={[{required: true, message: 'Please select time'}]}
                                                initialValue={moment(Date.now())}
                                            >
                                                <TimePicker use12Hours format="h:mm a" style={{width: '100%', height: '40px', borderRadius: '10px'}} />
                                            </Form.Item>

                                            <Button className='mt-3'>Clock In</Button>
                                        </div>
                                }
                            </Form>
                        </div>
                        :
                        <div>
                            <Form
                                form={form}
                                onFinish={(values) => {
                                    const restaurant = localStorage.getItem('pickgo_restaurant');
                                    values.start_time = moment(values.time[0]).format();
                                    values.end_time = moment(values.time[1]).format();
                                    values.date = moment(values.date).format();
                                    values.employee_key = handleEmployeeSelectId;
                                    values.status = 'completed';
                                    values.restaurant_id = restaurant;
                                    return useAction(postAttendance, values, () => {
                                        getAttendances();
                                        setIsModalVisible(false);
                                    })
                                }}
                                layout='vertical'
                            >
                                <HiddenFormItem name="_id" />
                                <FormSelect name='employee_key' label='Employee' placeholder='Select one' required
                                    options={employees?.docs?.map(d => ({value: d.key, label: d.name}))}
                                    search
                                    clearable
                                    onChange={(e) => setHandleEmployeeSelectId(e)}
                                />

                                <Form.Item name='date' label='Data' rules={[{required: true}]} >
                                    <DatePicker style={{width: '100%', height: '40px', borderRadius: '10px'}} />
                                </Form.Item>

                                <Form.Item
                                    name='time'
                                    label='Time'
                                    rules={[{required: true, message: 'Please select time'}]}
                                >
                                    <TimePicker.RangePicker use12Hours format="h:mm a" style={{width: '100%', height: '40px', borderRadius: '10px'}} />
                                </Form.Item>

                                <Button className='mt-3'>{isEdit ? !!i18n && i18n?.t("Edit Attendance") : !!i18n && i18n?.t("Add Attendance")}</Button>
                            </Form>
                        </div>
                }
            </Modal>
        </div>
    );
};

EmployeeAttendance.layout = AdminLayout
export default EmployeeAttendance;