import {Checkbox, Form, message} from "antd";
import React, {useState} from "react";
import FormInput from "../../components/form/input";
import FormSelect from "../../components/form/FormSelect";
import PhoneNumberInput from "../../components/form/PhoneInput";
import Link from "next/link";
import Button from "../../components/common/button";
import {toast, Toaster} from "react-hot-toast";
import {useSite} from "../../contexts/site";
import {useAction} from "../../helpers/hooks";
import {postSendOtp} from "../../helpers/backend_helper";
import {useRouter} from "next/router";
import OtpModal from "../../components/frontend/common/otpModal";
import PasswordFields from "./passwordFields";
import ReCAPTCHA from "react-google-recaptcha";
import SocialLogins from "../../components/frontend/common/socialLogins";
import HomeLayout from "../../layouts/home";

const Signup = () => {
    const site = useSite()
    const [modalOpen, setModalOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [phone, setPhone] = useState("");
    const [showPasswordField, setShowPasswordField] = useState(false)
    const [registrationData, setRegistrationData] = useState({})
    const [registrationToken, setRegistrationToken] = useState(null)
    const [captcha, setCaptcha] = useState(null);
    const router = useRouter()

    const onFinish = (values) => {
        const data = {
            name: values.userName, email: values.email, phone: values.phone, gender: values.gender, role: "user",
        }
        const otpData = {
            phone: values.phone
        }
        useAction(postSendOtp, otpData, (res) => {
            res && setModalOpen(true);
            setPhone(values.phone);
            setRegistrationData(data);
            if(process.env.product_mode === 'demo') {
                res?.otp && alert(
                    `Your OTP is: ${res?.otp} \n` +
                    "**This is only for demo purpose**"
                )
            }
        })
    }
    const onFinishFailed = (errorInfo) => {
        toast.error(errorInfo)
    };

    return (<>
        <div
            className="max-w-[750px] md:mx-auto my-[46px] flex flex-col items-center justify-center font-Poppins border-1 p-5 md:!border-[#FCEB55] border-white border-opacity-70 md:shadow-sm bg-yellow-50 bg-opacity-20 ">
            <div className="space-y-3">
                <div className="flex justify-center ">
                    <img className="h-[50px]" src={site?.logo} alt="logo"/>
                </div>
                <h1 className="font-Roboto font-bold text-lg md:text-2xl text-center">{site?.site_name}</h1>
            </div>
            <div className="my-4">
                <h5 className="text-twContent font-semibold text-lg md:text-2xl text-center">
                    Sign up with your email or phone number
                </h5>
            </div>
            <div className="w-full signup mt-6">
                {showPasswordField ? <PasswordFields setShowPasswordField={setShowPasswordField}
                                                     registrationToken={registrationToken}
                                                     registrationData={registrationData}/> : <Form
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <FormInput
                        placeholder={"Enter Your Name"}
                        name={"userName"}
                        label={"Name"}
                        required
                    />
                    <FormInput type="email" name={"email"} placeholder={"Enter Your Email"} label={"Email"} required
                               rules={[{type: "email", message: "invalid email"}]}/>
                    <PhoneNumberInput
                        name={"phone"}
                        label={"Phone"}
                        placeholder={"Your Phone number"}
                        required
                    />
                    <FormSelect
                        required
                        name={"gender"}
                        initialValue={"Select Gender"}
                        options={[{value: "Male", label: "Male", name: "Male"}, {
                            value: "Female", label: "Female", name: "Female"
                        }, {value: "Others", label: "Others", name: "Others"},]}
                    />

                    <Checkbox
                        defaultChecked={false}
                        className={"text-twContent-muted text-sm"}
                        rules={[{
                            required: true, message: "Please confirm terms and conditions"
                        }]}
                        onChange={() => setIsChecked(!isChecked)}
                    >
                        By signing up. you agree to the{" "}
                        <Link href={"/home/terms-and-condition/"}>
                            <a className={"text-twSecondary-shade800 hover:text-twPrimary"}>
                                Terms of service
                            </a>
                        </Link>{" "}
                        and{" "}
                        <Link href={"/home/privacy-policy/"}>
                            <a className={"text-twSecondary-shade800 hover:text-twPrimary"}>
                                Privacy policy
                            </a>
                        </Link>
                        .
                    </Checkbox>
                    <br/>
                    <br/>
                    <br/>
                    {(!!site?.recaptcha?.register_recaptcha && !!site?.recaptcha?.site_key) &&
                        <div className="flex justify-center md:scale-100 scale-75">
                            <ReCAPTCHA
                                required
                                sitekey={site?.recaptcha?.site_key ?? ''}
                                onChange={(value) => {
                                    setCaptcha(value)
                                }}
                                size="normal"
                            />
                        </div>}
                    <Button
                        className="!bg-twPrimary !text-twContent !text-[20px] !font-medium !py-[18px] w-full mt-10 disabled:!bg-opacity-40 disabled:!cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                        disabled={(site?.recaptcha?.register_recaptcha ? !captcha : false) || !isChecked}>
                        Sign Up
                    </Button>
                </Form>}

                <div className="my-10 flex gap-x-[8px] items-center text-[#A6A6A6]">
                    <hr className=" w-1/2 "/>
                    <p className="text-[18px]">or</p>
                    <hr className=" w-1/2"/>
                </div>

                {/* social login area */}
                <SocialLogins role="user"/>

                <p className="text-twContent md:text-xl text-base mb-[55px] text-center">
                    Already have an account?{" "}
                    <span className="text-twSecondary-shade800">
                        <Link href={"/login"}><a className="hover:text-twSecondary"> Sign in</a></Link>
                    </span>
                </p>

            </div>
        </div>

        {/* modal area */}
        <OtpModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            otpPhone={phone}
            action="registration"
            setShowPasswordField={setShowPasswordField}
            setRegistrationToken={setRegistrationToken}
        />
        <Toaster/>
    </>);

};
Signup.layout = HomeLayout
export default Signup;
