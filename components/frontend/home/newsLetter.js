import {Form} from "antd";
import React from "react";
import {useI18n} from "../../../contexts/i18n";
import {postMarketingSubscribers} from "../../../helpers/backend_helper";
import {useAction} from "../../../helpers/hooks";
import FormInput from "../../form/input";

const NewsLetter = () => {
  const i18n = useI18n()
  const [form] = Form.useForm();

  return (
    <div className="container">
      <div className="my-20 bg-twPrimary-shade50 rounded-md py-12 border-2 border-[#FFE57E]">
        <h4 className="mb-10 font-medium text-3xl text-twContent text-center">
          {!!i18n?.t && i18n?.t("Get Subscribe for Newsletter")}
        </h4>
        <div className="flex justify-center">
          <Form
            form={form}
            onFinish={(values) =>
              useAction(postMarketingSubscribers, values, () => {
                form.resetFields();
              })
            }
            className="px-[20px] flex flex-col lg:flex-row gap-x-5 newsletter"
          >
            <div className="lg:w-[700px] md:w-[600px] w-[250px]">
              <FormInput
                layout="vertical"
                name={"email"}
                isEmail
                placeholder="Enter your email"
                required
              />
            </div>
            <button className=" mt-[12px] mx-auto h-fit lg:mt-0 md:ml-[20px] px-10 py-[18px] bg-twSecondary-shade800 hover:bg-twSecondary-shade700 text-white text-lg lg:text-xl font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              {!!i18n?.t && i18n?.t("Subscribe")}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
