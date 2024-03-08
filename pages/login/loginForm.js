import {Checkbox, Form} from 'antd';
import {useRouter} from 'next/router';
import React, {useContext, useState} from 'react';
import {toast} from 'react-hot-toast';
import Button from '../../components/common/button';
import FormInput from '../../components/form/input';
import UserDataContext from '../../contexts/userDataContext';
import {postLogin, postResendOtp} from '../../helpers/backend_helper';
import {useAction} from '../../helpers/hooks';
import ReCAPTCHA from "react-google-recaptcha";
import {useSite} from '../../contexts/site';
import {useI18n} from '../../contexts/i18n';

const LoginForm = ({setOtpPhone, setOpenOtpModal, settings}) => {
    const i18n = useI18n()
    const {recaptcha} = useSite()
    const [rememberMe, setRemembeMe] = useState(false)
    const {setIsLoggedIn} = useContext(UserDataContext);
    const router = useRouter();
    const [captcha, setCaptcha] = useState(null);
    const [form] = Form.useForm();

    const handleLoginSubmit = async (values) => {
        const data = {
            username: values.userName,
            password: values.password,
            rememberMe: rememberMe
        }
        const {error, token, msg, data: user} = await postLogin(data)
        if (error === false && user?.verified === true) {
            token && localStorage.setItem('authToken', token);
            setIsLoggedIn(true)
            switch (user?.role) {
                case 'admin':
                    await router.push("/admin")
                    break;
                case 'driver':
                    if (user?.vehicle?.approved === true) {
                        await router.push("/driver")
                    } else if (user?.vehicle?.approved === false) {
                        toast.error('Your requested vehicle not approved yet!')
                        setTimeout(async () => {
                            await router.push("/home")
                        }, 4000)
                    } else {
                        toast.error('Please register your vehicle first!')
                        setTimeout(async () => {
                            await router.push("/home/earnWithShare")
                        }, 4000)
                    }
                    break;
                case 'user':
                    await router.push("/user")
                    break;
                case 'employee':
                    await router.push("/admin")
                    break;
                default:
                    await router.push("/")
            }
        } else {
            toast.error(msg)
            if (user?.verified === false) {
                setOtpPhone(user?.phone)
                const data = {
                    action: "login", phone: user?.phone
                }
                return useAction(postResendOtp, data, (res) => {
                    if (res) {
                        setOpenOtpModal(true)
                    }
                })
            }
        }
    }

    const handleFormValue = (e) => {
        switch (e.target.innerText) {
            case "admin":
                return form.setFieldsValue({
                    userName: "admin@gmail.com",
                    password: "123456",
                });
            case "user":
                return form.setFieldsValue({
                    userName: "user@gmail.com",
                    password: "123456",
                });
            case "driver":
                return form.setFieldsValue({
                    userName: "driver50@gmail.com",
                    password: "123456",
                });
            case "employee":
                return form.setFieldsValue({
                    userName: "employee@gmail.com",
                    password: "123456",
                });
        }
    };

    return (
        <div>
            {
                process.env.product_mode === "demo" &&
                <div className="flex items-center justify-center font-medium text-lg gap-3 mt-1 mb-4">
                    <button
                        onClick={(e) => handleFormValue(e)}
                        className="focus:text-yellow-400 border-2 border-green-400 hover:bg-main border-opacity-30 px-2 py-1 rounded-md"
                    >
                        admin
                    </button>
                    <button
                        onClick={(e) => handleFormValue(e)}
                        className="focus:text-yellow-400 border-2 border-green-400 hover:bg-main border-opacity-30 px-2 py-1 rounded-md"
                    >
                        user
                    </button>
                    <button
                        onClick={(e) => handleFormValue(e)}
                        className="focus:text-yellow-400 border-2 border-green-400 hover:bg-main border-opacity-30 px-2 py-1 rounded-md"
                    >
                        driver
                    </button>
                    <button
                        onClick={(e) => handleFormValue(e)}
                        className="focus:text-yellow-400 border-2 border-green-400 hover:bg-main border-opacity-30 px-2 py-1 rounded-md"
                    >
                        employee
                    </button>
                </div>
            }
            <Form
                form={form}
                layout="vertical"
                name="contact"
                onFinish={handleLoginSubmit}
            >
                <FormInput
                    className="formInput"
                    name={"userName"}
                    label={"Email or Phone"}
                    placeholder={"Email or Phone"}
                    required
                />
                <FormInput
                    type="password"
                    label={"Password"}
                    placeholder={"Password"}
                    name={"password"}
                    required
                />
                <Checkbox onChange={() => setRemembeMe(!rememberMe)} defaultChecked={false}
                          className={"text-twContent-muted text-sm text-start"}>
                    {"Remember me"}
                </Checkbox>
                <br />
                <br />

                {(!!recaptcha?.login_recaptcha && !!settings?.recaptcha?.site_key) && <ReCAPTCHA
                    className='mt-2'
                    required
                    sitekey={settings?.recaptcha?.site_key ?? ''}
                    onChange={(value) => {
                        setCaptcha(value)
                    }}
                />}

                <Button
                    disabled={recaptcha?.login_recaptcha ? !captcha : false}
                    className="bg-twPrimary rounded-lg disabled:bg-opacity-40 disabled:!cursor-not-allowed !text-twContent !text-[22px] !font-medium !py-[20px] !px-[220px] mt-10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                    {!!i18n?.t ? i18n?.t("Login") : "Login"}
                </Button>
            </Form>
        </div>
    );
};
export default LoginForm;