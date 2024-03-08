import { Card, Form } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RouteLoader, { Loader } from "../../components/common/preloader";
import FormInput from "../../components/form/input";
import Flutterwave from "../../components/frontend/common/payment-methods/flutterwave";
import MolliePayment from "../../components/frontend/common/payment-methods/mollie";
import PaypalCheckout from "../../components/frontend/common/payment-methods/paypal";
import RazorPay from "../../components/frontend/common/payment-methods/razorpay";
import StripePaymentGateway from "../../components/frontend/common/payment-methods/StripePaymentGateway";
import { fetchProfile, fetchSiteSettings } from "../../helpers/backend_helper";


const PaymentGateway = () => {
    const [paymentGatewayName, setPaymentGatewayName] = useState(null)
    const { query } = useRouter();
    const [settings, setSettings] = useState(null)
    const [profile, setProfile] = useState(null)
    const [amount, setAmount] = useState(null)

    useEffect(() => {
        fetchSiteSettings().then(res => {
            setSettings(res?.data)
        })
        fetchProfile().then(res => {
            setProfile(res?.data)
        })
        setPaymentGatewayName(query?.paymentGateway)
        setAmount(query?.tip_amount)
    }, [query?.paymentGateway, query?.tip_amount])

    const stripe = {
        userEmail: profile?.email,
        amount: parseFloat(amount),
        countryCurrency: settings?.currency_name,
        review: {
            trip: query?.tripId,
            rating: query?.rating,
            comment: query?.comment
        },
        transactionType: "tipPayment",
    }
    const paypal = {
        userEmail: profile?.email,
        amount: parseFloat(amount),
        countryCurrency: settings?.currency_name,
        review: {
            trip: query?.tripId,
            rating: query?.rating,
            comment: query?.comment
        },
        transactionType: "tipPayment",
    }
    const razorPay = {
        userEmail: profile?.email,
        amount: parseFloat(amount),
        countryCurrency: settings?.currency_name,
        review: {
            trip: query?.tripId,
            rating: query?.rating,
            comment: query?.comment
        },
        transactionType: "tipPayment",
    }
    const mollie = {
        userEmail: profile?.email,
        amount: parseFloat(amount),
        countryCurrency: settings?.currency_name,
        review: {
            trip: query?.tripId,
            rating: query?.rating,
            comment: query?.comment
        },
        transactionType: "tipPayment",
    }
    const flutterWave = {
        userEmail: profile?.email,
        amount: parseFloat(amount),
        countryCurrency: settings?.currency_name,
        name: profile?.name,
        phone: profile?.phone,
        siteName: settings?.site_name,
        siteLogo: settings?.logo,
        userId: profile?._id,
        review: {
            trip: query?.tripId,
            rating: query?.rating,
            comment: query?.comment
        },
        transactionType: "tipPayment",
    }

    if (!query?.paymentGateway || !amount) {
        return <RouteLoader />
    }
    return (
        <div className="max-w-sm mx-auto pt-20 px-4">
            <Card>
                <p>Pay using {query?.paymentGateway}</p>
            </Card>
            <Card>
                <div className='w-4/5 mx-auto'>
                    <Form
                        layout="vertical"
                    >
                        <FormInput
                            type={"text"}
                            label={"Amount"}
                            name={"amount"}
                            required
                            readOnly={true}
                            initialValue={amount}
                        />
                        <div className='text-center'>
                            {paymentGatewayName?.toLowerCase() === "stripe".toLowerCase() && <StripePaymentGateway {...stripe} />}
                            {paymentGatewayName?.toLowerCase() === "paypal".toLowerCase() && <PaypalCheckout {...paypal} />}
                            {paymentGatewayName?.toLowerCase() === "flutterwave".toLowerCase() && <Flutterwave {...flutterWave} />}
                            {paymentGatewayName?.toLowerCase() === "razor-pay".toLowerCase() && <RazorPay {...razorPay} />}
                            {paymentGatewayName?.toLowerCase() === "mollie".toLowerCase() && <MolliePayment {...mollie} />}
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default PaymentGateway;