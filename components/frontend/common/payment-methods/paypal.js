import React from 'react';
import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js";
import {useState} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {PulseLoader} from "react-spinners";
import {fetchSettings, paypalDeposit, paypalPayment, postTipsPaypalPayment} from "../../../../helpers/backend_helper";
import {BsArrowRight} from 'react-icons/bs';
import {Loader} from '../../../common/preloader';
import {isAndroid, isIOS} from 'react-device-detect';
import {useFetch} from '../../../../helpers/hooks';


const PaypalCheckout = ({amount, countryCurrency, userEmail, transactionType, review}) => {
    const router = useRouter();
    const [paypalError, setPaypalError] = useState(null);
    const [initialLoad, setInitialLoad] = useState(false);
    const [refresh, setRefresh] = useState(null);
    const [submit, setSubmit] = useState(false);
    const [routeLoading, setRouteLoading] = useState(false)
    const [paymentComplete, setPaymentComplete] = useState(false)
    const [settings] = useFetch(fetchSettings)

    const tripId = router?.query?.tripId
    const userToken = router?.query?.token

    useEffect(() => {
        if (paymentComplete) {
            localStorage.clear()
            if (isAndroid) {
                const url =
                    "intent://cartogo.com/#Intent;scheme=car2gouser;package=bd.com.appstick.car2gouser;end";
                window.location.replace(url);
            } else if (isIOS) {
                window.location.replace("car2gouser://");
                setTimeout(() => {
                    window.location.replace(
                        "https://apps.apple.com/us/app/instagram/id389801252"
                    );
                }, 3000);
            }
            else {
                router.replace("/");
            }
        }
    }, [paymentComplete])

    setTimeout(() => {
        setInitialLoad(pre => pre = true)
        setRefresh(true)
    }, 5000);

    useEffect(() => {
        setRefresh(null)
    }, [refresh])

    // paypal
    const initialOptions = {
        "client-id": settings?.paypal?.credentials?.paypal_client_id,
        currency: countryCurrency,
        intent: "capture",
    };

    // paypal database info submit
    const handlePaymentPaypal = (details) => {
        let paymentData
        transactionType === 'payment'
            ?
            paymentData = {
                details,
                tripInfo: {
                    amount: amount,
                    description: "payment",
                    countryCurrency,
                    _id: tripId,
                }
            }
            :
            transactionType === "tipPayment" ?
                paymentData = {
                    details,
                    tips_amount: amount,
                    review
                }
                :
                paymentData = {
                    details,
                    amount: amount
                }

        // if payment : redirect to index -> redirect to app/ios/site (according to device)
        // if deposit : redirect to wallet index page
        transactionType === "payment" ?
            paypalPayment(paymentData).then(res => {

                if (res?.error === false) {
                    toast.success(res?.msg);
                    setRouteLoading(true)
                    setTimeout(async () => {
                        router.replace(`/payment/?tripId=${tripId}&token=${userToken}`)
                    }, 3000);
                } else {
                    toast.warning(res?.msg);
                }
            })
            : transactionType === "tipPayment" ? postTipsPaypalPayment(paymentData).then(res => {
                if (res?.error === false) {
                    toast.success(res?.msg);
                    setRouteLoading(true)
                    setTimeout(async () => {
                        setPaymentComplete(true)
                    }, 3000);
                } else {
                    toast.warning(res?.msg);
                }
            })
                : paypalDeposit(paymentData).then(res => {
                    if (res?.error === false) {
                        toast.success(res?.msg);
                        setTimeout(async () => {
                            await router.push('/user/wallet/summary')
                        }, 3000);
                    } else {
                        toast.warning(res?.msg);
                    }
                })
    }

    if (!!paypalError) {
        console.log(paypalError)
    }

    if (!!routeLoading) {
        return <div className='flex justify-center items-center' ><Loader /></div>
    }
    return (
        <div>
            {
                !submit ? <button
                    disabled={amount <= 0 || isNaN(amount)}
                    className='disabled:bg-gray-400 disabled:cursor-not-allowed rounded-[3px] bg-[#7269E0] py-2 px-3 text-white hover:shadow-lg transition duration-300 hover:-translate-y-1'
                    onClick={() => setSubmit(prev => !prev)}
                >
                    <div className='flex items-center justify-center gap-3'>
                        <span className='text-[18px] font-semibold'> <BsArrowRight /> </span>
                        <span className='custom_front'> Pay With Paypal </span>
                    </div>
                </button>
                    :
                    <PayPalScriptProvider options={initialOptions}>
                        {
                            initialLoad === true &&
                            < PayPalButtons
                                disabled={amount < 0 || isNaN(amount)}
                                className="disabled:cursor-not-allowed"
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: amount,
                                                },
                                            },
                                        ],
                                    });
                                }}
                                onApprove={async (data, actions) => {
                                    const order = await actions.order.capture();
                                    handlePaymentPaypal(data)
                                }}
                                onError={(err) => {
                                    setPaypalError(err)
                                }}
                            />
                        }
                        {
                            initialLoad === false &&
                            <span className="flex justify-center">
                                <PulseLoader color="purple" size={20} />
                            </span>
                        }
                    </PayPalScriptProvider>
            }


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
        </div>
    );
};

export default PaypalCheckout;