import React, {useState} from "react"
import {Form, Select, Radio, DatePicker, Space} from "antd"



const onOk = (value) => {
    console.log('onOk: ', value);
};

const onChange = (date, dateString) => {
    console.log(date, dateString);
};

const FormMultiTextSelect = ({
                            name,
                            label,
                            initialValue,
                            onChange,
                        }) => {




    return (
        <Form.Item
            name={name}
            label={label}
            initialValue={initialValue || ''}
        >
            <Select

                mode="tags"
                style={{
                    width: '100%',
                }}
                tokenSeparators={[',']}
                options={null}
            />
        </Form.Item>

    )
}
export default FormMultiTextSelect








