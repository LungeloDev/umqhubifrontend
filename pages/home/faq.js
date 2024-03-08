import Faqs from "../../components/frontend/faq/faq";
import HomeLayout from "../../layouts/home";
import { useUserDataContext } from "../../contexts/userDataContext";
import { useFetch } from "../../helpers/hooks";
import { getLandingPageData } from "../../helpers/backend_helper";
import { useEffect } from "react";
import { Skeleton } from "antd";

const Faq = () => {
    const { language } = useUserDataContext()
    const [data, getData] = useFetch(getLandingPageData, {}, false)

    useEffect(() => {
        !!language && getData({ lang: language, pages: "faq_page" })
    }, [language])

    if (!data) {
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
            <div className="bg-yellow-50 text-center py-16 font-Poppins">
                <div className="container">
                    <h1 className="font-medium text-[40px] text-twContent-header">{data?.content?.header?.value?.title}</h1>
                    <p className="font-medium text-lg text-twContent-light mt-[20px]">{data?.content?.header?.value?.subtitle}</p>
                </div>
            </div>
            <Faqs data={data} />
        </div>
    )
}

Faq.layout = HomeLayout;
export default Faq;