import React, {useEffect} from 'react';
import {Form, Input, message} from "antd";
import Button from "../../common/button";
import {postRideCoupon} from "../../../helpers/backend_helper";
import {useAction} from "../../../helpers/hooks";
import {useDispatch} from "react-redux";
import {currentFareData, getCouponData, removeCouponData} from "../../../redux/user-ride/actions";
import {useRouter} from "next/router";

const ApplyCoupon = ({state, storedData}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch()
    const {push} = useRouter()

    useEffect(()=>{
        if(storedData?.coupon?.coupon_code) {
            form.setFieldsValue({
                coupon_code: storedData?.coupon?.coupon_code
            })
        }
    },[storedData?.coupon?.coupon_code])

    return (
        <div>
            <Form
                form={form}
                onFinish={async values => {
                    if(!!storedData.selectedRideVehicle?.vehicle?.service_vehicle) {
                        values.service_vehicle = storedData.selectedRideVehicle?.vehicle?.service_vehicle;
                        values.service = storedData.selectedRideVehicle?.vehicle?.service;
                        values.service_package = storedData.selectedRideVehicle?.vehicle?.service_package;
                        values.category = storedData.selectedRideVehicle?.vehicle?.service_category;
                        values.distance = +storedData.getUserFare?.fare?.distance;
                        return useAction(postRideCoupon, {...values}, (data) => {
                            dispatch(getCouponData(data))
                            const currentData = {
                                fares: data?.fares,
                                additional_fares: data?.additional_fares,
                                vat_amount: data?.vat_amount,
                                vat: data?.vat,
                                subtotal: data?.subtotal,
                                total: data?.total,
                                distance: storedData?.getUserFare?.fare?.distance,
                            }
                            dispatch(currentFareData(currentData))
                        })
                    } else {
                        message.success('Session out! Please try again')
                        await push('/user/ride-now')
                    }
                }}
                className={'grid grid-cols-4 gap-2'}
            >
                <div className={'relative col-span-3'}>
                    <Form.Item name={'coupon_code'} className={''} extra={(state?.coupon?.coupon_applied || storedData?.coupon?.coupon_code) ? `Coupon Applied: ${state?.coupon?.coupon_applied || storedData?.coupon?.coupon_code}` : ''}>
                        <Input className={'w-full block py-1 rounded-lg text-[18px] border-2 border-teal-500 border-opacity-25'} placeholder={'Enter coupon code'}/>
                    </Form.Item>
                    <span onClick={async () => {
                        if(!!storedData.selectedRideVehicle?.vehicle?.service_vehicle) {
                            dispatch(removeCouponData())
                            const currentData = {
                                ...storedData?.getUserFare?.fare
                            }
                            dispatch(currentFareData(currentData))
                            message.success('Coupon successfully removed')
                            form.resetFields()
                        } else {
                            message.success('Session out! Please try again')
                            await push('/user/ride-now')
                        }
                    }}
                          title={'Remove Coupon'}
                          className={'absolute top-1 right-2 text-[20px] text-red-500 bg-main px-2 rounded-lg  hover:shadow-lg cursor-pointer hover:bg-amber-300'}
                    >
                    X
                </span>
                </div>
                <div className={''}>
                    <Button className={'w-full'}>Apply</Button>
                </div>
            </Form>
        </div>
    );
};

export default ApplyCoupon;