import BulletPoints from "./bulletPoints";
import ButtonWithIcon from "../../common/buttons/buttonWithIcon";
import {
  fetchServiceAll,
  fetchServiceHeading,
  fetchServiceInfo,
} from "../../../../helpers/backend_helper";
import {useEffect, useState} from "react";
import {useFetch} from "../../../../helpers/hooks";
import {useI18n} from "../../../../contexts/i18n";

const Platform = () => {
  const i18n = useI18n();
  const [servicesAll, setServiceAll] = useState(null);
  const [serviceHeading] = useFetch(fetchServiceHeading);
  const [id, setId] = useState("");
  const [serviceInfo, getServiceInfo] = useFetch(fetchServiceInfo, {}, false);

  useEffect(() => {
    const fetchServices = async () => {
      await fetchServiceAll().then((res) => {
        if (res?.error === false) {
          setServiceAll(res?.data);
          setId(res?.data[0]?._id);
        }
      });
    };
    fetchServices();
  }, []);

  useEffect(() => {
    !!id && getServiceInfo({service_category: id});
  }, [id]);

  return (
    servicesAll?.length > 0 && serviceHeading &&
    <div className="py-24 bg-twPrimary-shade50 ">
      <div className="container">
        <div className="w-full flex flex-col items-center mb-[20px]">
          <h2 className="font-medium text-4xl text-center md:text-start">
            {!!i18n?.t && i18n?.t(`${serviceHeading?.section_title}`)}
          </h2>
          <p className=" mt-[12px] font-medium text-lg text-[#646464] text-justify">
            {!!i18n?.t && i18n?.t(`${serviceHeading?.section_sub_title}`)}
          </p>
          <div className="mt-[40px] flex flex-col md:flex-row md:flex-wrap gap-6 justify-center">
            {servicesAll?.map((service, i) => (
              <ButtonWithIcon
                key={i}
                onClick={() => {
                  setId(service?._id);
                }}
                name={service.name}
                icon={service.image ? service.image : "/assets/service-vehicle.png"}
                isActive={id === service?._id}
                className="hover:text-twSecondary-shade800 hover:border-twSecondary-shade800"
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:items-center">
          <div>
            <img src="/assets/biker.png" alt=""></img>
          </div>
          <div className="lg:ml-24">
            {serviceInfo &&
              serviceInfo?.brief_info?.map((point) => (
                <BulletPoints
                  key={point?._id}
                  heading={!!i18n?.t && i18n?.t(`${point?.title}`)}
                  paragraph={!!i18n?.t && i18n?.t(`${point?.information}`)}
                ></BulletPoints>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Platform;
