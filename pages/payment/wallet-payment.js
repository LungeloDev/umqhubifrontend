import {Form} from 'antd';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import RouteLoader from '../../components/common/preloader';
import FormInput from '../../components/form/input';
import {useSite} from '../../contexts/site';
import {fetchTrip, getWalletBrief, postWalletPayment} from '../../helpers/backend_helper';
import {useAction, useFetch} from '../../helpers/hooks';

const WalletPayment = () => {
    const [paymentAmount, setPaymentAmount] = useState(0);

    const {query, replace} = useRouter()
    const {currency_code, logo} = useSite()
    const [fare, setFare] = useState(null);

    const {tripId, token} = query
    const [trip, getTrip] = useFetch(fetchTrip, {}, false);
    const [wallet, getWallet] = useFetch(getWalletBrief)


    useEffect(() => {
        if (token) {
            localStorage.setItem("authToken", token)
            getTrip({_id: tripId});
            getWallet()
        }

    }, [tripId, token])
    useEffect(() => {
        setFare(trip?.total)
    }, [trip])

    const handleWalletPayment = () => {
        const walletData = {
            trip_id: tripId,
            wallet_amount: paymentAmount
        }
        useAction(postWalletPayment, walletData, (res) => {
            if (res.due >= 0) {
                replace(`/payment?tripId=${tripId}&token=${token}`)
            }

        })
    }

    if (!currency_code || !tripId || !fare) {
        return <RouteLoader />
    }
    return (
        <div className='font-Poppins text-center mt-10 px-4 md:max-w-screen-md mx-auto'>
            <div className='px-4 mx-auto justify-center items-center mb-16'>
                <div><img className='mx-auto mb-10' src={logo}></img></div>
                <h1 className='text-2xl font-bold mb-4'>Pay from Wallet</h1>
                <div className='text-left flex flex-col text-xl font-semibold text-twContent'>
                    <div className='flex justify-between'>
                        <span>Amount to Pay: </span>
                        <span className='text-twSecondary-shade800'>{` ${currency_code ? currency_code : ""} ${fare}`}</span>
                    </div>
                    {
                        trip?.paid > 0 &&
                        <>
                            <div className='flex justify-between'>
                                <span>Paid: </span>
                                <span className='text-green-700'>{`${currency_code ? currency_code : ""} ${trip?.paid}`}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>Due: </span>
                                <span className='text-twError'>{`${currency_code ? currency_code : ""} ${trip?.due}`}</span>
                            </div>
                        </>
                    }
                </div>
            </div>
            <p className='text-twContent-muted'>Your Wallet Balance: <span className={`${wallet?.currentBalance <= 0 ? "text-twError" : ""}`}>{`${currency_code ? currency_code : ""} ${wallet?.currentBalance?.toFixed(2)}`}</span></p>
            <Form
                layout="vertical"
            >
                <FormInput
                    type={"text"}
                    label={"Amount"}
                    name={"amount"}
                    required
                    onChange={(e) => setPaymentAmount(e.target.value)}
                />
                <button
                    disabled={paymentAmount <= 0}
                    onClick={handleWalletPayment}
                    className='disabled:cursor-not-allowed disabled:text-twContent-muted disabled:bg-twContent-muted bg-twSecondary-shade800 text-white px-4 py-2 rounded-md'>Pay</button>
            </Form>
        </div>
    );
};

export default WalletPayment;