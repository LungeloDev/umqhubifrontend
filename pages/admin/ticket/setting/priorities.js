import React, {useState} from 'react';
import Table from "../../../../components/common/table";
import {Form, Modal, Switch} from "antd";
import Button from "../../../../components/common/button";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {
    getTicketPriorities,
    postTicketPriorities,
    deleteTicketPriorities,
} from "../../../../helpers/backend_helper";
import {useI18n} from '../../../../contexts/i18n';

const Priorities = () => {
    const i18n = useI18n()
    const [form] = Form.useForm();
    const [modal_toggle, SetModal_toggle] = useState(false);
    const [ticket, getTicket] = useFetch(getTicketPriorities)
    const [isEdit, setIsEdit] = useState(false)
    const onFinish = async (values) => {
        return useAction(postTicketPriorities, values, () => {
            getTicket();
            SetModal_toggle(false)
        })
    }

    return (
        <div>
            <Table
                indexed
                data={ticket}
                title={"Priorities"}
                columns={[
                    {
                        dataField: "name",
                        text: "Name",
                    },
                    {
                        dataField: "value",
                        text: "Value",
                    },
                    {
                        dataField: "active", text: "Status",
                        formatter: (d, dd) => (
                            <Switch
                                checked={d}
                                onChange={(value) => onFinish({
                                    _id: dd._id, active: value
                                })}
                            />
                        )
                    },
                ]}

                onEdit={values => {
                    form.resetFields();
                    form.setFieldsValue(values);
                    form.setFieldsValue({_id: values._id})
                    setIsEdit(true)
                    SetModal_toggle(true);
                }}

                action={
                    <div className={'flex space-x-4'}>
                        <Button onClick={() => {
                            form.resetFields();
                            setIsEdit(false)
                            SetModal_toggle(true)
                        }}> Add Priorities</Button>
                    </div>
                }
                onDelete={deleteTicketPriorities}
                onReload={getTicket}
            />
            <Modal visible={modal_toggle} onCancel={() => SetModal_toggle(false)} footer={null} title={isEdit  ? 'Edit Priorities' : "Add Priorities"} >
                <Form form={form} layout="vertical" className="mt-4" onFinish={onFinish}>
                    <HiddenFormItem name="_id" />
                    <FormInput name="name" label="Name" required />
                    <FormInput name="value" label="Value (Lower the number, higher the priority)" type={'Number'} required />
                    <Button>Submit</Button>
                </Form>
            </Modal>
        </div >);
};
export default Priorities;
