import { DatePicker, Form, Modal, Switch } from 'antd';
import moment from 'moment';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Button from '../../../../components/common/button';
import Table from '../../../../components/common/table';
import FormInput, { HiddenFormItem } from '../../../../components/form/input';
import { useI18n } from '../../../../contexts/i18n';
import { useSite } from '../../../../contexts/site';
import { delHoliday, fetchHoliday, postHoliday } from '../../../../helpers/backend_helper';
import { useFetch, useAction } from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";


const EmployeeHoliday = () => {
    const site = useSite();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const router = useRouter();
    const [holidays, getHolidays, { loading, error }] = useFetch(fetchHoliday);

    let columns = [
        {
            dataField: 'title', text: 'Title',
            formatter: title => <span className='capitalize'>{title}</span>
        },
        {
            dataField: 'start_date', text: 'Date',
            formatter: (_, data) => <span className='capitalize'>{
                (data?.start_date && data?.end_date) ?
                    `${moment(data?.start_date).format('ll')} - ${moment(data.end_date).format('ll')}`
                    :
                    moment(data?.start_date).format('ll')

            }</span>
        }
    ];

    // modal
    const [oneDay, setOneDay] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const handleCancel = () => {
        setIsModalVisible(false);
    }

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={() => {
                    setOneDay(false)
                    form.resetFields();
                    setIsModalVisible(true);
                    setIsEdit(false)
                }}>{!!i18n && i18n?.t("Add Holiday")}</Button>
        </div>)

    return (
        <main>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>{site?.site_name} | Holiday</title>
                </Head>
                <div className='card_container'>
                    <Table
                        columns={columns}
                        data={holidays}
                        pagination={true}
                        noActions={false}
                        action={action}
                        indexed={true}
                        shadow={false}
                        onEdit={(data) => {
                            setIsEdit(true)
                            form.resetFields();
                            form.setFieldsValue({
                                ...data,
                                start_date: moment(data.start_date),
                                end_date: moment(data.end_date)
                            });
                            setIsModalVisible(true);
                            (data?.start_date && data?.end_date) ? setOneDay(true) : setOneDay(false)
                        }}
                        onDelete={delHoliday}
                        onReload={getHolidays}
                        error={error}
                        loading={loading}
                        title={!!i18n && i18n?.t("Holidays")}
                    />

                </div>
            </section>

            {/* status updated modal */}
            <Modal title={!!i18n && i18n?.t("Add Holiday")} visible={isModalVisible} onCancel={handleCancel} destroyOnClose footer={null}>
                <Form
                    form={form}
                    onFinish={(values) => {
                        return useAction(postHoliday, values, () => {
                            getHolidays();
                            setIsModalVisible(false);
                        })
                    }}
                    layout='vertical'
                >
                    <HiddenFormItem name="_id" />
                    <FormInput name='title' label='Title' placeholder='Enter title' required />
                    <span className='flex gap-4 pb-4'>
                        <span>One day</span>
                        <Switch onChange={e => setOneDay(pre => pre = e)} />
                        <span>More</span>
                    </span>
                    {
                        oneDay === false ?
                            <Form.Item name='start_date' label='Holiday Data' rules={[{ required: true }]} >
                                <DatePicker style={{ width: '100%', height: '40px', borderRadius: '10px' }} />
                            </Form.Item>
                            :
                            <div>
                                <Form.Item name='start_date' label='Start From Holiday' rules={[{ required: true }]} >
                                    <DatePicker style={{ width: '100%', height: '40px', borderRadius: '10px' }} />
                                </Form.Item>

                                <Form.Item name='end_date' label='End Holiday' rules={[{ required: true }]} >
                                    <DatePicker style={{ width: '100%', height: '40px', borderRadius: '10px' }} />
                                </Form.Item>
                            </div>
                    }

                    <Button className='mt-4'>{isEdit ? "Update" : "Add Holiday"}</Button>
                </Form>
            </Modal>
        </main>
    );
};
EmployeeHoliday.layout = AdminLayout;
export default EmployeeHoliday;