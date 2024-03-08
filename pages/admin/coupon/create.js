import Link from "next/link";
import React, {useState, useEffect} from "react";
import {RiCouponFill} from "react-icons/ri";
import {InputNumber, Form, Input, DatePicker, Radio, Checkbox} from "antd";
import {useRouter} from "next/router";
import moment from "moment";
import {useAction} from "../../../helpers/hooks";
import {postCoupon} from "../../../helpers/backend_helper";
import {useSite} from "../../../contexts/site";
import {HiddenFormItem} from "../../../components/form/input";
import AdminLayout from "../../../layouts/admin";
import {useI18n} from "../../../contexts/i18n";

const AddCoupon = ({id, form, update = null, duration = false}) => {
    const site = useSite();
    const i18n = useI18n();
    const router = useRouter();
    const [radioValue, setRadioValue] = useState("");
    const [toggleDuration, setToggleDuration] = useState(duration);
    const [startDuration, setStartDuration] = useState(undefined);
    const [endDuration, setEndDuration] = useState(undefined);

    useEffect(() => {
        setToggleDuration(duration)
    }, [duration])

    const setTimeDuration = (e) => {
        setToggleDuration(pre => !pre)
    };
    const onChangeFromDuration = (date, dateString) => {
        setStartDuration(date)
    };
    const onChangeEndDuration = (date, dateString) => {
        setEndDuration(date)
    };

    // add new province form handler
    const onFinish = (values) => {
        setRadioValue(values?.target?.radioValue);
        values.start_duration = startDuration ? moment(startDuration).format() : undefined;
        values.end_duration = endDuration ? moment(endDuration).format() : undefined;
        return useAction(postCoupon, values, () => {
            router.push("/admin/coupon");
        })
    };

    return (
        <section>
            <section className="m-8">
                <div>
                    <h1 className="text-3xl font-light text-gray-700 pb-2">
                        {update ? "Update Coupon" : "Add New Coupon"}
                    </h1>
                    <div className="px-4 text-lg text-gray-500">
                        <Link href="/admin/coupon/">
                            <span className="text-[#9124A3] hover:cursor-pointer">
                                Coupon{" "}
                            </span>
                        </Link>
                        <span>/</span>
                        <span> {update ? "Update Coupon" : "Add New Coupon"} </span>
                    </div>
                </div>
            </section>
            <section className="mx-8 my-16">
                <div className="shadow-lg relative rounded bg-white p-4 ">
                    {/* upper style */}
                    <div className="h-12">
                        <div className="absolute w-16 h-16 shadow flex justify-center rounded -top-5 items-center bg-main">
                            <span>
                                <RiCouponFill
                                    size={30}
                                    className="text-white"
                                />
                            </span>
                        </div>
                        <span className="ml-20 text-xl text-gray-500">
                            {!!i18n && i18n?.t("Coupon Details")}
                        </span>
                    </div>
                    {/* add new province  */}
                    <div className="h-auto text-gray-500 text-base pb-2">
                        <div className="">
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                initialValues={{remember: true}}
                            >
                                <HiddenFormItem name="_id" />
                                {/* coupon name field */}
                                <Form.Item
                                    label="Coupon Code"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input your coupon name!",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter coupon code"
                                        bordered={false}
                                        style={{
                                            borderBottom: "1px solid #A7A7A7",
                                        }}
                                    />
                                </Form.Item>
                                {/* coupon type field */}
                                <div className="md:grid md:grid-cols-3 gap-4">
                                    <div>
                                        <Form.Item
                                            label="Coupon Type"
                                            name="type"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your coupon type!",
                                                },
                                            ]}
                                        >
                                            <Radio.Group value={radioValue}>
                                                <Radio value="percentage">
                                                    Percentage
                                                </Radio>
                                                <Radio value="amount">
                                                    Amount
                                                </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {/* coupon status field */}
                                        <Form.Item
                                            label="Coupon Status"
                                            name="status"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your coupon status!",
                                                },
                                            ]}
                                        >
                                            <Radio.Group value={radioValue}>
                                                <Radio value="active">
                                                    Active
                                                </Radio>
                                                <Radio value="disabled">
                                                    Disable
                                                </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="md:grid md:grid-rows-2 ">
                                            <div className="md:grid md:grid-cols-2 gap-4">
                                                {/* coupon value field */}
                                                <Form.Item
                                                    label="Coupon Value"
                                                    name="value"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please input your coupon value!",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Enter coupon value"
                                                        bordered={false}
                                                        style={{
                                                            borderBottom:
                                                                "1px solid #A7A7A7",
                                                            width: '200px'
                                                        }}
                                                    />
                                                </Form.Item>
                                                {/* coupon Minimum Amount field */}
                                                <Form.Item
                                                    label={`Coupon Minimum Amount (${site?.currency_name})`}
                                                    name="coupon_minimum_amount"
                                                    rules={[
                                                        {
                                                            required: false,
                                                            message:
                                                                "Please input your coupon minimum amount!",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Enter coupon minimum amount"
                                                        bordered={false}
                                                        style={{
                                                            borderBottom:
                                                                "1px solid #A7A7A7",
                                                            width: '200px'
                                                        }}
                                                    />
                                                </Form.Item>
                                            </div>
                                            {/* Coupon Description field */}
                                            <div>
                                                <Form.Item
                                                    label="Coupon Description"
                                                    name="coupon_description"
                                                    rules={[
                                                        {
                                                            required: false,
                                                            message:
                                                                "Please input your coupon description!",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="Write the coupon description for understanding the offer"
                                                        bordered={false}
                                                        style={{
                                                            borderBottom:
                                                                "1px solid #A7A7A7",
                                                        }}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                {/* set time */}
                                <div className="md:flex md:gap-14 mt-4">
                                    <Form.Item
                                        label="Set Coupon Duration Time"
                                        name="set_duration"
                                        rules={[
                                            {
                                                required: false,
                                                message:
                                                    "Please input your coupon status!",
                                            },
                                        ]}
                                    >
                                        <Checkbox onChange={setTimeDuration} checked={toggleDuration}>Checkbox</Checkbox>
                                    </Form.Item>
                                    {/* set time */}
                                    {
                                        toggleDuration === true &&
                                        <Form.Item
                                            label="Start Coupon Time"
                                            name="start_duration"
                                            rules={[
                                                {
                                                    required: false,
                                                    message:
                                                        "This field is required",
                                                },
                                            ]}
                                        >
                                            <DatePicker onChange={onChangeFromDuration} />
                                        </Form.Item>
                                    }
                                    {/* set time */}
                                    {
                                        toggleDuration === true &&
                                        <Form.Item
                                            label="End Coupon Time"
                                            name="end_duration"
                                            rules={[
                                                {
                                                    required: false,
                                                    message:
                                                        "This field is required",
                                                },
                                            ]}
                                        >
                                            <DatePicker onChange={onChangeEndDuration} />
                                        </Form.Item>
                                    }
                                </div>
                                <div className="flex justify-end ">
                                    <Form.Item>
                                        <button
                                            type="submit"
                                            className="bg-main hover:transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg w-48 mr-14 px-6 py-2 rounded text-twContent"
                                        >
                                            Save
                                        </button>
                                    </Form.Item>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
};
AddCoupon.layout = AdminLayout;
export default AddCoupon;
