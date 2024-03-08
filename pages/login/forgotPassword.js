import {Form} from 'antd';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {isValidPhoneNumber} from 'react-phone-number-input';
import swalAlert from '../../components/common/alert';
import Button from '../../components/common/button';
import FormInput from '../../components/form/input';
import PhoneNumberInput from '../../components/form/PhoneInput';
import OtpModal from '../../components/frontend/common/otpModal';
import {useI18n} from '../../contexts/i18n';
import {getOTPForgotPass, resetPass} from '../../helpers/backend_helper';
import {useAction} from '../../helpers/hooks';

const ForgotPassword = () => {
    const i18n = useI18n()
    const [phoneNumber, setPhoneNumber] = useState("")
    const [openOtpModal, setOpenOtpModal] = useState(false)
    const [otpPhone, setOtpPhone] = useState("")
    const [showNewPassField, setShowNewPassField] = useState(false);
    const [resetPassToken, setResetPassToken] = useState(null)
    const {reload} = useRouter();

    const handleForgotPassOTP = (values) => {
        const data = {
            phone: values.phone
        }
        return useAction(getOTPForgotPass, data, (res) => {
            if (res) {
                setOpenOtpModal(true);
                setOtpPhone(res?.phone);
                if(process.env.product_mode === 'demo') {
                    res?.otp && alert(
                        `Your OTP is: ${res?.otp} \n` +
                        "**This is only for demo purpose**"
                    )
                }
            }
        })
    }

    const handleChangePassword = async (values) => {
        const data = {
            password: values.new_password,
            confirmPassword: values.confirm_password
        }
        localStorage.setItem("authToken", resetPassToken)
        const {error, msg} = await resetPass(data)
        if (error === false) {
            localStorage.removeItem("authToken");
            swalAlert.success("Successfully changed you Password. Please Login again to continue");
            reload()
        } else {
            swalAlert.error(msg)
        }
    }

    return (
        <>
            {
                showNewPassField ?
                    <Form
                        layout="vertical"
                        onFinish={handleChangePassword}
                    >

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
                                {!!i18n?.t ? i18n?.t("Update Password") : "Update Password"}
                            </Button>
                        </div>

                    </Form>
                    :
                    <Form
                        layout='vertical'
                        onFinish={handleForgotPassOTP}
                    >
                        <PhoneNumberInput
                            onChange={(values, errorInfo) => {
                                setPhoneNumber(values);

                            }}
                            name={"phone"}
                            label={"Phone"}
                            placeholder={"Your Phone number"}
                        />
                        <Button
                            disabled={isValidPhoneNumber(String(phoneNumber)) === false ? true : false}
                            className="!bg-twPrimary !text-twContent !text-[22px] !font-medium !py-[20px] !px-[220px] mt-10 disabled:cursor-not-allowed disabled:!bg-opacity-40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            {!!i18n?.t ? i18n?.t("Send OTP") : "Send OTP"}
                        </Button>
                    </Form>
            }

            <OtpModal resetPassword={true} modalOpen={openOtpModal} setModalOpen={setOpenOtpModal} otpPhone={otpPhone} resendOtp={false} action="resetPassword" setShowNewPassField={setShowNewPassField} setResetPassToken={setResetPassToken} />
        </>
    );
};


export default ForgotPassword;