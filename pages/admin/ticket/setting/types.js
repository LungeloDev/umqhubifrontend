import React, {useEffect, useState} from 'react';
import Table from "../../../../components/common/table";
import {Col, Form, Modal, Switch} from "antd";
import Button from "../../../../components/common/button";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import FormSelect from "../../../../components/form/select";

import {useAction, useFetch} from "../../../../helpers/hooks";
import {
    deltTicketSettings,
    fetchTicketCategory, fetchTicketDepartments, fetchTicketTypes,
    postTicketType,
} from "../../../../helpers/backend_helper";

const Types = () => {
    const [form] = Form.useForm();
    const [modal_toggle, SetModal_toggle] = useState(false);
    const [department] = useFetch(fetchTicketDepartments)

    const [categories, getCategories] = useFetch(fetchTicketCategory, {}, false)
    const [types, getTypes] = useFetch(fetchTicketTypes)
    const [selected_department, setSelectedDepartment] = useState(null)

    useEffect(() => {
        getCategories({parent: selected_department})
    }, [selected_department])

    const onFinish = async (values) => {
        return useAction(postTicketType, values, () => {
            getTypes();
            form.resetFields();
            SetModal_toggle(false);
        })
    }

    return (
        <div>
            <Table
                pagination
                indexed
                data={types}
                columns={[
                    {
                        dataField: "name",
                        text: "Name",
                    },
                    {
                        dataField: "department",
                        text: "Department",
                        formatter: (d, dd) => <span>{dd?.departments[0]?.name} </span>
                    },
                    {
                        dataField: "categories",
                        text: "Categories",
                        formatter: (d, dd) => <span>{dd?.categories[0]?.name} </span>
                    },
                    {
                        dataField: "active", text: "Status",
                        formatter: (d, dd) => (
                            <Switch
                                checked={d}
                                onChange={(value) => onFinish({
                                    ...dd, active: value
                                })}
                            />
                        )
                    },
                ]}
                onEdit={values => {
                    const data = {
                        _id: values._id,
                        name: values.name,
                        departments: values.departments[0]?._id,
                        categories: values.categories[0]?._id,
                    }
                    getCategories({parent: values.departments[0]?._id})
                    form.resetFields();
                    form.setFieldsValue(data);
                    SetModal_toggle(true);
                }}
                onReload={getTypes}
                action={
                    <div className={'flex space-x-4'}>

                        <Button onClick={() => {
                            form.resetFields();
                            SetModal_toggle(true)
                        }}> Add Types</Button>
                    </div>
                }
                onDelete={deltTicketSettings}

            />
            <Modal visible={modal_toggle} onCancel={() => SetModal_toggle(false)} footer={null} title="Add Types">
                <Form form={form} layout="vertical" className="mt-4" onFinish={onFinish}>
                    <HiddenFormItem name="_id"/>
                    <FormInput name="name" label="Name" required/>

                    <Col span={24}>
                        <FormSelect
                            name="departments"
                            label="Department"
                            required
                            onSelect={(v) => {
                                form.resetFields(['categories'])
                                getCategories({parent: v})
                            }}
                            options={department?.docs}/>

                    </Col>

                    <Col span={24}>
                        <FormSelect
                            name="categories"
                            label="Category"
                            required
                            options={categories?.docs}/>
                    </Col>
                    <Button>Submit</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Types;
