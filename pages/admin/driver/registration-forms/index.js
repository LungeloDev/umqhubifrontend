import {Button, Drawer, Select, Space, Switch} from 'antd';
import React, {useState, useEffect} from 'react';
import {
    delFormField,
    fetchFormFields,
    postFormFieldAPI,
} from '../../../../helpers/backend_helper';
import CreateNewField from './create';
import {ToastContainer} from 'react-toastify';
import moment from 'moment';
import AdminLayout from "../../../../layouts/admin";
import {useAction, useFetch} from "../../../../helpers/hooks";
import Table from "../../../../components/common/table";

const {Option} = Select;

const AdminRegistrationFrom = () => {
    const [formFields, getFormFields, {loading, error}] = useFetch(fetchFormFields);
    const [visible, setVisible] = useState(false);
    const [drawerWidth, setDrawerWidth] = useState(null)

    const showDrawer = (data) => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    useEffect(() => {
        if (window.innerWidth > 700) {
            setDrawerWidth(700)
        } else {
            setDrawerWidth(400)
        }
    }, [])

    const column = [
        {
            dataField: 'field_name', text: 'Field Name', formatter: (_, data) => (
                <div className=''>
                    <span className='capitalize'>{data?.field_name}</span>
                </div>
            )
        },
        {
            dataField: 'input_type', text: 'Type', formatter: (_, data) => (
                <div className=''>
                    <span className='capitalize text-left'>{data?.input_type}</span>
                </div>
            )
        },
        {
            dataField: 'createdAt', text: 'Added', formatter: (_, data) => (
                <div className=''>
                    <span className='capitalize'>{moment(data?.createdAt)?.format('ll')}</span>
                </div>
            )
        },
        {
            dataField: 'field_required', text: 'Required', formatter: (_, data) => (
                <div className=''>
                    <span className=''>{data?.field_required == true ?
                        <span className='text-green-500 font-semibold'>Yes</span> :
                        <span className='text-purple-500 font-semibold'>No</span>}</span>
                </div>
            )
        },
        {
            dataField: 'status', text: 'Status', formatter: (status, data) =>
                <Switch
                    checked={status}
                    onChange={(e) => useAction(postFormFieldAPI, {
                        status: e,
                        _id: data?._id
                    }, () => {
                        getFormFields()
                    })}
                />
        },
    ]

    return (
        <div>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <div className='md:flex md:justify-between pr-5 pt-3'>
                    <div className='py-1'></div>

                    {/* add and common button */}
                    <div className='flex md:justify-end gap-3'>
                        <button
                            className='bg-amber-300 hover:bg-amber-500 text-gray-700 px-2 py-2 rounded-md hover:text-gray-900 shadow-sm hover:shadow-md'
                            onClick={showDrawer}>Add Form Fields
                        </button>
                    </div>
                </div>

                {/* table data show */}
                <div className='card_container'>
                    <Table
                        columns={column}
                        data={formFields}
                        pagination={false}
                        noActions={false}
                        indexed={true}
                        shadow={false}
                        onDelete={delFormField}
                        onReload={getFormFields}
                        error={error}
                        title="Registration Form Fields"
                    />
                </div>

                {/* drawer open */}
                <Drawer
                    title="Create a new form field"
                    width={drawerWidth}
                    onClose={onClose}
                    visible={visible}
                    bodyStyle={{
                        paddingBottom: 80,
                    }}
                    destroyOnClose
                    extra={
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>

                        </Space>
                    }
                >
                    <CreateNewField getFormFields={getFormFields} onClose={onClose}/>
                </Drawer>

                {/* notification */}
                <ToastContainer
                    position="bottom-center"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </section>
        </div>
    );
};
AdminRegistrationFrom.layout = AdminLayout
export default AdminRegistrationFrom;