import React, {useState} from "react"
import {Form, Checkbox, Upload} from "antd"

const FormCheckbox = ({name, label, initialValue}) => {


    return (
        <Form.Item
            name={name}
            label={label}
            initialValue={initialValue || false}
        >
            <Input />
        </Form.Item>
    )
}


const Input = ({onChange}) => {

    return (
        <Checkbox onChange={(e)=>onChange(e.target.checked)}/>
    )
}


export default FormCheckbox