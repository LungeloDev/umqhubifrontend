import React, {useState} from 'react';
import axios from 'axios';
import {useEffect} from 'react';
import {BsArrowRight} from 'react-icons/bs';
import {useRouter} from 'next/router';
import {toast, ToastContainer} from 'react-toastify';
import {fetchSiteSettings} from '../../../../helpers/backend_helper';

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


const MolliePayment = ({countryCurrency, amount, transactionType, review}) => {
    const router = useRouter();
    const [product, setProduct] = useState({});
    const [siteLogo, setSiteLogo] = useState('')
    const [mollieUrl, setMollieUrl] = useState(null)

    // fetch organization logo
    useEffect(() => {
        fetchSiteSettings().then(res => {
            if (res?.status === true) {
                setSiteLogo(res?.data?.logo)
            }
        })
    }, [])


    const handlePayment = async () => {
        let paymentData
        transactionType === "payment" ?
            paymentData = {
                price: amount,
                description: "Mollie",
                trip_id: router?.query?.tripId,
                currency: countryCurrency,
                redirectUrl: `http://localhost:3000/payment/?tripId=${router?.query?.tripId}&token=${router?.query?.token}`
            }
            : transactionType === "tipPayment" ?
                paymentData = {
                    tips_amount: amount,
                    review
                }
                :
                paymentData = {} //for deposit


        const token = `Bearer ${router?.query?.token}`
        const config = {
            headers: {Authorization: token}
        };
        // if payment : redirect to index -> redirect to app/ios/site (according to device)
        // if deposit : redirect to wallet index page (still needed to be done)
        // if tip     : redirect to app/ios/site (according to device)
        let data
        transactionType === "payment" ?
            data = await axios.post(`${process.env.backend_url}api/payment/mollie-payment`, paymentData, config)
            : transactionType === "tipPayment" ?
                data = await axios.post(`${process.env.backend_url}api/rating/driver/tips-mollie`, paymentData, config)
                : data

        window.open(data.data, 'popUpWindow', 'height=700,width=600,left=100,top=100, resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
    }


    return (
        <div className='text-center mt-20 mr-5'>
            <button
                onClick={handlePayment}
                disabled={amount <= 0 || isNaN(amount)} className='disabled:bg-gray-400 disabled:cursor-not-allowed rounded-[3px] bg-[#7269E0] py-2 px-3 text-white hover:shadow-lg transition duration-300 hover:-translate-y-1'>
                <div className='flex items-center justify-center gap-3'>
                    <span className='text-[18px] font-semibold'> <BsArrowRight /> </span>
                    <span className='custom_front'> Pay With Mollie </span>
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

export default MolliePayment;