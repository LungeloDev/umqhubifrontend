import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import RouteLoader from "../../components/common/preloader";
import {
    fetchProfile,
    fetchSiteSettings,
    fetchTrip,
    getWalletBrief,
    paymentGatewayList,
} from "../../helpers/backend_helper";
import {useFetch} from "../../helpers/hooks";
import {Divider} from "antd";
import {isAndroid, isIOS} from "react-device-detect";

const Payment = () => {
    const [fare, setFare] = useState(null);
    const [settings, setSettings] = useState(null);
    const [profile, setProfile] = useState(null);

    const {push, query, replace} = useRouter();
    const {tripId, token} = query;

    const [trip, getTrip] = useFetch(fetchTrip, {}, false);
    const [wallet, getWallet] = useFetch(getWalletBrief, {}, false);
    const [paymentGatewayLists, getPaymentGatewayLists] = useFetch(paymentGatewayList);

    useEffect(() => {
        if (token) {
            localStorage.setItem("authToken", token);
            getTrip({_id: tripId});
            getWallet();
        }
    }, [tripId, token]);

    useEffect(() => {
        fetchSiteSettings().then((res) => {
            setSettings(res?.data);
        });
        fetchProfile().then((res) => {
            setProfile(res?.data);
        });
        setFare(trip?.total);

        // redirect according to device
        if (trip?.due <= 0) {
            if (isAndroid) {
                localStorage.clear();
                const url = `intent://cartogo.com?trip=${trip?._id}&driver=${trip?.driver?._id}#Intent;scheme=car2gouser;package=bd.com.appstick.car2gouser;end`;
                window.location.replace(url);
            } else if (isIOS) {
                localStorage.clear();
                const url = `car2gouser://open-rating?trip=${trip?._id}&driver=${trip?.driver?._id}`;
                window.location.replace(url);
            } else {
                localStorage.removeItem('selectedRideVehicle')
                localStorage.removeItem('currentFare')
                localStorage.removeItem('getUserFare')
                localStorage.removeItem('getUserFare')
                localStorage.removeItem('coupon')
                localStorage.removeItem('userLocation')
                localStorage.removeItem('selectedRideVehicle')
                localStorage.removeItem('nearestVehicles')
                push(`/user/ride-now/review-rating?trip=${trip?._id}`)
            }
        }
    }, [trip]);

    const handleWalletPayment = () => {
        replace(`/payment/wallet-payment/?tripId=${tripId}&token=${token}`);
    };

    if (
        !settings?.currency_code ||
        !fare ||
        !profile?.name ||
        !wallet ||
        !paymentGatewayLists
    ) {
        return <RouteLoader/>;
    }

    return (
        <div className="font-Poppins text-center mt-10 px-4 md:max-w-screen-md mx-auto">
            {/* logo  */}

            <div>
                <img className="mx-auto mb-10" src={settings?.logo}></img>
            </div>

            {/* Fare  */}

            <div className="px-4 mx-auto justify-center items-center mb-16 ">
                <p className="text-xl text-left font-Poppins font-medium text-twContent my-3">
                    Hi {profile?.name}! Please pay{" "}
                    <span className="font-extrabold text-twSecondary-shade800">
            {settings?.currency_code} {fare}
          </span>{" "}
                    to the driver{" "}
                </p>
                <div className="text-left flex flex-col text-xl font-bold text-twContent">
                    <div className="flex justify-between">
                        <span>Amount to Pay: </span>
                        <span className="text-twSecondary-shade800">{`${settings?.currency_code} ${fare}`}</span>
                    </div>
                    {trip?.paid > 0 && (
                        <>
                            <div className="flex justify-between">
                                <span>Paid: </span>
                                <span className="text-green-700">{`${settings?.currency_code} ${trip?.paid}`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Due: </span>
                                <span className="text-twError">{`${settings?.currency_code} ${trip?.due}`}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* wallet Payment  */}
            <div className="my-6 flex flex-col gap-3 items-center justify-center max-w-fit mx-auto">
                {
                    <>
                        <p className="text-twContent-muted">
                            Your Wallet Balance:{" "}
                            <span
                                className={`${
                                    wallet?.currentBalance <= 0 ? "text-twError" : ""
                                }`}
                            >{`${settings?.currency_code} ${(wallet?.currentBalance || 0)?.toFixed(
                                2
                            )}`}</span>
                        </p>
                        <button
                            onClick={handleWalletPayment}
                            disabled={wallet?.currentBalance <= 0}
                            className="border-2 border-twSecondary-shade800 w-full px-6 py-3 text-twSecondary-shade800 font-bold rounded-md disabled:border-twContent-muted disabled:text-twContent-muted disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            Pay From Wallet
                        </button>
                    </>
                }
            </div>
            <Divider className="font-semibold text-2xl">Direct Payment</Divider>

            {/* list of payment gateway */}
            <div className="py-10">
                <ul>
                    {
                        paymentGatewayLists?.gateways?.length &&
                        paymentGatewayLists?.gateways?.map((gateway, index) => {
                            return (<>
                                {
                                    gateway?.active && (<li
                                        onClick={async () => push(`/payment/${gateway?.name}/?tripId=${tripId}&token=${token}&total_fare=${trip?.due}`)}
                                        key={index}
                                        className="bg-twPrimary-shade50 hover:ring cursor-pointer rounded-lg border !border-twSecondary-shade700 flex justify-between items-center mb-4 h-20 px-3 py-1"
                                    >
                                        <img className="h-full w-fit" src={gateway?.image}></img>
                                        <div className=" flex justify-end items-center" onClick={async () => push(`/payment/${gateway?.name}/?tripId=${tripId}&token=${token}`)}>
                                            <a className="hidden md:block text-blue-700 underline font-bold">
                                                Pay Now
                                            </a>
                                        </div>
                                    </li>)
                                }
                            </>)
                        })
                    }
                </ul>
            </div>
        </div>
    );
};

export default Payment;
