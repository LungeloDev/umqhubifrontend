import {DatePicker, Form, Tabs, Upload} from 'antd';
import moment from 'moment';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {fetchProfile, getUserDetailsById, postUserProfileByAdmin, postUserProfileByToken, userProfilePasswordChangeAdmin, userProfilePasswordChangeAPI} from '../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../helpers/hooks';
import AdminLayout from '../../../layouts/admin';
import {GrImage} from 'react-icons/gr';
import {LoadingOutlined} from '@ant-design/icons';
import FormInput, {HiddenFormItem} from '../../../components/form/input';
import PhoneNumberInput from '../../../components/form/PhoneInput';
import FormSelect from '../../../components/form/FormSelect';
import CountryInput from '../../../components/form/country';
import {toast, Toaster} from 'react-hot-toast';
import Button from '../../../components/common/button';
import swalAlert from '../../../components/common/alert';
import {awsFileUpload} from '../../../components/common/fileUploadAWS';


// function for image upload from antd 
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
};

// function for image upload from antd 
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
};

const UserDetails = () => {
    const {push, query} = useRouter()
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [form] = Form.useForm()
    const [user, getUser] = useFetch(getUserDetailsById, {_id: query?._id})

    useEffect(() => {
        if (!!user?._id) {
            form.setFieldsValue({...user, birthday: moment(user?.birthday)});
            setImageUrl(user?.image)
        }
    }, [user?._id])

    // image upload 
    const handleChange = async (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === "done") {
            const imgurl = await awsFileUpload(info.file.originFileObj)
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(imgurl);

            });
        }
    };

    // image upload button 
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <GrImage size={50} />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    // on Finish method for profile tab 
    const onFinish = async (values) => {
        const data = {
            _id: user?._id,
            image: imageUrl,
            name: values.name,
            email: values.email,
            phone: values.phone,
            gender: values.gender,
            birthday: moment(values?.birthday).format(),
            country: values.country,
            state: values.state,
            city: values.city,
            street: values.street,
            postcode: values.postcode,
            address1: values.address1,
            address2: values.address2,
        };
        useAction(postUserProfileByAdmin, data, () => getUser({_id: query?._id}))
    };

    const onFinishFailed = (errorInfo) => {
        toast.error("Please fill out the correct information");
    };

    // onFinish method for password change tab 
    const handleChangePassword = async (values) => {
        const data = {
            _id: query?._id,
            password: values.new_password,
            confirmPassword: values.confirm_password
        }
        const {error, msg} = await userProfilePasswordChangeAdmin(data)
        if (error === false) {
            await swalAlert.success("Password changed Successfully")
        } else {
            await swalAlert.error(msg)
        }
    }

    return (
        <>
            <div className="container">
                <div className="my-10 max-w-[900px] mx-auto profile">
                    <Tabs defaultActiveKey="1">

                        {/* update profile tab  */}
                        <Tabs.TabPane tab="Personal Information" key="1">
                            <div className="mt-[18px] profile">
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                >
                                    <HiddenFormItem name="_id" />
                                    <h3 className="font-medium text-lg text-twContent">
                                        Your Profile Picture
                                    </h3>
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader my-7"
                                        showUploadList={false}
                                        action=""
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        maxCount={1}
                                    >
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt="avatar"
                                                style={{
                                                    width: "100%",
                                                }}
                                            />
                                        ) : (
                                            uploadButton
                                        )}
                                    </Upload>
                                    <div className="grid gap-x-[22px] md:grid-cols-2 grid-cols-1 items-center">
                                        <FormInput name={"name"} label={"Name"} required />
                                        <FormInput
                                            type="email"
                                            name={"email"}
                                            label={"Email"}
                                            required
                                            rules={[{type: "email", message: "invalid email"}]}
                                        />
                                        <PhoneNumberInput
                                            name={"phone"}
                                            label={"Phone"}
                                            placeholder={"Your Phone number"}
                                            required
                                        />
                                        <FormSelect
                                            name={"gender"}
                                            label={"Gender"}
                                            initialValue={"Select Gender"}
                                            options={[
                                                {value: "Male", label: "Male", name: "Male"},
                                                {value: "Female", label: "Female", name: "Female"},
                                                {value: "Others", label: "Others", name: "Others"},
                                            ]}
                                        />
                                        <Form.Item label="Birth Date" name={"birthday"}>
                                            <DatePicker

                                                className={"py-[8px] rounded-[4px]"}
                                                style={{
                                                    width: "100%",
                                                }}
                                            />
                                        </Form.Item>
                                        <CountryInput name={"country"} label={"Country"} />
                                        <FormInput name={"state"} label={"State"} />
                                        <FormInput name={"city"} label={"City"} />
                                        <FormInput name={"street"} label={"Street"} />
                                        <FormInput name={"postcode"} label={"Postal Code"} />
                                        <div className="md:col-span-2">
                                            <FormInput
                                                name={"address1"}
                                                label={"Address Line 1"}
                                                textArea
                                            />
                                            <FormInput
                                                name={"address2"}
                                                label={"Address Line 2"}
                                                textArea
                                            />
                                        </div>
                                        <div>
                                            <Button className="!bg-twPrimary !text-twContent !text-[16px] !font-medium !py-[12px] !px-10">
                                                Update Profile
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </Tabs.TabPane>

                        {/* change password tab  */}
                        <Tabs.TabPane tab="Change Password" key="2">
                            <div className="mt-[18px]">
                                <Form
                                    layout="vertical"
                                    onFinish={handleChangePassword}
                                    onFinishFailed={onFinishFailed}
                                >
                                    <div className='md:w-1/2'>
                                        <FormInput
                                            type="password"
                                            name={"new_password"}
                                            label={"New Password"}
                                            required
                                            rules={[
                                                {
                                                    min: 6,
                                                    message: "Password must be at least 6 characters",
                                                },
                                            ]}
                                        />

                                        <FormInput
                                            type="password"
                                            name={"confirm_password"}
                                            label={"Confirm New Password"}
                                            dependencies={["new_password"]}
                                            required
                                            rules={[
                                                ({getFieldValue}) => ({
                                                    validator(_, value) {
                                                        if (
                                                            !value ||
                                                            getFieldValue("new_password") === value
                                                        ) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(
                                                            new Error(
                                                                "The two passwords that you entered do not match!"
                                                            )
                                                        );
                                                    },
                                                }),
                                            ]}
                                        />
                                        <div>
                                            <Button className="!bg-twPrimary !text-twContent !text-[16px] !font-medium !py-[12px] !px-10">
                                                Update Password
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
            <Toaster />
        </>
    );
};

UserDetails.layout = AdminLayout
export default UserDetails;