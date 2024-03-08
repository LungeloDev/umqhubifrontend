import Head from 'next/head';
import {useRouter} from 'next/router';
import React from 'react';
import Button from '../../../../components/common/button';
import {Form, Modal} from 'antd';
import Table from '../../../../components/common/table';
import {useSite} from '../../../../contexts/site';
import {
    postRole,
    delRole,
    fetchRoles,
    fetchDepartmentShortList,
} from '../../../../helpers/backend_helper';
import {useFetch, useAction} from '../../../../helpers/hooks';
import {useState} from 'react';
import FormInput, {HiddenFormItem} from '../../../../components/form/input';
import FormSelect from '../../../../components/form/select';
import {FaPlus} from 'react-icons/fa';
import AdminLayout from "../../../../layouts/admin";
import { useI18n } from '../../../../contexts/i18n';

const Roles = () => {
    const site = useSite();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const {push} = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departmentElements, getDepartmentElements] = useFetch(fetchDepartmentShortList);
    const [roles, getRoles, {loading, error}] = useFetch(fetchRoles);

    let columns = [
        {
            dataField: 'department',
            text: 'Department',
            formatter: d => `${d?.name}`
        },
        {
            dataField: 'name', text: 'Role Name',
            formatter: name => <span className=''>{name}</span>
        }
    ];

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={() => {
                    form.resetFields();
                    setIsModalOpen(true)
                }
                }>{!!i18n && i18n?.t("Add Role")}</Button>
        </div>)

    let actions = ({_id}) => (
        <button className="btn btn-outline-success btn-sm focus:shadow-none me-2"
                title="View" onClick={() => push(`/admin/hrm/roles/permissions?_id=${_id}`)}>
            <FaPlus/>
        </button>
    )


    return (
        <div>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>{site?.site_name} | Roles & Permissions</title>
                </Head>
                <div className='card_container'>
                    <Table
                        columns={columns}
                        data={roles}
                        noActions={false}
                        action={action}
                        actions={actions}
                        indexed={true}
                        shadow={false}
                        onEdit={(data) => {
                            form.resetFields();
                            form.setFieldsValue({
                                ...data,
                                department: data?.department?._id,
                                categories: data?.categories?.map(d => d._id)
                            });
                            setIsModalOpen(true);
                        }}
                        onDelete={delRole}
                        onReload={getRoles}
                        error={error}
                        loading={loading}
                        pagination
                    />
                </div>
            </section>

            {/* modal */}
            <Modal title="Role Details" destroyOnClose visible={isModalOpen} onCancel={() => setIsModalOpen(false)}
                   footer={null}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        return useAction(postRole, values, () => {
                            getRoles()
                            setIsModalOpen(false);
                        })
                    }}
                >
                    <HiddenFormItem name="_id"/>
                    <FormSelect
                        name="department" label='Select Department'
                        required={true}
                        placeholder={'Select a department'}
                        options={departmentElements?.map(d => ({label: d.name, value: d._id}))}
                    />
                    <FormInput name="name" label='Role Name' required placeholder={'Please input role name'}/>
                    <Button>Submit</Button>
                </Form>
            </Modal>
        </div>
    );
};
Roles.layout = AdminLayout;
export default Roles;