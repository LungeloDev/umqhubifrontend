import {Form, Modal, Switch} from 'antd';
import Head from 'next/head';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import Button from '../../../../components/common/button';
import Table, {TableImage} from '../../../../components/common/table';
import FormInput, {HiddenFormItem} from '../../../../components/form/input';
import {useSite} from '../../../../contexts/site';
import {
    delPayrollSalarySetting,
    fetchPayrollSalarySettings,
    postPayrollSalarySetting,
} from '../../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";
import {DotLoader} from "react-spinners";
import Card from "../../../../components/common/card";
import FormSelect from "../../../../components/form/select";
import { useI18n } from '../../../../contexts/i18n';

const PayrollSalarySettings = () => {
    const site = useSite();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const {push} = useRouter();
    const [salarySettings, getSalarySettings, {loading, error}] = useFetch(fetchPayrollSalarySettings);
    const [loadingSpinner, setLoadSpinner] = useState(false);
    const [file, setFile] = useState();

    let columns = [
        {
            dataField: 'title', text: 'Title',
            formatter: title => <span className='capitalize'>{title}</span>
        },
        {
            dataField: 'value', text: 'Value',
            formatter: value => <span className='capitalize'>{value}</span>
        },
        {
            dataField: 'setting_type', text: 'Type',
            formatter: setting_type => <span
                className={`capitalize ${setting_type === 'addition' ? 'text-green-500' : 'text-red-600'}`}>{setting_type}</span>
        },
        {
            dataField: 'status', text: 'Active Status',
            formatter: (status, data) =>  <Switch onChange={(e) => useAction(postPayrollSalarySetting, {_id: data?._id, status: e}, ()=> getSalarySettings())} checkedChildren={'Active'} unCheckedChildren={'Inactive'} checked={status} />
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
                }}>{!!i18n && i18n?.t("Add Setting")}</Button>
        </div>)

    return (
        <section>
            <Head>
                <title>Service Categories</title>
            </Head>
            <Card className={'shadow-sm'}>
                <h1>{!!i18n && i18n?.t("Salary Settings")}</h1>
            </Card>
            <div className='card_container'>
                <Table
                    columns={columns}
                    data={salarySettings}
                    pagination={true}
                    noActions={false}
                    action={action}
                    indexed={true}
                    shadow={false}
                    onEdit={(data) => {
                        form.resetFields();
                        form.setFieldsValue({
                            ...data,
                        });
                        setIsModalVisible(true);
                        setIsEdit(true)
                    }}
                    onDelete={delPayrollSalarySetting}
                    onReload={getSalarySettings}
                    error={error}
                />
            </div>

            {/* status updated modal */}
            <Modal title={isEdit ? "Update Category" : `Category Details`} visible={isModalVisible}
                   onCancel={() => setIsModalVisible(false)}
                   destroyOnClose footer={null}>
                <Form
                    form={form}
                    onFinish={async (values) => {
                        return useAction(postPayrollSalarySetting, values, () => {
                            getSalarySettings()
                            setIsModalVisible(false);
                        })
                    }}
                    layout='vertical'
                >
                    <HiddenFormItem name="_id"/>
                    <FormInput name='title' placeholder='Enter title' label='Title' required/>
                    <FormInput name='value' type={'number'} placeholder='Enter value' label='Value' required/>
                    <FormSelect name='value_type' placeholder='Choose value type' label='Value Type' required
                                options={[{label: 'Percentage', value: 'percentage'}, {label: 'Flat', value: 'flat'}]}
                    />
                    <FormSelect name='setting_type' placeholder='Choose setting type' label='Setting Type' required
                                options={[{label: 'Addition', value: 'addition'}, {
                                    label: 'Subtraction',
                                    value: 'subtraction'
                                }]}
                    />
                    <div className={'flex items-center gap-5'}>
                        <Button>{isEdit ? "Update" : "Add Setting"}</Button>
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
PayrollSalarySettings.layout = AdminLayout;
export default PayrollSalarySettings;