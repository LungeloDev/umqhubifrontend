import React from 'react';
import Card from '../../../../components/common/card';
import PaymentGatewayList from '../../../../components/frontend/common/paymentGatewayList';
import { useI18n } from '../../../../contexts/i18n';
import UserLayout from '../../../../layouts/user';

const AddMoney = () => {
    const i18n = useI18n();
    const paymentGateways = [
        {
            _id: "01",
            name: "Stripe",
            logo: "/assets/payment-gateway/stripe.svg"
        },
        {
            _id: "02",
            name: "paypal",
            logo: "/assets/payment-gateway/paypal.svg"
        },
        {
            _id: "03",
            name: "flutterwave",
            logo: "/assets/payment-gateway/flutter-wave.svg"
        },
    ]

    return (
        <>
            <Card>
                <h1 className='text-lg'>{!!i18n && i18n?.t("Choose your preferred Payment Gateway")}</h1>
            </Card>
            <div className='mx-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {
                    paymentGateways?.map(paymentGateway => <PaymentGatewayList key={paymentGateway?._id} name={paymentGateway?.name} logo={paymentGateway?.logo} />)
                }
            </div>
        </>
    );
};
AddMoney.layout = UserLayout
export default AddMoney;