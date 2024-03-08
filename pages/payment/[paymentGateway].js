import {Card, Form} from "antd";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import FormInput from "../../components/form/input";
import Flutterwave from "../../components/frontend/common/payment-methods/flutterwave";
import MolliePayment from "../../components/frontend/common/payment-methods/mollie";
import PaypalCheckout from "../../components/frontend/common/payment-methods/paypal";
import RazorPay from "../../components/frontend/common/payment-methods/razorpay";
import StripePaymentGateway from "../../components/frontend/common/payment-methods/StripePaymentGateway";
import {fetchProfile} from "../../helpers/backend_helper";

const PaymentGateway = ({settings, tripId, token}) => {
    const [paymentGatewayName, setPaymentGatewayName] = useState(null);
    const {query} = useRouter();
    const [profile, setProfile] = useState(null);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        fetchProfile().then((res) => {
            setProfile(res?.data);
        });
        setPaymentGatewayName(query?.paymentGateway);
    }, []);

    useEffect(()=>{
        setAmount(query?.total_fare)
    },[query?.total_fare])

    const stripe = {
        userEmail: profile?.email,
        amount: parseFloat(amount),
        countryCurrency: settings?.currency_name,
        transactionType: "payment",
    };
    const paypal = {
        userEmail: profile?.email,
        amount: parseFloat(amount),
        countryCurrency: settings?.currency_name,
        transactionType: "payment",
    };
    const razorPay = {
        userEmail: profile?.email,
        amount: parseFloat(amount),
        countryCurrency: settings?.currency_name,
        transactionType: "payment",
    };
    const mollie = {
        userEmail: profile?.email,
        amount: parseFloat(amount),
        countryCurrency: settings?.currency_name,
        transactionType: "payment",
    };
    const flutterWave = {
        userEmail: profile?.email,
        amount: parseFloat(amount),
        countryCurrency: (settings?.currency_name || '')?.toUpperCase(),
        name: profile?.name,
        phone: profile?.phone,
        siteName: settings?.site_name,
        siteLogo: settings?.logo,
        userId: profile?._id,
        public_key: settings?.flutterwave?.credentials?.public_key,
        transactionType: "payment",
        tripId: tripId,
        userToken: token
    };

    return (
        <div className="max-w-sm mx-auto pt-20 px-4">
            <Card>
                <p>Pay using {query?.paymentGateway}</p>
            </Card>
            <Card>
                <div className="w-4/5 mx-auto">
                    <Form layout="vertical">
                        <FormInput
                            type={"text"}
                            label={"Amount"}
                            name={"amount"}
                            required
                            onChange={(e) => setAmount(e.target.value)}
                            initialValue={query?.total_fare || 0}
                        />
                        <div className="text-center">
                            {paymentGatewayName?.toLowerCase() === "stripe".toLowerCase() && (
                                <StripePaymentGateway {...stripe} />
                            )}
                            {paymentGatewayName?.toLowerCase() === "paypal".toLowerCase() && (
                                <PaypalCheckout {...paypal} />
                            )}
                            {paymentGatewayName?.toLowerCase() === "flutterwave".toLowerCase() && (
                                <Flutterwave {...flutterWave} />
                            )}
                            {paymentGatewayName?.toLowerCase() === "razor-pay".toLowerCase() && <RazorPay {...razorPay} />}
                            {paymentGatewayName?.toLowerCase() === "mollie".toLowerCase() && (<MolliePayment {...mollie} />)}
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export async function getServerSideProps(context) {
    const authToken = context.query.token || '';
    const config = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    };
    const res = await fetch(process.env.backend_url + 'api/settings', config)
    const data = await res.json()
    return {
        props: {
            settings: data?.data,
            tripId: context.query.tripId,
            token: context.query.token,
        }
    }
}

export default PaymentGateway;
