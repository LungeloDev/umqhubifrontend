import {Form, Upload} from "antd";
import axios from "axios";
import ImgCrop from 'antd-img-crop';

//File Input Component
const MultipleImageInput = (props) => {
    let max = props.max || 1
    let name = props.name || 'img'
    let label = props.label
    let listType = props.listType || "picture-card"

    return (
        <div className="form-group">
            {props.label && (<label className="block mb-2">{props.label}</label>)}
            <Form.Item name={name} label={label}>
                <Input max={max} listType={listType} />
            </Form.Item>
        </div>
    )
}

const Input = ({value, onChange, listType, max}) => {

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

    const handleChange = ({fileList}) => {
        onChange(fileList)
    }

    return (
        <Upload accept="image/png, image/gif, image/jpeg, image/webp" listType={listType}
            onPreview={onPreview}
            fileList={value || []} onChange={handleChange} maxCount={max}>
            {(value?.length || 0) < max && "+ upload"}
        </Upload>
    )
}

export default MultipleImageInput

export const uploadImage = async image => {
    try {
        const data = new FormData()
        data.append('image', image)
        let url = `https://api.imgbb.com/1/upload?key=${process.env.imgbb_key}`;
        const res = await axios.post(url, data, {})
        if (res.data.success) {
            return res.data.data.image.url
        }
    } catch (e) {
        return ''
    }
}

export const getUploadImageUrl = async image => {
    if (image?.length > 0) {
        if (image[0].uid === '-1') {
            return image[0].url
        } else {
            let {originFileObj} = image[0]
            return await uploadImage(originFileObj)
        }
    }
    return ''
}

export const getUploadImagesUrl = async images => {
    if (images?.length > 0) {
        let urls = []
        for (let i = 0; i < images?.length; i++) {
            if (+images[i].uid < 0) {
                urls.push(images[i].url)
            } else {
                let {originFileObj} = images[i]
                let url = await uploadImage(originFileObj)
                urls.push(url)
            }
        }
        return urls;
    }
    return []
}