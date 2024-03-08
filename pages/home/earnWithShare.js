import Title from "../../components/frontend/common/title";
import HomeLayout from "../../layouts/home";
import {useFetch} from "../../helpers/hooks";
import {
    fetchEarnWithShare,
    fetchServiceCategoryList,
    fetchServiceHeading,
    fetchServiceInfo,
} from "../../helpers/backend_helper";
import Button from "../../components/common/button";
import React, {useEffect, useState} from "react";
import {FcWorkflow} from "react-icons/fc";
import {useRouter} from "next/router";
import {Skeleton} from "antd";

const EarnWithShare = () => {
    const router = useRouter()
    const {query} = useRouter();
    const [serviceHeading] = useFetch(fetchServiceHeading);
    const [serviceCategories, getServiceCategories] = useFetch(fetchServiceCategoryList);
    const [category, getCategory, {query: params, loading, error, errorMessage, clear}] = useFetch(fetchServiceInfo)
    const [vId, setVId] = useState();

    useEffect(() => {
        if (!!query?.token) {
            const token = query?.token;
            localStorage.setItem('authToken', token);
        }
    }, [query?.token])

    useEffect(() => {
        if (serviceCategories?.categories[0]?._id) {
            getCategory({service_category: serviceCategories?.categories[0]?._id})
        }
    }, [serviceCategories?.categories[0]?._id])

    if (!serviceHeading) {
        return (
            <div className="container w-full pt-20 flex flex-col gap-y-10 justify-center items-center">
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
            </div>
        );
    }

    return (
        <div>
            <Title heading={serviceHeading?.section_title} paragraph={serviceHeading?.section_sub_title} />
            <div className='flex flex-col md:flex-row gap-6 justify-center items-center mt-10'>
                {
                    serviceCategories?.categories?.map(v =>
                        <Button className={`text-capitalize ${(vId || serviceCategories?.categories[0]?._id) === v?._id && "bg-twSecondary-shade700" +
                            " bg-amber-400"}`} onClick={() => {
                                setVId(v?._id)
                                getCategory({service_category: v?._id})
                            }} key={v?._id}>
                            {v?.name}
                        </Button>
                    )
                }
            </div>
            <div className={'flex justify-content-center my-5 border-2 border-dotted py-4 border-main'}>
                <Button className={'text-capitalize hover:bg-twSecondary-shade700 hover:shadow-lg'}
                    onClick={async () => await router.push('/home/vehicle-registration')}> Register Now </Button>
            </div>
            {
                loading ? <div className="container min-h-[250px] mx-[10%]">
                    <Skeleton active /></div> :
                    category?._id && <div className="min-h-[250px]">
                        {
                            category?.brief_info?.map((d, i) => <div key={i} className={'mb-1'}>
                                <div className={'mx-[10%] bg-amber-50 p-3 rounded-md flex items-center' +
                                    ' gap-3'}>
                                    <FcWorkflow size={30} />
                                    <div className={'space-y-2'}>
                                        <h1 className={'text-slate-600 font-semibold'}>{d?.title}</h1>
                                        <h1 className={'text-slate-500 font-medium'}>{d?.information}</h1>
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>
            }
        </div>
    )
}
EarnWithShare.layout = HomeLayout
export default EarnWithShare