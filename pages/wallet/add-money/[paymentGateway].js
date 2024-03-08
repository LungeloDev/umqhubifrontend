import {Form} from "antd";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import Card from "../../../components/common/card";
import FormInput from "../../../components/form/input";
import Flutterwave from "../../../components/frontend/common/payment-methods/flutterwave";
import PaypalCheckout from "../../../components/frontend/common/payment-methods/paypal";
import StripePaymentGateway from "../../../components/frontend/common/payment-methods/StripePaymentGateway";
import {fetchProfile} from "../../../helpers/backend_helper";

const PaymentGateway = ({settings}) => {
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

    const stripe = {
        userEmail: profile?.email,
        amount: parseFloat(amount),
        countryCurrency: settings?.currency_name,
    };
    const paypal = {
        userEmail: profile?.email,
        amount: parseFloat(amount),
        countryCurrency: settings?.currency_name,
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
        public_key: settings?.flutterwave?.credentials?.public_key
    }

    return (
        <>
            <Card>
                <p>Add Money using {query?.paymentGateway}</p>
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
                        />
                        <div className="text-center">
                            {paymentGatewayName?.toLowerCase() === "stripe".toLowerCase() && (
                                <StripePaymentGateway {...stripe} />
                            )}
                            {paymentGatewayName?.toLowerCase() === "paypal".toLowerCase() && (
                                <PaypalCheckout {...paypal} />
                            )}
                            {paymentGatewayName?.toLowerCase() ===
                                "flutterwave".toLowerCase() && (
                                    <Flutterwave {...flutterWave} />
                                )}
                        </div>
                    </Form>
                </div>
            </Card>
        </>
    );
};

export async function getServerSideProps(context) {
    const authToken = context.query.access || '';
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
            settings: data?.data
        }
    }
}

export default PaymentGateway;
