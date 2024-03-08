import React, {useState} from 'react';
import AdminLayout from "../../../../layouts/admin";
import Table from "../../../../components/common/table";
import Button from "../../../../components/common/button";
import {
    delMarketingGroup,
    fetchMarketingGroups, postMarketingGroup,
} from "../../../../helpers/backend_helper";
import PageTitle from "../../../../components/common/page-title";
import {Form, Modal, Switch} from "antd";
import {useAction, useFetch} from "../../../../helpers/hooks";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import {useRouter} from "next/router";

const UserSMS = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit,setIsEdit] = useState(true);
    const [smsGroups, getSMSGroups, {loading, error}] = useFetch(fetchMarketingGroups, {type: 'whatsapp_sms'});

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={() => {
                    setIsEdit(false)
                    form.resetFields();
                    setIsModalVisible(true);
                }}
            >
                Add New Whatsapp Group
            </Button>
        </div>
    )

    const columns = [
        {
            dataField: 'name',
            text: 'Group Name'
        },
        {
            dataField: 'contact',
            text: 'Contacts',
            formatter: (cell, row) =>
                <span className={'px-2 py-1 rounded bg-main cursor-pointer'}
                      onClick={() => router.push(`/admin/marketing/manage_group/group_manage/${row._id}`)}>Manage Contacts</span>
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: (d, dd) => (
                <Switch
                    checked={d}
                    onChange={(values) => {
                        return useAction(postMarketingGroup, {...dd, status: values}, () => {
                            getSMSGroups();
                            setIsModalVisible(false);
                        })
                    }}
                />
            )
        },
    ];

    return (
        <div>
            <PageTitle title="User Whatsapp Groups"/>
            <div className='bg-white rounded p-4'>
                <Table
                    columns={columns}
                    data={smsGroups}
                    noActions={false}
                    action={action}
                    shadow={false}
                    onEdit={(data) => {
                        setIsEdit(true)
                        form.resetFields();
                        form.setFieldsValue({
                            ...data,
                        });
                        setIsModalVisible(true);
                    }}
                    onDelete={delMarketingGroup}
                    onReload={getSMSGroups}
                    loading={loading}
                />
            </div>
            <Modal title={`Whatsapp Group`} visible={isModalVisible} onCancel={() => setIsModalVisible(false)}
                   destroyOnClose
                   footer={null} width={569}>
                <Form
                    form={form}
                    onFinish={(values) => {
                        return useAction(postMarketingGroup, {...values, type: "whatsapp_sms"}, () => {
                            getSMSGroups();
                            setIsModalVisible(false);
                        })
                    }}
                    layout='vertical'
                >
                    <HiddenFormItem name="_id"/>
                    <FormInput name='name' placeholder='Enter full name' label='Name' required/>
                    <Button>{isEdit?'Edit Whatsapp Group':'Add Whatsapp Group'}</Button>
                </Form>
            </Modal>
        </div>
    );
};

UserSMS.layout = AdminLayout;
export default UserSMS;
