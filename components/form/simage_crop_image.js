import {Upload} from 'antd';
import ImgCrop from 'antd-img-crop';
import {UploadOutlined} from "@ant-design/icons";

const SingleImageCropImage = ({value, onChange, onSelect}) => {
    const handleChange = ({fileList: newFileList}) => {
        onSelect(newFileList[0].originFileObj)
        onChange(newFileList[0].originFileObj)
    };
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    return (
        <ImgCrop rotationSlider aspect={4.524/3}>
            <Upload
                onChange={handleChange}
                onPreview={onPreview}
                maxCount={1}

            >
                <div className={'px-2 py-0.5 flex justify-center items-center space-x-2 border rounded'}><UploadOutlined className={''}/> <p>Upload</p></div>
            </Upload>
        </ImgCrop>
    );
};
export default SingleImageCropImage;
