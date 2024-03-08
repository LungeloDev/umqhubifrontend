import { Form, Modal } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Button from '../../../components/common/button';
import Table, { TableImage } from '../../../components/common/table';
import { useSite } from '../../../contexts/site';
import { delCoupon, fetchCoupon, postCoupon } from '../../../helpers/backend_helper';
import { useAction, useActionConfirm, useFetch } from '../../../helpers/hooks';
import { RiCouponFill } from 'react-icons/ri';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { useI18n } from '../../../contexts/i18n';
import AdminLayout from "../../../layouts/admin";


const AdminCoupon = () => {
    const site = useSite();
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { push } = useRouter();
    const [coupons, getCoupons, { loading, error }] = useFetch(fetchCoupon);

    let columns = [
        {
            dataField: 'name', text: 'Coupon Code',
            formatter: name => <span className=''>{name}</span>
        },
        {
            dataField: 'value', text: 'Value',
            formatter: value => <span className='capitalize'>{value}</span>
        },
        {
            dataField: 'type', text: 'Coupon Type',
            formatter: type => <span className='capitalize'>{type}</span>
        },
        {
            dataField: 'status', text: 'Status',
            formatter: status => <span className='capitalize'>{status === 'active' ? <span className='text-amber-500 font-medium'>Active</span> : <span className='text-purple-500'>Disabled</span>}</span>
        },
    ];

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={() => push(`/admin/coupon/create`)}>{!!i18n && i18n?.t("Add Coupon")}</Button>
        </div>)

    let actions = (data) => (
        <div className="flex">
            <button className={`btn ${data?.status === 'active' ? "btn-outline-success" : "btn-outline-success"} btn-sm focus:shadow-none me-2`}
                title="Change Coupon Status" onClick={() => useActionConfirm(postCoupon, { _id: data?._id, status: data?.status === 'active' ? "disabled" : "active" }, () => getCoupons(), `Do you want to ${data?.status === 'active' ? "disable" : "active"} this coupon`, 'Yes', i18n?.t)}>
                {
                    data?.status === 'active' ?
                        <AiOutlineCheck className='cursor-pointer' />
                        :
                        <AiOutlineClose className='cursor-pointer' />
                }
            </button>
        </div>)


    return (
        <section>
            <Head>
                <title>Coupon Code</title>
            </Head>
            <div className='card_container mt-2'>
                <div className="h-auto mb-4 flex items-center gap-2">
                    <div className="w-16 h-16 shadow flex justify-center rounded  items-center bg-amber-300">
                        <span>
                            <RiCouponFill
                                size={30}
                                className="text-white"
                            />
                        </span>
                    </div>
                    <span className='font-semibold text-font_color'>{!!i18n && i18n?.t("Coupon Codes")}</span>
                </div>

                <Table
                    columns={columns}
                    data={coupons}
                    pagination={false}
                    noActions={false}
                    actions={actions}
                    action={action}
                    indexed={true}
                    shadow={false}
                    onEdit={(data) => push(`/admin/coupon/edit?_id=${data?._id}`)}
                    onDelete={delCoupon}
                    onReload={getCoupons}
                    error={error}
                    loading={loading}
                    title=''
                />
            </div>
        </section>
    );
};
AdminCoupon.layout = AdminLayout;
export default AdminCoupon;