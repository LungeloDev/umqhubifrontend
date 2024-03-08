import Title from "../../components/frontend/common/title";
import TermsAndCondition from "../../components/frontend/termsAndCondition/termsAndCondition";
import HomeLayout from "../../layouts/home";
import { useUserDataContext } from "../../contexts/userDataContext";
import { useFetch } from "../../helpers/hooks";
import { getLandingPageData } from "../../helpers/backend_helper";
import { useEffect } from "react";
import { Skeleton } from "antd";

const TermsCondition = () => {
    const { language } = useUserDataContext()
    const [data, getData] = useFetch(getLandingPageData, {}, false)

    useEffect(() => {
        !!language && getData({ lang: language, pages: "terms_conditions" })
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
            <Title heading={data?.content?.terms_conditions?.value?.title} paragraph={data?.content?.terms_conditions?.value?.subtitle} />
            <TermsAndCondition data={data} />
        </div>
    )
}

TermsCondition.layout = HomeLayout;
export default TermsCondition;