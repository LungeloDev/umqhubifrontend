import React, {useState} from 'react';
import axios from 'axios';
import {useEffect} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import {useRouter} from 'next/router';
import {fetchSettings, fetchSiteSettings} from '../../../../helpers/backend_helper';
import {BsArrowRight} from 'react-icons/bs';
import {Loader} from '../../../common/preloader';
import {useFetch} from '../../../../helpers/hooks';

// load js script
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}


const RazorPay = ({countryCurrency, amount}) => {
    const router = useRouter();
    const [siteLogo, setSiteLogo] = useState('');
    const [routeLoader, setRouteLoader] = useState(false);
    const [settings] = useFetch(fetchSettings)

    // fetch organization logo
    useEffect(() => {
        fetchSiteSettings().then(res => {
            if (res?.status === true) {
                setSiteLogo(res?.data?.logo)
            }
        })
    }, [])


    // payment verification
    const initPayment = (data) => {
        const options = {
            key: settings?.razorpay_client_id,
            amount: amount,
            currency: countryCurrency,
            description: "Razor Pay",
            image: siteLogo,
            order_id: data.id,
            handler: async (response) => {
                try {
                    const token = `Bearer ${router?.query?.token}`
                    const config = {
                        headers: {Authorization: token}
                    };
                    const razorPayData = {response, product: {trip_id: router?.query?.tripId, amount: amount, currency: countryCurrency, }}
                    // if payment : redirect to index -> redirect to app/ios/site (according to device)
                    // if deposit : redirect to wallet index page (need to be done)
                    const verifyUrl = `${process.env.backend_url}api/payment/razorpay-verify`;
                    const {data} = await axios.post(verifyUrl, razorPayData, config);
                    if (data?.error === false) {
                        toast.success(data?.msg)
                        setTimeout(() => {
                            router.replace(`/payment/?tripId=${router?.query?.tripId}&token=${router?.query?.token}`)
                        }, 2700);
                        setRouteLoader(true)
                    }
                } catch (error) {
                    console.log("error ", error);
                }
            },
            theme: {
                color: "#5D3FD3",
            },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };


    const handlePayment = async () => {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        if (res === false) {
            alert('Razorpay SDK failed to load!')
            return
        }
        try {
            const token = `Bearer ${router?.query?.token}`
            const config = {
                headers: {Authorization: token}
            };
            const orderUrl = `${process.env.backend_url}api/payment/razorpay`;
            const {data} = await axios.post(orderUrl, {amount: amount, currency: countryCurrency, product: {trip_id: router?.query?.tripId}}, config);
            initPayment(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!!routeLoader) {
        return <div className='flex justify-center items-center'><Loader /></div>
    }

    return (
        <div className='text-center  mt-20 mr-5'>
            <button
                onClick={handlePayment}
                disabled={amount <= 0 || isNaN(amount)} className='disabled:bg-gray-400 disabled:cursor-not-allowed rounded-[3px] bg-[#7269E0] py-2 px-3 text-white hover:shadow-lg transition duration-300 hover:-translate-y-1'>
                <div className='flex items-center justify-center gap-3'>
                    <span className='text-[18px] font-semibold'> <BsArrowRight /> </span>
                    <span className='custom_front'> Pay With Razor Pay </span>
                </div>
            </button>

            {/* toast message */}
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
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

export default RazorPay;