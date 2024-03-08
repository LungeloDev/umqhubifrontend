import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form } from "antd";
import AddCoupon from "./create";
import moment from "moment";
import { fetchCoupon } from "../../../helpers/backend_helper";
import { useSite } from "../../../contexts/site";
import { useFetch } from "../../../helpers/hooks";
import AdminLayout from "../../../layouts/admin";


const EditCoupon = () => {
    const site = useSite();
    const { query, push } = useRouter();
    const [form] = Form.useForm();
    const [coupon, getCoupon, { loading, error }] = useFetch(fetchCoupon, query);
    const [duration, setDuration] = useState();

    // form initialization
    useEffect(() => {
        if (!!coupon?._id) {
            let durationStatus = false;
            if (!!coupon?.start_duration || !!coupon?.end_duration) {
                durationStatus = true
            }
            form.resetFields();
            form.setFieldsValue({
                ...coupon,
                start_duration: moment(coupon?.start_duration),
                end_duration: moment(coupon?.end_duration),
                set_duration: durationStatus,
            });
            setDuration(form.getFieldsValue().set_duration);
        }
    }, [coupon?._id]);

    return (
        <div>
            <AddCoupon id={query?._id} form={form} update='request' editTrue={true} duration={duration} />
        </div>
    );
};
EditCoupon.layout = AdminLayout;
export default EditCoupon;
