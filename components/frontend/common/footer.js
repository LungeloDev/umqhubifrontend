import Link from "next/link";
import {useSite} from "../../../contexts/site";
import {ReactIcon} from "../../common/react-icon";
import {fetchCustomPage, fetchSettings} from "../../../helpers/backend_helper";
import {useFetch} from "../../../helpers/hooks";
import {useI18n} from "../../../contexts/i18n";

const Footer = () => {
  const i18n = useI18n();
  const site = useSite();
  const [setting] = useFetch(fetchSettings);
  const [customPages] = useFetch(fetchCustomPage);

  const links = [
    {
      name: "About Us",
      href: "/home/about",
    },
    {
      name: "Blog page",
      href: "/home/blog",
    },
    {
      name: "Knowledge",
      href: "/home/knowledge-base",
    },
  ];

  const supportLinks = [
    {
      _id: 1,
      name: "Earn with share",
      href: "/home/earnWithShare/",
    },
    {
      _id: 2,
      name: "Terms & Condition",
      href: "/home/terms-and-condition",
    },
    {
      _id: 3,
      name: "Privacy Policy",
      href: "/home/privacy-policy",
    },
    {
      _id: 4,
      name: "Contact Us",
      href: "/home/contact",
    },
  ];

  return (
    <div className="bg-[#FFFCF2] mt-[117px] ">
      <div className="container py-6">
        <div className="grid justify-center md:grid-cols-4 lg:grid-cols-5 lg:gap-[12px] pt-16 pb-20 pl-[20px] md:pl-0">
          {/* site description */}
          <div className="md:col-span-2">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img
                  className="max-w-[66px]"
                  src={site?.logo}
                  alt="site logo"
                ></img>
                <h1 className="font-Roboto font-bold text-2xl">
                  {site?.site_name}
                </h1>
              </div>
            </Link>
            {
              site?.description && <p className="my-8 max-w-md  font-medium text-base text-twContent text-justify">
                {!!i18n?.t && i18n?.t(`${site?.description}`)}
              </p>
            }
            <div className="flex justify-start">
              {site?.social_media_link?.map((icon) => (
                <a
                  target="_blank"
                  href={icon?.link}
                  className="pr-4"
                  key={icon?._id}
                >
                  <div className="text-twContent hover:text-twSecondary-shade800 ">
                    <ReactIcon size={20} icon={icon?.icon} className="transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* links */}
          <div className="md:col-span-1 lg:col-span-1 mt-[20px] md:mt-0 col-span-1 md:justify-self-center lg:justify-self-start">
            <h3 className="font-medium text-2xl text-twContent">{!!i18n?.t && i18n?.t("Links")}</h3>
            <div className="mt-8 flex flex-col font-medium text-base text-twContent">
              {links?.map((link, i) => (
                <Link key={i} href={link.href}>
                  <a className="mb-[20px] hover:text-twSecondary-shade800">
                    {!!i18n?.t && i18n?.t(`${link.name}`)}
                  </a>
                </Link>
              ))}
              {customPages?.map((p, i) => (
                <Link key={i} href={`/home/${p?.page}/?page=${p?.page}`}>
                  <a className="mb-[20px] hover:text-twSecondary-shade800 capitalize">
                    {!!i18n?.t && i18n?.t(`${p?.title}`)}
                  </a>
                </Link>
              ))}
            </div>
          </div>

          {/* support Links  */}
          <div className="md:col-span-1 lg:col-span-1 col-span-1 lg:justify-self-start">
            <h3 className=" font-medium text-2xl text-twContent">{!!i18n?.t && i18n?.t("Support")}</h3>
            <div className="mt-8 flex flex-col font-medium text-base text-twContent">
              {supportLinks?.map((link, i) => (
                <Link key={i} href={link.href}>
                  <a className="mb-[20px] hover:text-twSecondary-shade800">
                    {!!i18n?.t && i18n?.t(`${link.name}`)}
                  </a>
                </Link>
              ))}
            </div>
          </div>

          {/* App Store / Play Store  */}
          <div className=" md:col-span-4 lg:col-span-1 justify-self-start md:justify-self-center lg:justify-self-end mt-10 lg:mt-0">
            <h3 className=" font-medium text-2xl text-twContent text-center">
              {!!i18n?.t && i18n?.t("Get User App On")}
            </h3>
            <div className="flex gap-[11px] md:gap-6 flex-col md:flex-row lg:flex-col mt-[30px]">
              <a href={setting?.app_link?.android} target="_blank">
                <div className="flex items-center justify-center border border-twContent max-w-xs py-[12px] px-6 rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div>
                    {" "}
                    <img src="/assets/playstore.png" alt=""></img>
                  </div>
                  <div className="flex flex-col ml-[12px] text-twContent font-normal text-xs">
                    <p>GET IT ON</p>
                    <p className="font-bold text-xl">Google Play</p>
                  </div>
                </div>
              </a>
              <a href={setting?.app_link?.ios} target="_blank">
                <div className="flex items-center justify-center border border-twContent max-w-xs py-[12px] px-6 rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div>
                    {" "}
                    <img src="/assets/appStore.png" alt=""></img>
                  </div>
                  <div className="flex flex-col ml-[12px] text-twContent font-normal text-xs">
                    <p>Download on the</p>
                    <p className="font-bold text-xl">App Store</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="border border-b-twContent"></div>
        <div className="flex justify-center">
          <p className=" font-medium text-twContent text-base py-7">
            {site?.site_footer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
