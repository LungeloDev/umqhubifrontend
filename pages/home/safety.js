import Title from "../../components/frontend/common/title";
import SafetyDetails from "../../components/frontend/more/safety/safety_details/safety_details";
import HomeLayout from "../../layouts/home";
import { useUserDataContext } from "../../contexts/userDataContext";
import { useFetch } from "../../helpers/hooks";
import { getLandingPageData } from "../../helpers/backend_helper";
import { useEffect } from "react";
import { Skeleton } from "antd";

const Safety = () => {
  const { language } = useUserDataContext()
  const [data, getData] = useFetch(getLandingPageData, {}, false)

  useEffect(() => {
    !!language && getData({ pages: "safety", lang: language })
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
      <Title heading={data?.content?.header?.value?.title} paragraph={data?.content?.header?.value?.description} />
      <SafetyDetails data={data} />
    </div>
  )
}



Safety.layout = HomeLayout
export default Safety