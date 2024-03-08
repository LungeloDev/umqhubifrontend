import React, {useEffect, useState} from "react";
import {useFetch} from "../../helpers/hooks";
import {
  fetchSiteSettings,
  getLandingPageData,
} from "../../helpers/backend_helper";
import SignUpModal from "../../components/frontend/common/signupModal/signUpModal";
import {Toaster} from "react-hot-toast";
import OtpModal from "../../components/frontend/common/otpModal";
import LoginForm from "./loginForm";
import ForgotPassword from "./forgotPassword";
import SocialLogins from "../../components/frontend/common/socialLogins";
import {useI18n} from "../../contexts/i18n";
import {useUserDataContext} from "../../contexts/userDataContext";

const Login = () => {
  const {language} = useUserDataContext()
  const i18n = useI18n()
  const [settings] = useFetch(fetchSiteSettings)
  const [modalOpen, setModalOpen] = useState(false)
  const [openOtpModal, setOpenOtpModal] = useState(false)
  const [otpPhone, setOtpPhone] = useState("")
  const [forgotPassClicked, setForgotPassClicked] = useState(false)
  const [data, getData] = useFetch(getLandingPageData, {}, false);

  useEffect(() => {
    if (!!language) getData({lang: language, pages: "login_page"});
  }, [language]);

  return (
    <>
      <div className="flex">
        <div className="bg-[#FDD835] w-1/2  hidden min-h-screen lg:flex items-center justify-center">
          <img src={data?.content?.login?.value.image} className="max-w-[70%]" alt="" />
        </div>
        <div className="mx-auto mb-20 mt-20">
          <div className="font-Poppins px-32">
            <div className=" text-center mx-auto">
              <div className="flex justify-center ">
                <img
                  src={settings?.logo}
                  className="h-[124px] w-[186px]"
                  alt="logo"
                />
              </div>
              <h1 className="font-Roboto font-bold text-2xl md:text-4xl ">
                {settings?.site_name}
              </h1>
            </div>
            <div className="pt-[34px] text-center">
              {
                forgotPassClicked
                  ?
                  <h2 className="text-twContent-header font-semibold text-lg md:text-3xl mb-[10px]">
                    {!!i18n.t ? i18n?.t("Forgot Password") : "Forgot Password"}
                  </h2>
                  :
                  <h2 className="text-twContent-header font-semibold text-lg md:text-3xl mb-[10px]">
                    {!!i18n.t ? i18n?.t("Account Login") : "Account Login"}
                  </h2>
              }
              {
                forgotPassClicked === false ?
                  <p className="text-twContent text-sm">
                    {!!i18n.t ? i18n?.t("Login and Start Engaging your Community!") : "Login and Start Engaging your Community!"}
                  </p>
                  :
                  <p className="text-twContent text-sm">
                    {!!i18n.t ? i18n?.t("Please enter your Phone Number to get OTP") : "Please enter your Phone Number to get OTP"}
                  </p>
              }
              <div className="w-full signup my-10 text-start">
                {forgotPassClicked ? <ForgotPassword /> :
                  <LoginForm setOtpPhone={setOtpPhone} setOpenOtpModal={setOpenOtpModal}
                    settings={settings} />}
              </div>
              {
                forgotPassClicked === false &&
                <h3 onClick={() => {
                  setForgotPassClicked(true)
                }}
                  className="text-twContent-header text-[22px] font-medium hover:text-twSecondary-shade800 cursor-pointer">
                  {!!i18n.t ? i18n?.t("Forgot Password?") : "Forgot Password?"}</h3>
              }
              <p className="text-sm text-twContent mt-[10px]">
                {!!i18n.t ? i18n?.t("Do not have an account?") : "Do not have an account?"}
                <span onClick={() => setModalOpen(true)}
                  className="text-[#FDD835] first-letter hover:text-twSecondary-shade800 cursor-pointer"> {!!i18n.t ? i18n?.t("Create a new account") : "Create a new account"}</span>
              </p>
            </div>
          </div>
          <div className="my-10 flex gap-x-[8px] items-center text-[#A6A6A6]">
            <hr className=" w-1/2 " />
            <p className="text-[18px]">or</p>
            <hr className=" w-1/2" />
          </div>
          <SocialLogins />
        </div>
      </div>
      <SignUpModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <Toaster />
      <OtpModal modalOpen={openOtpModal} setModalOpen={setOpenOtpModal} otpPhone={otpPhone} resendOtp={true}
        action="resend" />
    </>
  );
}
export default Login;