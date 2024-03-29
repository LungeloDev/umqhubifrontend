import { Checkbox, Form } from 'antd';
import React from 'react';



const InputCheckbox = ({ label, needLabel=false, input_name, formPlaceholder = '', handleBooleanStatus, checkLink = '#', requiredOption = false }) => {
    

    return (
        <div>
            {needLabel && <span className='text-gray-600'>{label}</span>}
            <div className=''>
                <Form.Item
                    name={`${input_name}`}
                    initialValue={false}
                    // extra='No / Yes'
                    rules={[
                        {
                            required: requiredOption,
                            message: `This field is required!`,
                        },
                    ]}
                >
                    <Checkbox onChange={(e) => handleBooleanStatus(e, input_name)} className='mt-2' />
                    <span className='pl-1'> {formPlaceholder} </span>
                    {
                        checkLink.length >= 2 &&
                        <a href={checkLink} target="__blank" className=''>Click Here</a>
                    }
                </Form.Item>
            </div>
        </div>
    );
};

export default InputCheckbox;