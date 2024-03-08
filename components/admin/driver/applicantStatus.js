import React from 'react';
import { Form, Select, message } from "antd";
const { Option } = Select;
import { ScaleLoader } from "react-spinners";
import { useState } from 'react';
import {postApplication, updateRiderApplicationStatusAPI} from "../../../helpers/backend_helper";


const ApplicantStatusModal = ({ tittle, status, getApplications, handleCancel }) => {
    const [waiting, setWaiting] = useState(false)

    const onFinish = (values) => {
        setWaiting(pre => pre = true)
        if (!!status) {
            updateRiderApplicationStatusAPI({...values, id: status}).then(data => {
                setWaiting(pre => pre = false)
                if (data?.error === false) {
                    message.success(data?.msg);
                    getApplications()
                    handleCancel();
                } else {
                    message.success(data?.msg);
                }
            })
        }
    }


    return (
        <div className='m-4 relative'>
            <p className='text-xl font-medium text-gray-500 capitalize'>{tittle}</p>
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item name="status" className='' label="" >
                    <Select placeholder="Change Status">
                        <Option value="inactive">Inactive</Option>
                        <Option value="active">Active</Option>
                    </Select>
                </Form.Item>
                <Form.Item className='flex justify-center bg-[#1ABC9C] rounded'>
                    <button className='text-base w-full text-white' type="submit">
                        Submit
                    </button>
                </Form.Item>
            </Form>
            {
                waiting === true &&
                <p className="absolute top-[40%] left-[40%]">
                    <ScaleLoader size={50} className='' color="#36d7b7" />
                </p>
            }
        </div>
    );
};

export default ApplicantStatusModal;