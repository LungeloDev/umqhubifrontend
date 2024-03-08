import { DatePicker, Form, Modal, Switch } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import Button from '../../../../components/common/button';
import ReactIconsSelector, { ReactIcon } from '../../../../components/common/react-icon';
import Table from '../../../../components/common/table';
import FormInput, { HiddenFormItem } from '../../../../components/form/input';
import FormSelect from '../../../../components/form/select';
import { useI18n } from '../../../../contexts/i18n';
import { useSite } from '../../../../contexts/site';
import { delLeaveSetting, fetchLeaveSetting, postLeaveSetting } from '../../../../helpers/backend_helper';
import { useFetch, useAction } from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";


const EmployeeLeaveSetting = () => {
    const site = useSite();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const router = useRouter();
    const [leaveSettings, getLeaveSettings, { loading, error }] = useFetch(fetchLeaveSetting);

    const [iconValue, setIconValue] = useState(undefined);
    const onChangeReactIcon = (value) => {
        setIconValue(value)
    }

    let columns = [
        {
            dataField: 'title', text: 'Title',
            formatter: title => <span className='capitalize'>{title}</span>
        },
        {
            dataField: 'days', text: 'Days',
            formatter: days => <span className='capitalize'>{days}</span>
        },
        {
            dataField: 'type', text: 'Type',
            formatter: type => <span className='capitalize'>{type}</span>
        },
        {
            dataField: 'icon', text: 'Icon',
            formatter: icon => <ReactIcon icon={icon} size={20}/>
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: (d, { _id }) => <Switch onChange={e => useAction(postLeaveSetting, { _id, status: e }, () => getLeaveSettings())} checked={d} />
        },
    ];

    // modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleCancel = () => {
        setIsModalVisible(false);
    }

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={() => {
                    form.resetFields();
                    setIconValue(undefined)
                    setIsModalVisible(true);
                }}>{!!i18n && i18n?.t("Add Setting")}</Button>
        </div>)

    return (
        <main>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>{site?.site_name} | Leave Setting</title>
                </Head>
                <div className='card_container'>
                    <Table
                        columns={columns}
                        data={leaveSettings}
                        pagination={true}
                        noActions={false}
                        action={action}
                        indexed={true}
                        shadow={false}
                        onEdit={(data) => {
                            form.resetFields();
                            setIconValue(null)
                            form.setFieldsValue({
                                ...data
                            });
                            setIsModalVisible(true);
                        }}
                        onDelete={delLeaveSetting}
                        onReload={getLeaveSettings}
                        error={error}
                        loading={loading}
                        title={!!i18n && i18n?.t("Leave Setting")}
                    />
                </div>
            </section>

            {/* status updated modal */}
            <Modal title={`Add Setting`} visible={isModalVisible} onCancel={handleCancel} destroyOnClose footer={null} width={569}>
                <Form
                    form={form}
                    onFinish={(values) => {
                        values.days = Number(values.days);
                        values.icon = iconValue;
                        return useAction(postLeaveSetting, values, () => {
                            getLeaveSettings();
                            setIsModalVisible(false);
                        })
                    }}
                    layout='vertical'
                >
                    <HiddenFormItem name="_id" />
                    <FormInput name='title' label='Title' placeholder='Enter title' required />
                    <FormInput name='days' label='Days' type='number' placeholder='Enter days' required />
                    <FormSelect name='type' label='Type' placeholder='Select type' required
                        options={[{ value: 'paid', label: 'Paid' }, { value: 'non_paid', label: 'Non-Paid' }]}
                    />

                    <ReactIconsSelector onChange={onChangeReactIcon} value={iconValue} />

                    <Button className='mt-4'>Add Setting</Button>
                </Form>
            </Modal>
        </main>
    );
};
EmployeeLeaveSetting.layout = AdminLayout;
export default EmployeeLeaveSetting;