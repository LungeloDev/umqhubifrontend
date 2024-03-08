import {Form, Upload} from "antd";
import React, {useEffect, useState} from "react";
import ImgCrop from "antd-img-crop";

//File Input Component
const ImageCropInput = (props) => {
    const [form] = Form.useForm();
    let max = props.max || 1
    let name = props.name || 'img'
    let listType = props.listType || "picture-card"

    let [refresh, setRefresh] = useState()
    let reload = () => setRefresh(!refresh)

    useEffect(() => {
        reload()
    }, [])

    const fileList = () => {
        let values = props?.form?.getFieldsValue()
        if (values[name]) {
            return values[name]
        }
        return []
    }

    const onChange = ({fileList: newFileList}) => {
        let value = {}
        value[name] = newFileList
        props.form.setFieldsValue(value)
        reload()
    }

    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = document.createElement("img");
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    return (
        <div className="">
            <style>{`
             .ant-modal-mask, .ant-modal-wrap {
                z-index: 1050 !important;
             }
             .ant-upload-list-item {
             margin-top: 6px!important;
             }
             textarea.form-control {
             min-height: 66px!important;
             }
            `}
            </style>
            {props.label && (<label className="block mb-1">{props.label}</label>)}
            <Form.Item name={name}>
                <ImgCrop aspect={props?.aspect || 1}>
                    <Upload customRequest={dummyRequest} accept="image/png, image/gif, image/jpeg" listType={listType} onPreview={onPreview}
                            fileList={fileList()} onChange={onChange} maxCount={max}>
                        {fileList().length < max && <div className="form-control w-full mt-1.5 mx-1">Upload a photo</div>}
                    </Upload>
                </ImgCrop>
            </Form.Item>
        </div>
    )
}

export default ImageCropInput

export const getImageObj = data => {
    if(data?.length > 0) {
        if(data[0].uid !== '-1') {
            return data[0].originFileObj
        }
    }
    return null
}