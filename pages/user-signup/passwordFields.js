import {Form} from 'antd';
import {useRouter} from 'next/router';
import {useState} from 'react';
import {toast, Toaster} from 'react-hot-toast';
import Button from '../../components/common/button';
import FormInput from '../../components/form/input';
import {postSignup} from '../../helpers/backend_helper';
import {useAction} from '../../helpers/hooks';

const PasswordFields = ({isDriver, setShowPasswordField, registrationData, registrationToken}) => {
    const [confirmPass, setConfirmPass] = useState()
    const router = useRouter();
    const submitPass = (values) => {
        const data = {
            ...registrationData,
            token: registrationToken,
            password: values.confirmPassword
        }
        return useAction(postSignup, data, (res) => {
            if (!!res) {
                setShowPasswordField(false);
                localStorage.setItem("authToken", res.token)
                isDriver === true ? router.push('/home/earnWithShare') : router.push('/user')
            }
        })
    }

    const onFinishFailed = (error) => {
        toast.error("Please provide appropriate information")
    };


    return (
        <>
            <Form
                layout="vertical"
                onFinish={submitPass}
                onFinishFailed={onFinishFailed}
            >
                <FormInput
                    type="password"
                    placeholder={"Enter Your Password"}
                    name={"password"}
                    required
                    rules={[
                        {
                            min: 6,
                            message: "Password must be at least 6 characters"
                        }
                    ]}
                />
                <FormInput
                    className="border-red-400"
                    onChange={(e) => setConfirmPass(e.target.value)}
                    type="password"
                    placeholder={"Confirm Your Password"}
                    name={"confirmPassword"}
                    dependencies={["password"]}
                    required
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your password!",
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
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
                <Button
                    disabled={!confirmPass?.length > 0}
                    className="!bg-twSecondary !text-twContent !text-[22px] text-center !font-medium !py-[20px] !w-full mt-10 disabled:!bg-opacity-40 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                    Sign Up
                </Button>
            </Form>
        </>
    );
};

export default PasswordFields;