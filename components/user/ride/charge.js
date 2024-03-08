import React from 'react';
import {HiArrowLongRight} from "react-icons/hi2";

const RideCharge = ({chargedData, site, coupon, storedData}) => {

    return (
        <div className={'mt-3 space-y-3'}>
            <h1 className={'text-gray-600 font-semibold tracking-wider pb-2 pt-4'}>Charge</h1>
            <div className={'border py-2 rounded-lg px-1 grid grid-cols-3 justify-items-start items-center'}>
                <p className={'text-center whitespace-pre'}>Fares</p>
                <p className={'text-center whitespace-pre w-full flex justify-center'}><HiArrowLongRight className={'text-center'} /></p>
                <p className={'text-center whitespace-pre'}>{site?.currency_code || ''}{chargedData?.fares}</p>
            </div>
            <div className={'border py-2 rounded-lg px-1 grid grid-cols-3 justify-items-start items-center'}>
                <p className={'text-center whitespace-pre'}>Additional Fares</p>
                <p className={'text-center whitespace-pre w-full flex justify-center'}><HiArrowLongRight className={'text-center'} /></p>
                <p className={'text-center whitespace-pre'}>{site?.currency_code || ''}{chargedData?.additional_fares}</p>
            </div>
            <div className={'border py-2 rounded-lg px-1 grid grid-cols-3 justify-items-start items-center'}>
                <p className={'text-center whitespace-pre'}>Subtotal</p>
                <p className={'text-center whitespace-pre w-full flex justify-center'}><HiArrowLongRight className={'text-center'} /></p>
                <p className={'text-center whitespace-pre capitalize'}>{site?.currency_code || ''}{chargedData?.subtotal}</p>
            </div>
            <div className={'border py-2 rounded-lg px-1 grid grid-cols-3 justify-items-start items-center'}>
                <p className={'text-center whitespace-pre'}>Vat ({chargedData?.vat})</p>
                <p className={'text-center whitespace-pre w-full flex justify-center'}><HiArrowLongRight className={'text-center'} /></p>
                <p className={'text-center whitespace-pre capitalize'}>{site?.currency_code || ''}{chargedData?.vat_amount}</p>
            </div>
            {
                (coupon?.saved_money || (+storedData?.coupon?.saved_money > 0)) &&
                <div className={'border py-2 rounded-lg px-1 grid grid-cols-3 justify-items-start items-center text-teal-500'}>
                    <p className={'text-center whitespace-pre'}>Saved Money</p>
                    <p className={'text-center whitespace-pre w-full flex justify-center'}><HiArrowLongRight className={'text-center'}/></p>
                    <p className={'text-center whitespace-pre capitalize'}> - {site?.currency_code || ''}{coupon?.saved_money || storedData?.coupon?.saved_money}</p>
                </div>
            }

            <div className={'border py-2 rounded-lg px-1 grid grid-cols-3 justify-items-start items-center'}>
                <p className={'text-center text-gray-600 font-semibold tracking-wider'}>Total</p>
                <p className={'text-center whitespace-pre w-full flex justify-center'}><HiArrowLongRight className={'text-center'} /></p>
                <p className={'text-center text-gray-600 font-semibold tracking-wider whitespace-pre capitalize'}>{site?.currency_code || ''}{chargedData?.total}</p>
            </div>
        </div>
    );
};

export default RideCharge;