import Title from "../../components/frontend/common/title";
import HomeLayout from "../../layouts/home";
import { useUserDataContext } from "../../contexts/userDataContext";
import { useFetch } from "../../helpers/hooks";
import { getLandingPageData } from "../../helpers/backend_helper";
import { useEffect } from "react";
import { useRouter } from "next/router";
import DynamicComponent from "../../components/frontend/more/dynamicPage";
import { Skeleton } from "antd";

const DynamicPage = () => {
  const { language } = useUserDataContext();
  const { query } = useRouter();
  const page = query?.page;
  const [data, getData] = useFetch(getLandingPageData, {}, false);

  useEffect(() => {
    !!language && !!page && getData({ lang: language, pages: page });
  }, [language, page]);

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
      <Title
        heading={data?.content?.page?.value?.title}
        paragraph={data?.content?.page?.value?.subtitle}
      />
      <DynamicComponent data={data} />
    </div>
  );
};

DynamicPage.layout = HomeLayout;
export default DynamicPage;
