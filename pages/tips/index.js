import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import RouteLoader, { Loader } from '../../components/common/preloader';
import { fetchProfile, fetchSiteSettings, fetchTrip, getWalletBrief } from '../../helpers/backend_helper';
import { useFetch } from '../../helpers/hooks';
import { Divider } from 'antd';
import { isAndroid, isIOS } from "react-device-detect";
import Link from 'next/link';

const Tips = () => {
    const [settings, setSettings] = useState(null)
    const [profile, setProfile] = useState(null)
    const { push, query, replace } = useRouter()
    const { tripId, token, rating, comment, tip_amount } = query
    const [trip, getTrip] = useFetch(fetchTrip, {}, false);
    const [wallet, getWallet] = useFetch(getWalletBrief, {}, false);

    useEffect(() => {
        if (token) {
            localStorage.setItem("authToken", token);
            getWallet()
        }
    }, [token])

    useEffect(() => {
        fetchSiteSettings().then(res => {
            setSettings(res?.data)
        })
        fetchProfile().then(res => {
            setProfile(res?.data)
        })

        // redirect according to device 
        if (trip?.due <= 0) {
            localStorage.clear();
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
                push("/");
            }
        }
    }, [trip, token])


    const handleWalletPayment = () => {
        replace(`/tips/wallet-payment/?tripId=${tripId}&tip_amount=${tip_amount}&rating=${rating}&comment=${comment}&token=${token}`)
    }

    const paymentGateways = [
        {
            _id: "01",
            name: "stripe",
            logo: "/assets/payment-gateway/stripe.svg"
        },
        {
            _id: "02",
            name: "paypal",
            logo: "/assets/payment-gateway/paypal.svg"
        },
        // {
        //     _id: "03",
        //     name: "ssl-commerz",
        //     logo: "/assets/payment-gateway/ssl-commerz.svg"
        // },
        {
            _id: "03",
            name: "razor-pay",
            logo: "/assets/payment-gateway/razor-pay.svg"
        },
        {
            _id: "04",
            name: "mollie",
            logo: "/assets/payment-gateway/mollie.svg"
        },
        // {
        //     _id: "06",
        //     name: "flutter-wave",
        //     logo: "/assets/payment-gateway/flutter-wave.svg"
        // },
    ]

    // stripe checkout props 
    const stripe = {
        userEmail: profile?.email,
        amount: tip_amount,
        countryCurrency: settings?.currency_name,
        transactionType: "payment",
    }
    // paypal checkout props 
    const paypal = {
        userEmail: profile?.email,
        amount: tip_amount,
        countryCurrency: settings?.currency_name,
        transactionType: "payment",
    }
    // flutterwave checkout props 
    const flutterWave = {
        userEmail: profile?.email,
        amount: tip_amount,
        countryCurrency: settings?.currency_name,
        name: profile?.name,
        phone: profile?.phone,
        siteName: settings?.site_name,
        siteLogo: settings?.logo,
        userId: profile?._id,
        transactionType: "payment",
    }

    if (!settings?.logo || !tip_amount || !wallet?.currentBalance || !profile?.name) {
        return <RouteLoader />
    }

    return (
        <div className='font-Poppins text-center mt-10 px-4 md:max-w-screen-md mx-auto'>
            {/* logo  */}

            <div><img className='mx-auto mb-10' src={settings?.logo}></img></div>

            {/* Fare  */}
            <div className='px-4 mx-auto justify-center items-center mb-16 '>
                <p className='text-xl text-left font-Poppins font-medium text-twContent my-3'>Hi {profile?.name}! Please pay <span className='font-extrabold text-twSecondary-shade800'>{settings?.currency_code} {tip_amount}</span> to the driver </p>
                <div className='text-left flex flex-col text-xl font-bold text-twContent'>
                    <div className='flex justify-between'>
                        <span>Amount to Pay: </span>
                        <span className='text-twSecondary-shade800'>{`${settings?.currency_code} ${tip_amount}`}</span>
                    </div>
                </div>
            </div>

            {/* wallet Payment  */}
            <div className='my-6 flex flex-col gap-3 items-center justify-center max-w-fit mx-auto'>
                {

                    <>
                        <p className='text-twContent-muted'>Your Wallet Balance: <span className={`${wallet?.currentBalance <= 0 ? "text-twError" : ""}`}>{`${settings?.currency_code} ${wallet?.currentBalance?.toFixed(2)}`}</span></p>
                        <button
                            onClick={handleWalletPayment}
                            disabled={wallet?.currentBalance <= tip_amount}
                            className='border-2 border-twSecondary-shade800 w-full px-6 py-3 text-twSecondary-shade800 font-bold rounded-md disabled:border-twContent-muted disabled:text-twContent-muted disabled:cursor-not-allowed'>
                            Pay From Wallet
                        </button>
                    </>
                }

            </div>
            <Divider className='font-semibold text-2xl'>Direct Payment</Divider>

            {/* list of payment gateway */}
            <div className='py-10'>
                <ul>
                    {
                        paymentGateways.map(gateway => (
                            <li key={gateway._id} className="bg-twPrimary-shade50 rounded-lg border !border-twSecondary-shade700 flex justify-between items-center mb-4 h-20 px-3 py-1">
                                <img src={gateway?.logo}></img>
                                <div className=" flex justify-end items-center">
                                    <Link href={`/tips/${gateway?.name}/?tripId=${tripId}&tip_amount=${tip_amount}&rating=${rating}&comment=${comment}&token=${token}`}><a className="text-blue-700 underline font-bold">Pay Now</a></Link>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div >
    );
};

export default Tips;