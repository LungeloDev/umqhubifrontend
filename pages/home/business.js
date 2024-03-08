import Title from "../../components/frontend/common/title"
import BusinessDetails from "../../components/frontend/more/business/business_details/business_details"
import HomeLayout from "../../layouts/home"
import { useUserDataContext } from "../../contexts/userDataContext";
import { useFetch } from "../../helpers/hooks";
import { getLandingPageData } from "../../helpers/backend_helper";
import { useEffect } from "react";
import { Skeleton } from "antd";

const Business = () => {
    const { language } = useUserDataContext()
    const [data, getData] = useFetch(getLandingPageData, {}, false)

    useEffect(() => {
        !!language && getData({ lang: language, pages: "business" })
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
            <Title heading={data?.content?.business?.value?.title} paragraph={data?.content?.business?.value?.subtitle} />
            <BusinessDetails description={data?.content?.business?.value?.content} />
        </div>
    )
}

Business.layout = HomeLayout
export default Business