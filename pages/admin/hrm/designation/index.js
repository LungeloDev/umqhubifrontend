import { Form, Modal, Select } from 'antd';
const { Option } = Select;
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import Button from '../../../../components/common/button';
import Table from '../../../../components/common/table';
import FormInput, { HiddenFormItem } from '../../../../components/form/input';
import FormSelect from '../../../../components/form/select';
import { useSite } from '../../../../contexts/site';
import { delDesignation, fetchDepartment, fetchDesignation, fetchEmployeeDepartment, postDesignation } from '../../../../helpers/backend_helper';
import { useFetch, useAction } from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";

function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
}


const EmployeeDesignation = () => {
    const site = useSite();
    const [form] = Form.useForm();
    const router = useRouter();
    const [designation, getDesignation, { loading, error }] = useFetch(fetchDesignation);
    const [departments] = useFetch(fetchDepartment);

    let columns = [
        {
            dataField: 'name', text: 'Name',
            formatter: name => <span className='capitalize'>{name}</span>
        },
        {
            dataField: 'role', text: 'Department',
            formatter: (role) => <span className='capitalize'>{role}</span>
        },
        {
            dataField: 'status', text: 'Status',
            formatter: status => <span className={`${status === 'active' ? "text-purple-500" : "text-gray-600"} capitalize px-2 py-1 rounded-md font-medium`}>{status}</span>
        }
    ];

    // handle input type
    const [a, setA] = useState();
    const onChange = (input_type) => {
        setA(input_type)
    }

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
                    setIsModalVisible(true);
                }}>Add Department</Button>
        </div>)

    return (
        <main>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>{site?.site_name} | Designation</title>
                </Head>
                <div className='card_container'>
                    <Table
                        columns={columns}
                        data={designation}
                        pagination={true}
                        noActions={false}
                        action={action}
                        indexed={true}
                        shadow={false}
                        onEdit={(data) => {
                            form.resetFields();
                            form.setFieldsValue(data);
                            setIsModalVisible(true);
                        }}
                        onDelete={delDesignation}
                        onReload={getDesignation}
                        error={error}
                        loading={loading}
                    />
                </div>
            </section>

            {/* status updated modal */}
            <Modal title={`${site?.site_name} Designation`} visible={isModalVisible} onCancel={handleCancel} destroyOnClose footer={null} width={569}>
                <Form
                    form={form}
                    onFinish={(values) => {
                        values.role = a;
                        return useAction(postDesignation, values, () => {
                            getDesignation();
                            setIsModalVisible(false);
                        })
                    }}
                    layout='vertical'
                >
                    <HiddenFormItem name="_id" />
                    <FormInput name='name' label='Designation Name' placeholder='Enter designation name' required />
                    <FormSelect
                        name='role'
                        label='Department'
                        placeholder='Select Department'
                        options={departments?.docs?.map(d => ({ label: capitalizeFirstLetter(d.name), value: d._id }))}
                        required={true}
                        onChange={onChange}
                    />
                    <Button>Add Designation</Button>
                </Form>
            </Modal>
        </main>
    );
};
EmployeeDesignation.layout = AdminLayout;
export default EmployeeDesignation;