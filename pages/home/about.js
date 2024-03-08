import AboutUs from "../../components/frontend/about/about_us";
import Title from "../../components/frontend/common/title";
import HomeLayout from "../../layouts/home";
import { useUserDataContext } from "../../contexts/userDataContext";
import { useFetch } from "../../helpers/hooks";
import { getLandingPageData } from "../../helpers/backend_helper";
import { useEffect } from "react";
import { Skeleton } from "antd";

const About = () => {
    const { language } = useUserDataContext()
    const [data, getData] = useFetch(getLandingPageData, {}, false)

    useEffect(() => {
        !!language && getData({ lang: language, pages: "about_us" })
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
            <Title heading={data?.content?.about_us?.value?.title} paragraph={data?.content?.about_us?.value?.subtitle} />
            <AboutUs data={data} />
        </div>
    )
}

About.layout = HomeLayout;
export default About;