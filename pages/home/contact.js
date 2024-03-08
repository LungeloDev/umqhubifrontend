import Title from "../../components/frontend/common/title";
import ContactUsComponent from "../../components/frontend/contact/contact";
import HomeLayout from "../../layouts/home";
import { getLandingPageData } from "../../helpers/backend_helper";
import { useFetch } from "../../helpers/hooks";
import { useEffect } from "react";
import { useUserDataContext } from "../../contexts/userDataContext";
import { Skeleton } from "antd";

const ContactUs = () => {
  const { language } = useUserDataContext();
  const [data, getData] = useFetch(getLandingPageData, {}, false);

  useEffect(() => {
    !!language && getData({ lang: language, pages: "contact_page" });
  }, [language]);

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
        heading={data?.content?.contact_page?.value?.contact?.value?.title}
        paragraph={data?.content?.contact_page?.value?.contact?.value?.subtitle}
      />
      <ContactUsComponent data={data}/>
    </div>
  );
};

ContactUs.layout = HomeLayout;
export default ContactUs;
