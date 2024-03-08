import Title from '../../components/frontend/common/title';
import PrivacyPolicyComponent from '../../components/frontend/privacyPolicy/privacyPolicy';
import HomeLayout from '../../layouts/home';
import { useUserDataContext } from "../../contexts/userDataContext";
import { useFetch } from "../../helpers/hooks";
import { getLandingPageData } from "../../helpers/backend_helper";
import { useEffect } from "react";
import { Skeleton } from 'antd';

const PrivacyPolicy = () => {
    const { language } = useUserDataContext()
    const [data, getData] = useFetch(getLandingPageData, {}, false)

    useEffect(() => {
        !!language && getData({ lang: language, pages: "privacy_policy" })
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
            <Title heading={data?.content?.privacy_policy?.value?.title} paragraph={data?.content?.privacy_policy?.value?.subtitle} />
            <PrivacyPolicyComponent data={data} />
        </div>
    );
};

PrivacyPolicy.layout = HomeLayout
export default PrivacyPolicy;