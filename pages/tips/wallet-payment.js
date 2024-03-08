import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import RouteLoader, {Loader} from '../../components/common/preloader';
import {useSite} from '../../contexts/site';
import {fetchTrip, getWalletBrief, postTipsWalletPayment, postWalletPayment} from '../../helpers/backend_helper';
import {useAction, useFetch} from '../../helpers/hooks';
import {isAndroid, isIOS} from "react-device-detect";

const WalletPayment = () => {
    const [paymentComplete, setPaymentComplete] = useState(false)
    const {query, replace} = useRouter()
    const {currency_code, logo} = useSite()
    const {tripId, token, rating, comment, tip_amount} = query
    const [wallet, getWallet] = useFetch(getWalletBrief);

    useEffect(() => {
        if (token) {
            localStorage.setItem("authToken", token)
            getWallet()
        }
        if (paymentComplete) {
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
                replace("/");
            }

        }
    }, [token, paymentComplete])

    const handleWalletPayment = () => {
        const walletData = {
            tips_amount: parseFloat(tip_amount),
            review: {
                trip: tripId,
                rating: parseFloat(rating),
                comment,
            }

        }
        return useAction(postTipsWalletPayment, walletData, (res) => {

            if (res) {
                setPaymentComplete(true)
            }

        })
    }

    if (!currency_code || !tripId || !tip_amount || !wallet?.currentBalance || !logo) {
        return <RouteLoader />
    }

    if (paymentComplete) {
        return <div className='h-screen w-full flex justify-center items-center'><Loader /></div>
    }

    return (
        <div className='font-Poppins text-center mt-10 px-4 md:max-w-screen-md mx-auto'>
            <div className='px-4 mx-auto justify-center items-center mb-16'>
                <div><img className='mx-auto mb-10' src={logo}></img></div>
                <h1 className='text-2xl font-bold mb-4'>Pay from Wallet</h1>
                <div className='text-left flex flex-col text-xl font-semibold text-twContent'>
                    <div className='flex justify-between'>
                        <span>Amount to Pay: </span>
                        <span className='text-twSecondary-shade800'>{` ${currency_code ? currency_code : ""} ${tip_amount}`}</span>
                    </div>
                </div>
            </div>
            <p className='text-twContent-muted'>Your Wallet Balance: <span className={`${wallet?.currentBalance <= 0 ? "text-twError" : ""}`}>{`${currency_code ? currency_code : ""} ${wallet?.currentBalance?.toFixed(2)}`}</span></p>
            <button
                disabled={tip_amount <= 0}
                onClick={handleWalletPayment}
                className='mt-5 disabled:cursor-not-allowed disabled:text-twContent-muted disabled:bg-twContent-muted bg-twSecondary-shade800 text-white px-4 py-2 rounded-md'>Pay</button>
        </div>
    );
};

export default WalletPayment;