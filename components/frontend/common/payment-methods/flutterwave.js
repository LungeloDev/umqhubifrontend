import { closePaymentModal, FlutterWaveButton } from 'flutterwave-react-v3';
import { useRouter } from 'next/router';
import React, {useState} from 'react';
import {flutterwaveDeposit, flutterwaveTripPayment} from "../../../../helpers/backend_helper";
import {isAndroid, isIOS} from "react-device-detect";
import {toast,ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Loader} from "../../../common/preloader";

const Flutterwave = ({ userToken, amount, countryCurrency, userEmail, phone, name, siteName, siteLogo, userId, public_key, transactionType, tripId }) => {
    const { push } = useRouter()
    const [loading, setLoading] = useState(false);

    const config = {
        public_key: public_key,
        tx_ref: userId,
        amount: amount,
        currency: countryCurrency,
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: userEmail,
            phone_number: phone,
            name: name,
        },
        customizations: {
            title: siteName,
            description: 'Wallet money load',
            logo: siteLogo,
        },
    };

    const fwConfig = {
        ...config,
        text: 'Pay with Flutterwave!',
        callback: async (response) => {
            setLoading(true)
            if(transactionType === 'payment') {
                // trip payment
                const payload = {
                    "tx_ref": response?.tx_ref,
                    "transactionId": response?.transaction_id,
                    amount: amount,
                    countryCurrency,
                    tripId,
                }
                const backend_response = await flutterwaveTripPayment(payload)
                setLoading(false)
                if(backend_response?.error === false) {
                    closePaymentModal();
                    toast.success(backend_response?.msg);
                    setTimeout(async () => {
                        await push(`/payment/?tripId=${tripId}&token=${userToken}`);
                    }, 2500);
                }

            } else if(transactionType === 'tipPayment') {
                // tips payment

            } else {
                // wallet balance add
                const payload = {
                    "tx_ref": response?.tx_ref,
                    "transactionId": response?.transaction_id
                }
                const backend_response = await flutterwaveDeposit(payload)
                setLoading(false)
                if(backend_response?.error === false) {
                    toast.success(backend_response?.msg);
                    if (isAndroid) {
                        localStorage.clear()
                        closePaymentModal();
                        const url = "intent://cartogo.com/#Intent;scheme=car2gouser;package=bd.com.appstick.car2gouser;end";
                        window.location.replace(url);
                    } else if (isIOS) {
                        localStorage.clear()
                        closePaymentModal();
                        window.location.replace("car2gouser://");
                    }
                    else {
                        closePaymentModal();
                        await push("/user/wallet/summary");
                    }
                }
            }
        },
        onClose: () => { },
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    return (
        <>
            <div>
                <FlutterWaveButton
                    className='disabled:bg-gray-400 disabled:cursor-not-allowed rounded-[3px] bg-[#7269E0] py-2 px-3 text-white hover:shadow-lg transition duration-300 hover:-translate-y-1'
                    disabled={amount <= 0 || isNaN(amount)}
                    {...fwConfig}
                />
            </div>

            {/* toast message */}
            <ToastContainer
                position="bottom-center"
                autoClose={2700}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

export default Flutterwave;