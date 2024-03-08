import React from "react";
import { Form } from "antd";
import FormInput from "../../form/input";
import PhoneNumberInput from "../../form/PhoneInput";
import Button from "../../common/button";
import { Loader } from "../../common/preloader";
import { postContactUs } from "../../../helpers/backend_helper";
import { useAction } from "../../../helpers/hooks";

const ContactUsComponent = ({ data }) => {
  const [form] = Form.useForm();

  if (!data) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto mt-10 mb-20">
      <h2 className="font-semibold text-[32px] mt-[4px] mx-auto text-twContent-header text-center">
        Address
      </h2>
      <div className="text-twContent-light text-lg font-medium mt-[20px] text-center">
        <div className="capitalize mb-4">
          {data?.content?.contact_page?.value?.map?.value?.address}{" "}
          {data?.content?.contact_page?.value?.map?.value?.state && " , "}
          {data?.content?.contact_page?.value?.map?.value?.state}{" "}
          {data?.content?.contact_page?.value?.map?.value?.zip_code}{" , "}
          {data?.content?.contact_page?.value?.map?.value?.country} <br />
        </div>
        <span className="font-bold">Call</span> :
        {data?.content?.contact_page?.value?.phone?.value?.map((phone, i) => (
          <span key={i}>
            {" "}
            {phone}
            {data?.content?.contact_page?.value?.phone?.value.length !==
              i + 1 && ", "}
          </span>
        ))}
        <br />
        <span className="font-bold"> Email</span> :
        {data?.content?.contact_page?.value?.email?.value?.map((email, i) => (
          <span key={i}>
            {" "}
            {email}
            {data?.content?.contact_page?.value?.email?.value.length !==
              i + 1 && ", "}
          </span>
        ))}
      </div>

      <div className="w-full contact mt-10">
        <Form
          layout="vertical"
          name="contact"
          form={form}
          onFinish={(values) => {
            useAction(postContactUs, values, () => {
              form.resetFields();
            });
          }}
        >
          <FormInput
            placeholder={"Enter Your Name"}
            name={"name"}
            label={"Your Name"}
            required
          />
          <FormInput name={"email"} placeholder={"Enter Your Email"} label={"Email Address"} isEmail required />
          <PhoneNumberInput
            name={"phone"}
            label={"Phone"}
            placeholder={"Your Phone number"}
          />
          <FormInput name={"message"} placeholder={"Enter Your Message"} label={"Message"} type={"textArea"} required />
          <Button className="!bg-twSecondary-shade800 hover:!bg-twSecondary-shade700 !text-white !text-base !font-medium !py-[12px] !px-[28px] mt-6">
            Send Message
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ContactUsComponent;
