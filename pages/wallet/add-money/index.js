import React, {useEffect} from "react";
import Card from "../../../components/common/card";
import {useI18n} from "../../../contexts/i18n";
import PaymentGatewayList from "../../../components/frontend/common/paymentGatewayList";
import {useRouter} from "next/router";
import {Skeleton} from "antd";

const AddMoney = () => {
    const i18n = useI18n();

    const paymentGateways = [
        {
            _id: "01",
            name: "Stripe",
            logo: "/assets/payment-gateway/stripe.svg",
        },
        {
            _id: "02",
            name: "paypal",
            logo: "/assets/payment-gateway/paypal.svg",
        },
        {
            _id: "03",
            name: "flutterwave",
            logo: "/assets/payment-gateway/flutter-wave.svg"
        },
    ];

    const {query, push} = useRouter();
    const {token} = query;

    useEffect(() => {
        if (token) {
            localStorage.setItem("authToken", token);
        }
    }, [token]);


    return (
        <>
            {
                token ?
                    <>
                        <Card>
                            <h1 className="text-lg">Choose your preferred Payment Gateway</h1>
                        </Card>
                        <div
                            className="w-full p-3 justify-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {paymentGateways?.map((paymentGateway) => (
                                <PaymentGatewayList
                                    key={paymentGateway?._id}
                                    name={paymentGateway?.name}
                                    logo={paymentGateway?.logo}
                                    redirectUrl="/wallet/add-money"
                                />
                            ))}
                        </div>
                    </>
                    :
                    <div className={'mt-[10%] px-[5%]'}>
                        <h1 className={'bg-gray-50 rounded py-3 text-center font-semibold tracking-wider'}>No Data</h1>
                        <Skeleton activ={true}/>
                        <Skeleton activ={true}/>
                        <Skeleton activ={true}/>
                    </div>
            }
        </>
    );
};

export default AddMoney;
