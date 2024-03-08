import Hero from "../../components/frontend/common/hero";
import { Skeleton } from "antd";
import AppSection from "../../components/frontend/service/appSection";
import Feature from "../../components/frontend/service/bikeService/feature";
import ServiceStep from "../../components/frontend/service/bikeService/serviceStep";
import HomeLayout from "../../layouts/home";
import { useRouter } from "next/router";
import { useUserDataContext } from "../../contexts/userDataContext";
import { useFetch } from "../../helpers/hooks";
import { getLandingPageData } from "../../helpers/backend_helper";
import { useEffect } from "react";

const Service = () => {
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
      <Hero
        heading={data?.content?.hero?.value?.title}
        paragraph={data?.content?.hero?.value?.description}
        image={data?.content?.hero?.value?.image}
      />
      <Feature data={data?.content?.work?.value} />
        {
          data?.content?.service?.value &&
          <AppSection
            title={data?.content?.service?.value[0]?.title}
            paragraph={data?.content?.service?.value[0]?.description}
            image={data?.content?.service?.value[0]?.image}
          />
        }
      <ServiceStep data={data?.content?.service?.value} />
    </div>
  );
};

Service.layout = HomeLayout;
export default Service;
