import Title from "../../components/frontend/common/title";
import KnowledgeComponent from "../../components/frontend/more/knowledge/knowledgeComponent";
import HomeLayout from "../../layouts/home";
import { useUserDataContext } from "../../contexts/userDataContext";
import { useFetch } from "../../helpers/hooks";
import { getLandingPageData } from "../../helpers/backend_helper";
import { useEffect } from "react";
import { Skeleton } from "antd";

const KnowledgeBase = () => {
    const { language } = useUserDataContext()
    const [data, getData] = useFetch(getLandingPageData, {}, false)

    useEffect(() => {
        !!language && getData({ lang: language, pages: "knowledge_base" })
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
            <Title heading={data?.content?.header?.value?.title} paragraph={data?.content?.header?.value?.subtitle} />
            <KnowledgeComponent data={data} />
        </div>
    )
}

KnowledgeBase.layout = HomeLayout;
export default KnowledgeBase;