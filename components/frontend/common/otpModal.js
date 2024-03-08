import {Modal} from 'antd';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import OtpInput from 'react-otp-input';
import {getOTPForgotPass, postOtpVerify, postPasswordResetOTPVerify, postResendOtpVerify, postSendOtp, verifyOTPForgotPass} from '../../../helpers/backend_helper';
import {useAction} from '../../../helpers/hooks';
import swalAlert from '../../common/alert';
import Button from '../../common/button';
import OtpTimer from "otp-timer";
import {useI18n} from '../../../contexts/i18n';

const OtpModal = ({setRegistrationToken, setShowPasswordField, setPasswordFiled, modalOpen, setModalOpen, otpPhone, resendOtp = false, resetPassword = false, action = "", setShowNewPassField, setResetPassToken}) => {
    const i18n = useI18n()
    const [otpInput, setOtpInput] = useState("");
    const [resendOtpFromModal, setResendOtpFromModal] = useState(false);
    const [otpTimerMinutes, setOtpTimerMinutes] = useState(0);
    const [otpTimerSeconds, setOtpTimerSeconds] = useState(0)
    const [fromForgotPass, setFromForgotPass] = useState(false)

    const data = {
        otp: otpInput,
        phone: otpPhone
    }
    const resendData = {
        action: "login",
        phone: otpPhone,
        otp: otpInput
    }

    const handleOtpChange = (otp) => setOtpInput(otp);

    const router = useRouter()

    const handleResetOtp = () => {
        setResendOtpFromModal(true);
        action === "resetPassword" ? useAction(getOTPForgotPass, resendData) :
            useAction(postSendOtp, resendData);
        setOtpInput("")
    }

    const handleOtpVerification = async () => {
        switch (action) {

            case "registration":
                // otp verify for user registration
                const {error: registrationError, msg: registrationMsg, token: registrationToken} = await postOtpVerify(data);
                if (registrationError === false) {
                    swalAlert.success(registrationMsg);
                    setModalOpen(false)
                    setOtpInput("")
                    setShowPasswordField(true)
                    setRegistrationToken(registrationToken)
                } else {
                    swalAlert.error(registrationMsg)
                }
                break;

            case "resend":
                // otp verify for otp resend purpose    
                if (resendOtp === true || resendOtpFromModal === true) {
                    useAction(postResendOtpVerify, resendData, (res) => {
                        if (!!res) {
                            if (res?.verified === true) {
                                res?.token && localStorage.setItem('authToken', token);
                                setModalOpen(false);
                                setOtpInput("")
                                router.push("/login")
                            }
                        }
                    })
                }
                break;

            case "resetPassword":
                //otp verify for password reset
                if (resetPassword === true) {
                    const {error, msg, token} = await verifyOTPForgotPass(data)
                    if (error === false) {
                        setResetPassToken(token)
                        swalAlert.success(msg);
                        setShowNewPassField(true);
                        setOtpInput("");
                        setModalOpen(false);
                    }
                }
                break;

            case "driver-registration":
                // otp resend for driver registration
                if (resendOtpFromModal === true) {
                    const {error, msg, token, data: d} = await postResendOtpVerify(resendData)
                    if (error === false) {
                        setResetPassToken(token)
                        swalAlert.success(msg);
                        setOtpInput("");
                        setPasswordFiled(true);
                        setModalOpen(false);
                    }
                }
                // otp verify for driver registration
                const {error, msg, token, data: d} = await postOtpVerify(data)
                if (error === false) {
                    setResetPassToken(token)
                    swalAlert.success(msg);
                    setOtpInput("");
                    setPasswordFiled(true);
                    setModalOpen(false);
                }
        }
    }

    return (
        <div>
            <Modal
                width={1000}
                style={{
                    top: 100,
                }}
                destroyOnClose
                maskClosable={false}
                visible={modalOpen}
                okText={"Verify"}
                footer={null}
                onCancel={() => setModalOpen(false)}
            >
                <div className="text-center">
                    <p className="text-3xl text-twContent font-semibold mt-36">
                        {!!i18n?.t ? i18n?.t("Verification") : "Verification"}
                    </p>
                    <div className="otp">
                        <OtpInput
                            numInputs={4}
                            value={otpInput}
                            onChange={handleOtpChange}
                            containerStyle={"my-[30px] flex gap-2 md:gap-5 justify-center"}
                            inputStyle={"border rounded-[15px] h-[50px] md:h-[100px] !w-[50px] md:!w-[100px] text-[36px] text-twContent focus:outline-twPrimary"}
                            shouldAutoFocus={true}
                        />
                    </div>
                    <p className="text-twContent text-2xl mb-[55px] font-medium">
                        {!!i18n?.t ? i18n.t("Didn’t receive code?") : "Didn’t receive code?"}
                        <span className="text-tw text-twSecondary-shade800 first-letter font-medium">
                            <OtpTimer
                                minutes={otpTimerMinutes}
                                seconds={otpTimerSeconds}
                                text="Resend After: "
                                ButtonText="Resend Again"
                                resend={handleResetOtp}
                                textColor={"#5A5A5A"}
                                buttonColor={"#F9A825"}
                                background={"none"}
                            />
                        </span>
                    </p>
                    <Button disabled={otpInput.length >= 4 ? false : true} onClick={handleOtpVerification} className="font-Poppins w-3/4 !bg-twPrimary !py-[20px] !text-twContent font-medium text-[22px] mb-[150px] disabled:cursor-not-allowed disabled:!bg-opacity-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">{!!i18n?.t ? i18n?.t("Verify") : "Verify"}</Button>
                </div>
            </Modal>
        </div>
    );
};

export default OtpModal;    