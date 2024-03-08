import React, {useState} from 'react';
import AdminLayout from "../../../../layouts/admin";
import Table from "../../../../components/common/table";
import Button from "../../../../components/common/button";
import {
    fetchMarketingSubscribers, postMarketingSubscribers,
} from "../../../../helpers/backend_helper";
import PageTitle from "../../../../components/common/page-title";
import {DatePicker, Form, Modal, Switch} from "antd";
import {useAction, useFetch} from "../../../../helpers/hooks";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";

const UserSMS = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [subscribedUsers, getSubscribedUsers] = useFetch(fetchMarketingSubscribers);

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={() => {
                    form.resetFields();
                    setIsModalVisible(true);

                }}
            >
                Subscribe to our NewsLetter</Button>
        </div>
    )

    const columns = [
        {
            dataField: 'email',
            text: 'Contacts',
        },
        {
            dataField: 'marketing_status',
            text: 'Status',
            formatter: (d, dd) => d === 'active' ?
                <div className="text-green-600 font-semibold">Active</div> :
                <div className="text-red-600 font-semibold ">Banned</div>
        }
    ];

    return (
        <div>
            <PageTitle title="Subscribed Users"/>
            <div className='bg-white rounded p-4'>
                <Table
                    pagination
                    columns={columns}
                    data={subscribedUsers}
                    action={action}
                    actions={(d) =>
                        d.marketing_status === 'active' ? (<div
                            className="bg-red-600 text-white px-2 py-1 text-center rounded cursor-pointer"
                            onClick={() => {
                                useAction(postMarketingSubscribers, {...d, marketing_status: 'banned'}, () => {
                                    getSubscribedUsers();
                                })
                            }}>Ban This User</div>) : <div
                            className="bg-green-600 text-white px-2 py-1 text-center rounded cursor-pointer"
                            onClick={() => {

                                useAction(postMarketingSubscribers, {...d, marketing_status: 'active'}, () => {
                                    getSubscribedUsers();
                                })
                            }}>Make User Active</div>

                    }
                    shadow={false}
                    onReload={getSubscribedUsers}
                />
            </div>
            <Modal title={`Add Subscribed User`} visible={isModalVisible} onCancel={() => setIsModalVisible(false)}
                   destroyOnClose
                   footer={null} width={569}>
                <Form
                    form={form}
                    onFinish={(values) => {
                        return useAction(postMarketingSubscribers, values, () => {
                            getSubscribedUsers();
                            setIsModalVisible(false);
                        })
                    }}
                    layout='vertical'
                >
                    <FormInput name='email' placeholder='Enter Email address' label='Email' required/>
                    <Button>Subscribe to our Newsletter </Button>
                </Form>
            </Modal>
        </div>
    );
};

UserSMS.layout = AdminLayout;
export default UserSMS;
