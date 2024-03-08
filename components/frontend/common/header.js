import React, {useEffect, useState} from "react";
import Link from "next/link";
import {FcMenu} from "react-icons/fc";
import Dropdowns from "./dropdowns";
import {useRouter} from "next/router";
import {Avatar, Menu} from "antd";
import {useSite} from "../../../contexts/site";
import SignUpModal from "./signupModal/signUpModal";
import {UserOutlined} from "@ant-design/icons";
import {
  fetchProfile,
  fetchCustomPage,
  fetchServiceAll,
} from "../../../helpers/backend_helper";
import {useFetch} from "../../../helpers/hooks";
import {useUserDataContext} from "../../../contexts/userDataContext";
import {NavDropdown} from "react-bootstrap";
import {useI18n} from "../../../contexts/i18n";

const Header = () => {
  const i18n = useI18n();
  const router = useRouter();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const {isLoggedIn, language, setIsLoggedIn, setLanguage} = useUserDataContext();
  const {languages} = useSite();
  // services list
  const [servicesAll] = useFetch(fetchServiceAll);
  // custom-page
  const [customPages] = useFetch(fetchCustomPage);
  const site = useSite();

  const getProfile = (token) => {
    fetchProfile(token).then(({error, data}) => {
      if (error === false) {
        setUserData({...data});
      } else {
        setUserData({});
      }
    });
  };

  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("auth_type");
    setUserToken(null);
    setIsLoggedIn(false);
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setUserToken(token);
    getProfile(userToken);
  }, [userToken]);

  // menu
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const navItems = [
    {
      _id: 1,
      name: "Home",
      href: "/",
    },
    {
      _id: 2,
      name: "Earn with Share",
      href: "/home/earnWithShare",
    },
    {
      _id: 3,
      name: "Blog",
      href: "/home/blog",
    },
    {
      _id: 4,
      name: "Services",
      href: "/home/service",
      items: (
        <Menu
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          style={{
            minWidth: 180,
          }}
          className="header"
        >
          {servicesAll?.map((service, i) => (
            <Menu.SubMenu
              key={i}
              title={!!i18n && i18n?.t(`${service.name}`)}
              className={`py-[4px] capitalize ${servicesAll?.length !== i + 1 && "border-b border-[#E8E8E8] "
                }`}
              style={{
                padding: 8,
                marginRight: 8
              }}
            >
              {service?.services?.map((s, i) => (
                <Menu.Item key={i}>
                  <Link href={`/home/service?page=${service.name}${s.name}`}>
                    <p
                      onClick={() => setMobileMenu(!mobileMenu)}
                      className={`py-[8px] pl-[33px] pr-[46px] text-base flex hover:bg-twSecondary-shade800 gap-4 hover:text-white text-twContent capitalize ${service?.services.length !== i + 1 &&
                        "border-b border-[#E8E8E8]"
                        }`}
                    >

                      <img className={`h-6 ${s.image ? "w-8" : "w-6"}`} src={s.image ? s.image : "/assets/service-vehicle.png"} />
                      <p className=" font-medium text-start">{!!i18n && i18n?.t(`${s.name}`)}</p>
                    </p>
                  </Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ))}
        </Menu>
      ),
    },
    {
      _id: 5,
      name: "More",
      href: "/home/more",
      items: (
        <Menu>
          <Menu.Item key={1}>
            <Link href="/home/business">
              <p
                onClick={() => setMobileMenu(!mobileMenu)}
                className="text-twContent font-medium py-[12px] pl-11 hover:bg-twSecondary-shade800 pr-[109px] border-b border-[#E8E8E8] hover:text-white"
              >
                {!!i18n && i18n?.t("Business")}
              </p>
            </Link>
          </Menu.Item>
          <Menu.Item key={2}>
            <Link href="/home/safety">
              <p
                onClick={() => setMobileMenu(!mobileMenu)}
                className="text-twContent font-medium py-[12px] pl-11 hover:bg-twSecondary-shade800 pr-[109px] border-b border-[#E8E8E8] hover:text-white"
              >
                {!!i18n && i18n?.t("Safety")}
              </p>
            </Link>
          </Menu.Item>
          <Menu.Item key={3}>
            <Link href="/home/press">
              <p
                onClick={() => setMobileMenu(!mobileMenu)}
                className="text-twContent font-medium py-[12px] pl-11 hover:bg-twSecondary-shade800 pr-[109px] border-b border-[#E8E8E8] hover:text-white"
              >
                {!!i18n && i18n?.t("Press")}
              </p>
            </Link>
          </Menu.Item>
          <Menu.Item key={4}>
            <Link href="/home/faq">
              <p
                onClick={() => setMobileMenu(!mobileMenu)}
                className="text-twContent font-medium py-[10px] hover:bg-twSecondary-shade800 pl-11 pr-[109px] hover:text-white"
              >
                {!!i18n && i18n?.t("FAQ's")}

              </p>
            </Link>
          </Menu.Item>
          {customPages?.map((p, i) => (
            <Menu.Item key={i + 555}>
              <Link href={`/home/${p?.page}/?page=${p?.page}`}>
                <p
                  onClick={() => setMobileMenu(!mobileMenu)}
                  className="text-twContent font-medium py-[12px] hover:bg-twSecondary-shade800 pl-11 pr-[109px] hover:text-white border-t border-[#E8E8E8] capitalize"
                >
                  {!!i18n && i18n?.t(`${p?.title}`)}
                </p>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      ),
    },
  ];

  const profileDropDowns = {
    name: (
      <Avatar
        size="large"
        icon={
          userData?.image ? <img src={userData?.image} /> : <UserOutlined />
        }
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    ),
    icon: false,
    placement: "bottom",
    items: (
      <Menu className="custom-menu">
        <Menu.Item key={1}>
          <Link href="/profile">
            <a>
              {!!i18n && i18n?.t("Profile")}
            </a>
          </Link>
        </Menu.Item>
        <Menu.Item key={2}>
          <Link
            href={
              userData?.role === "admin" || userData?.role === "employee"
                ? "/admin"
                : userData?.role === "driver"
                  ? "/driver"
                  : "/user"
            }
          >
            <a target="_blank">
              {!!i18n && i18n?.t("Dashboard")}
            </a>
          </Link>
        </Menu.Item>
        <Menu.Item key={3}>
          <Link href="">
            <a
              onClick={handleLogOut}

            >
              {!!i18n && i18n?.t("Logout")}

            </a>
          </Link>
        </Menu.Item>
      </Menu>
    ),
  };

  return (
    <>
      <div className="shadow-twCustom">
        <div className="container py-[16px]">
          <div className="h-[100px] px-[8px] flex items-center justify-between">
            <div className="flex items-center">
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
            </div>
            <div className="hidden lg:block">
              {navItems.map((item) =>
                item?.items ? (
                  <Dropdowns key={item._id} {...item} />
                ) : (
                  <Link key={item._id} href={item.href}>
                    <a
                      className={`${router.pathname === item.href
                        ? "text-twSecondary-shade700"
                        : ""
                        } md:mr-[8px] lg:mr-[16px] xl:mr-10 text-sm lg:text-base text-twContent font-medium hover:text-twSecondary-shade800`}
                    >
                      {!!i18n && i18n?.t(`${item.name}`)}

                    </a>
                  </Link>
                )
              )}
            </div>
            <div className="hidden lg:flex items-center nav-menu">
              <NavDropdown
                title={!!i18n && i18n?.languages?.find((l) => l.key === i18n.lang)?.name}
                className="language-selector min-w-[100px]"
              >
                {!!i18n && i18n?.languages?.map((l, index) => (
                  <NavDropdown.Item
                    onClick={() => {
                      i18n.changeLang(l.key);
                      setLanguage(l.key);
                    }}
                    key={index}
                  >
                    {!!i18n && i18n?.t(`${l.name}`)}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              {/* login/register/profile  */}
              <div>
                {userData?._id ? (
                  <Dropdowns {...profileDropDowns} />
                ) : (
                  <>
                    <Link href={"/login"}>
                      <button className="hover:text-twSecondary-shade800 font-Inter ml-[12px] px-6 py-[12px] bg-white text-twSecondary-shade800 border !border-twSecondary-shade800  text-lg font-semibold rounded-lg !transition-all !duration-300 !transform hover:!-translate-y-1 hover:!shadow-lg">
                        {!!i18n && i18n?.t("Log in")}
                      </button>
                    </Link>
                    <Link href={""}>
                      <button
                        onClick={() => setModalOpen(true)}
                        className="font-Inter ml-[12px] px-6 py-[12px] bg-twSecondary-shade800 text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:!-translate-y-1 hover:shadow-lg"
                      >
                        {!!i18n && i18n?.t("Register")}
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            {/* mobile menu */}
            <div className="lg:hidden flex justify-center items-center gap-2">
              {userData?._id && <Dropdowns {...profileDropDowns} />}
              <FcMenu
                size={35}
                onClick={() => setMobileMenu(!mobileMenu)}
              ></FcMenu>
            </div>
          </div>
          {/* responsive menu  */}
          {mobileMenu && (
            <div className="flex flex-col gap-3 lg:hidden pb-4">
              {navItems.map((item) =>
                item.items ? (
                  <div key={item?._id} className="px-[16px]">
                    <Dropdowns {...item} />
                  </div>
                ) : (
                  <Link key={item?._id} href={item.href}>
                    <a
                      onClick={() => setMobileMenu(!mobileMenu)}
                      className={`${router.pathname === item.href
                        ? "text-twSecondary-shade700"
                        : ""
                        } ml-4 lg:ml-0 md:mr-2 lg:mr-4 xl:mr-10 text-base lg:text-base text-twContent font-medium hover:text-twSecondary-shade800`}
                    >
                      {!!i18n && i18n?.t(`${item.name}`)}
                    </a>
                  </Link>
                )
              )}

              <div className="flex flex-col gap-1 w-fit">
                <select
                  className="px-[12px] lg:px-0 w-fit font-Inter text-twContent bg-white text-base md:text-lg font-medium"
                  name="language"
                  id=""
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages?.map((language) => (
                    <option key={language?._id} value={language?.code}>
                      {!!i18n && i18n?.t(`${language?.name}`)}
                    </option>
                  ))}
                </select>
                {!userData?._id && (
                  <div
                    onClick={() => setMobileMenu(!mobileMenu)}
                    className="flex px-[12px] lg:px-0 pt-[12px] lg:pt-0 lx:mb-0 mb-[12px]"
                  >
                    <Link href={"/login"}>
                      <a className="font-Inter md:px-6 px-[16px] md:py-[12px] py-[8px] bg-white text-twSecondary-shade800 border border-twSecondary-shade700  md:text-lg text-sm font-semibold rounded-lg">
                        {!!i18n && i18n?.t("Log in")}
                      </a>
                    </Link>
                    <Link href={""}>
                      <a
                        onClick={() => setModalOpen(true)}
                        className="font-Inter ml-[12px] md:px-6 px-[16px] md:py-[12px] py-[8px] bg-twSecondary-shade800 text-white md:text-lg text-sm font-semibold rounded-lg"
                      >
                        {!!i18n && i18n?.t("Register")}
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <SignUpModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
};

export default Header;
