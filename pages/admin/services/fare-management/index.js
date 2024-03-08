import { Form } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import FairPrice from '../../../../components/admin/fair/fair-price';
import AdminLayout from "../../../../layouts/admin";
import Table from "../../../../components/common/table";
import {
    delServicePrice,
    fetchOneServicePrice,
    fetchServicePriceList
} from "../../../../helpers/backend_helper";
import moment from "moment/moment";
import { useFetch } from "../../../../helpers/hooks";
import Button from "../../../../components/common/button";
import { initI18n } from '../../../../contexts/i18n';
import { FaCalculator } from 'react-icons/fa';
import { BiInfoSquare } from 'react-icons/bi';


const AdminPrice = () => {
    const i18n = initI18n();
    const router = useRouter();
    const [form] = Form.useForm();
    const [refresh, setRefresh] = useState(null);
    const [fares, getFares, { error, loading }] = useFetch(fetchServicePriceList)
    const [servicePrice, getServicePrice] = useFetch(fetchOneServicePrice, {}, false);
    const [overview, setOverview] = useState({ baseFair: 0, perKiloCharge: 0, waitingCharge: 0 })

    let sub_total = 0;
    for (let key in overview) {
        sub_total += overview[key];
    }
    const exclude = ["baseFair", "perKiloCharge", "waitingCharge"];
    const filteredOverview = {};
    for (const [key, value] of Object.entries(overview)) {
        if (!exclude.includes(key)) {
            filteredOverview[key] = value;
        }
    }

    useEffect(() => {
        setRefresh(null)
    }, [refresh])

    let additionalFees = {};
    if (servicePrice?._id) {
        additionalFees = servicePrice?.additional_fees.reduce((acc, curr) => {
            acc[curr.additional_fee_name] = curr.additional_fee;
            return acc;
        }, {});
    }

    // fare calculation show after filtering service vehicle
    useEffect(() => {
        if (servicePrice?._id) {
            form.setFieldsValue({
                ...servicePrice,
                category: servicePrice?.category?._id,
                subcategory: servicePrice?.subcategory?._id,
                vehicle: servicePrice?.vehicle?._id,
            })
        }
        setOverview({
            ...additionalFees,
            baseFair: servicePrice?.base_fair,
            perKiloCharge: servicePrice?.per_kilo_charge,
            waitingCharge: servicePrice?.waiting_charge
        })
    }, [servicePrice]);

    let columns = [
        {
            dataField: 'category', text: 'Category',
            formatter: category => <span className='capitalize'>{category?.name}</span>
        },
        {
            dataField: 'service', text: 'Service',
            formatter: (service, data) => <span className='capitalize'>{service?.name || "-"}</span>
        },
        {
            dataField: 'service_package', text: 'Package',
            formatter: (service_package, data) => <span className='capitalize'>{service_package?.name || "-"}</span>
        },
        {
            dataField: 'service_vehicle', text: 'Service Vehicle Name',
            formatter: service_vehicle => <span className='capitalize'>{service_vehicle?.name}</span>
        },
        {
            dataField: 'service_vehicle', text: 'Vehicle Model',
            formatter: service_vehicle => <span className='capitalize'>{service_vehicle?.model}</span>
        },
        {
            dataField: 'createdAt', text: 'CreatedAt',
            formatter: createdAt => <span className='capitalize'>{createdAt ? moment(createdAt).format('ll') : '-'}</span>
        },
    ];

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={async () => {
                    await router.push('/admin/services/fare-management/add-price')
                }}>Add Service Fare</Button>
        </div>)

    return (
        <div>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>Ride-sharing Price</title>
                </Head>
                {/*fare list*/}
                <div>
                    <Table
                        columns={columns}
                        data={fares}
                        action={action}
                        pagination={true}
                        noActions={false}
                        indexed={true}
                        shadow={false}
                        onEdit={async (data) => {
                            await router.push(`/admin/services/fare-management/edit?_id=${data?._id}`)
                        }}
                        onDelete={delServicePrice}
                        onReload={getFares}
                        error={error}
                    />
                </div>

                {/*fare calculator*/}
                <div className='card_container'>
                    <div className="lg:grid lg:grid-cols-2 lg:gap-2 xl:gap-6 mt-4">
                        <div className="bg-gray-50 pl-4 m-4 lg:w-full lg:m-0 rounded-t shadow-sm">
                            <div className="relative p-6">
                                {/* upper design */}
                                <div className="h-12">
                                    <div
                                        className="absolute w-16 h-16 bg-main shadow-md rounded flex items-center justify-center text-white -top-5">
                                        <span>
                                            {" "}
                                            <FaCalculator size={35} />{" "}
                                        </span >
                                    </div >

                                    <span className="capitalize ml-20">
                                        {!!i18n && i18n?.t("Service Fare Calculator")}
                                    </span>
                                </div >
                            </div >

                            {/* price display and update */}
                            <FairPrice getServicePrice={getServicePrice} />
                        </div >

                        <div className='mt-5 md:mt-0 md:hidden'></div>

                        {/* calculation part */}
                        <div className="bg-gray-50 m-4 lg:m-0 rounded-t shadow-sm">
                            <div className="relative p-6">
                                {/* upper design */}
                                <div className="h-12">
                                    <div
                                        className="absolute w-16 h-16 bg-main shadow-md rounded flex items-center justify-center text-white -top-5">
                                        <span>
                                            {" "}
                                            <BiInfoSquare size={35} />{" "}
                                        </span >
                                    </div >

                                    <span className="capitalize ml-20">
                                        {!!i18n && i18n?.t("Overview")}
                                    </span>
                                </div >

                                <div className="border-b mt-3 mr-20"></div>

                                <div className="flex justify-between border-b pt-3 pb-2">
                                    <h6 className="font-semibold text-sm capitalize">Base fair</h6>
                                    <span className="inline-block mr-16">{overview.baseFair}</span>
                                </div >

                                <div className="flex justify-between border-b pt-3 pb-2">
                                    <h6 className="font-semibold text-sm capitalize">Per kilo charge</h6>
                                    <span className="inline-block mr-16">{overview.perKiloCharge}</span>
                                </div >

                                <div className="flex justify-between border-b pt-3 pb-2">
                                    <h6 className="font-semibold text-sm capitalize">Waiting Charge</h6>
                                    <span className="inline-block mr-16">{overview.waitingCharge}</span>
                                </div >
                                {
                                    Object.entries(filteredOverview).map(([key, value]) => (
                                        <>
                                            <div className="flex justify-between border-b pt-3 pb-2">
                                                <h6 className="font-semibold text-sm capitalize">{key}</h6>
                                                <span className="inline-block mr-16">{value}</span>
                                            </div>
                                        </>
                                    ))
                                }
                                < div className="flex justify-between pt-3 pb-2" >
                                    <h6 className="font-semibold text-sm">Sub Total</h6>
                                    <span className="inline-block mr-16">{sub_total ? sub_total : ''}</span>
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </section >
        </div >
    );
};
AdminPrice.layout = AdminLayout;
export default AdminPrice;