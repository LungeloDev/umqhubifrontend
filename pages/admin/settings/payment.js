import AdminLayout from "../../../layouts/admin";
import PageTitle from "../../../components/common/page-title";
import {Form, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import {useI18n} from "../../../contexts/i18n";
import { useFetch} from "../../../helpers/hooks";
import {fetchPaymentsSettings, fetchSettings} from "../../../helpers/backend_helper";
import SslcommerzPaymentMethod from "../../../components/admin/payment-methods/sslcommerz";
import StripePaymentMethod from "../../../components/admin/payment-methods/stripe";
import PaypalPaymentMethod from "../../../components/admin/payment-methods/paypal";
import RezorPayPaymentMethod from "../../../components/admin/payment-methods/rezorpay";
import MolliePaymentMethod from "../../../components/admin/payment-methods/mollie";
import FlutterwavePaymentMethod from "../../../components/admin/payment-methods/flutterwave";

const PaymentSettings = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [settings, getSettings] = useFetch(fetchSettings)
    const [logo, setLogo] = useState('/img/shops.png')

    useEffect(() => {
        if (settings) {
            form.setFieldsValue({
                ...settings,
                logo: undefined,
            })
            setLogo(settings?.logo || '/img/shops.png')
        }
    }, [settings])

    return (
        <>
            <PageTitle title={!!i18n && i18n?.t("Payment Settings")} />
            <div className={'bg-white p-4 rounded'}>
                <Tabs type="card" defaultActiveKey="1" centered>
                    {/* sslcommerz payment method */}
                    <Tabs.TabPane tab="SSLCOMMERZ" key="1">
                        <SslcommerzPaymentMethod/>
                    </Tabs.TabPane>

                    {/* Stripe payment method */}
                    <Tabs.TabPane tab="Stripe" key="2">
                        <StripePaymentMethod/>
                    </Tabs.TabPane>

                    {/* PayPal payment method */}
                    <Tabs.TabPane tab="PayPal" key="3">
                        <PaypalPaymentMethod/>
                    </Tabs.TabPane>

                    {/* Razorpay payment method */}
                    <Tabs.TabPane tab="Razorpay" key="4">
                        <RezorPayPaymentMethod/>
                    </Tabs.TabPane>

                    {/* Mollie payment method */}
                    <Tabs.TabPane tab="Mollie" key="5">
                        <MolliePaymentMethod/>
                    </Tabs.TabPane>

                    {/* Flutter-wave payment method */}
                    <Tabs.TabPane tab="Flutterwave" key="6">
                        <FlutterwavePaymentMethod/>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </>
    )
}

PaymentSettings.layout = AdminLayout
export default PaymentSettings
