import React from 'react';
import Swal from 'sweetalert2';
import swalAlert from '../../components/common/alert';
import Card from '../../components/common/card';
import RouteLoader from '../../components/common/preloader';
import {useI18n} from '../../contexts/i18n';
import {getUserCouponOffers} from '../../helpers/backend_helper';
import {useFetch} from '../../helpers/hooks';
import UserLayout from '../../layouts/user';
import {useSite} from '../../contexts/site';

const UserOffer = () => {
    const i18n = useI18n();
    const {currency_code} = useSite()
    const [couponOffers] = useFetch(getUserCouponOffers)

    const handleClick = (code) => {
        navigator.clipboard.writeText(code)
        Swal.fire({

            html: `<div class="space-y-5">
                <h3 class="font-bold text-twContent font-2lx">Copied to clipboard</h3>
                <div class="font-bold text-twSecondary-shade800 font-xl">${code}</div>
            </div>`,

        })
    }

    if (couponOffers?.length <= 0) {
        return <RouteLoader />
    }

    return (
        <>
            <Card>
                <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n?.t && i18n?.t("Offers")}</h1>
            </Card>

            <Card>
                <div className='max-w-screen-sm mx-auto '>
                    {
                        couponOffers?.map(coupon => <div key={coupon?._id} className='flex justify-between items-center border !border-twPrimary rounded-lg px-[14px] py-[15px] my-2'>
                            <div>
                                <p className='font-medium text-twWarning text-base'>{coupon?.value}{coupon?.type === "amount" ? currency_code : "%"} off</p>
                                <p className='font-normal text-twContent-muted'>{coupon?.coupon_description}</p>
                            </div>
                            <div>
                                <button onClick={() => handleClick(coupon?.code)} className='rounded-lg px-6 py-2 bg-twPrimary text-[#121212] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'>{!!i18n && i18n?.t("Collect")}</button>
                            </div>
                        </div>)
                    }
                </div>
            </Card>
        </>
    );
};

UserOffer.layout = UserLayout
export default UserOffer;