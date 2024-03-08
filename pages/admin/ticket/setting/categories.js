import React, {useState} from 'react';
import Table from "../../../../components/common/table";
import {Form, Modal, Switch} from "antd";
import Button from "../../../../components/common/button";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import FormSelect from "../../../../components/form/select";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {
    deltTicketSettings,
    fetchTicketCategory, fetchTicketDepartments,
    postTicketDepartment,
} from "../../../../helpers/backend_helper";
import {useI18n} from "../../../../contexts/i18n";

const Categories = () => {
    const i18n = useI18n()
    const [form] = Form.useForm();
    const [modal_toggle, SetModal_toggle] = useState(false);
    const [department] = useFetch(fetchTicketDepartments)
    const [categories, getCategories] = useFetch(fetchTicketCategory)
    const [isEdit, setIsEdit] = useState(false);

    const onFinish = (values) => {
        return useAction(postTicketDepartment, values, () => {
            getCategories();
            form.resetFields();
            SetModal_toggle(false);
        })
    }

    return (
       <div>
            <Table
                pagination
                indexed
                data={categories}
                columns={[
                    {
                        dataField: "name",
                        text: "Name",
                    },
                    {
                        dataField: "department",
                        text: "Department",
                        formatter: (d, dd) =>
                            <span>{department?.docs.filter((each) => dd.parent === each._id)[0]?.name} </span>
                    },
                    {
                        dataField: "active", text: "Status",
                        formatter: (d, dd) => (
                            <Switch
                                checked={d}
                                onChange={(value) => onFinish({
                                    ...dd, active: value
                                })}
                            ></Switch>
                        )
                    },
                ]}
                onEdit={values => {
                    setIsEdit(true);
                    form.resetFields();
                    form.setFieldsValue(values);
                    SetModal_toggle(true);
                }}
                onReload={getCategories}
                action={
                    <div className={'flex space-x-4'}>
                        <Button onClick={() => {
                            setIsEdit(false);
                            SetModal_toggle(true)
                            form.resetFields();
                            SetModal_toggle(true)
                        }}
                        >
                            Add Categories
                        </Button>
                    </div>
                }
                onDelete={deltTicketSettings}
            />
            <Modal visible={modal_toggle} onCancel={() => SetModal_toggle(false)} footer={null} title={isEdit ? 'Edit Category' : 'Add Category'}>
                <Form form={form} layout="vertical" className="mt-4" onFinish={onFinish}>
                    <HiddenFormItem name="_id" />
                    <FormInput name="name" label="Name" required />
                    <FormSelect
                        name="parent"
                        label="Department"
                        required
                        options={department?.docs} />
                    <Button>Submit</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Categories;
