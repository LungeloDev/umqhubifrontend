import React, {useEffect, useState} from 'react';
import {fetchPaymentGateways} from "../../../helpers/backend_helper";

const PaymentGateways = ({selectedPaymentMethod, setSelectedPaymentMethod}) => {
    const [gateways, setGateways] = useState([]);
    useEffect(() => {
        fetchPaymentGateways().then(res => {
            if (res?.error === false) {
                setGateways(res?.data?.gateways)
            }
        })
    }, [])
    return (
        <div className={'mt-2 max-h-56 scroll-smooth overflow-y-scroll paymentMethods border p-3 rounded-lg'}>
            {
                gateways?.map((data, i) =>
                   <>
                       {
                           data?.active === true &&
                           <div onClick={async () => setSelectedPaymentMethod(data) } className={`${selectedPaymentMethod?.name === data?.name ? "bg-main":"bg-main2"} cursor-pointer hover:bg-main grid grid-cols-3 p-2 mb-2 border rounded-md`}>
                               <img src={data?.image} alt="gateways" className={'h-4'} />
                               <h1 className={'col-span-2 capitalize text-grey-600  tracking-wider'}>
                                   {data?.name}
                               </h1>
                           </div>
                       }
                   </>
                )
            }
        </div>
    );
};

export default PaymentGateways;