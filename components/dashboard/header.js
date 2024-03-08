import {FaBars, FaGlobe} from "react-icons/fa";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useI18n} from "../../contexts/i18n";
import {NavDropdown} from "react-bootstrap";
import {io} from "socket.io-client";
import {UserOutlined} from '@ant-design/icons';
import Dropdowns from "../frontend/common/dropdowns";
import {Avatar, Badge, Dropdown, Menu} from "antd";
import {useFetch} from "../../helpers/hooks";
import {
    fetchDashboardNotification,
    fetchProfile,
    fetchSettings,
    getProfile,
    postDashboardNotification
} from "../../helpers/backend_helper";
import {AiOutlineBell} from "react-icons/ai";
import {useRouter} from "next/router";
import {useUserDataContext} from "../../contexts/userDataContext";

const Header = () => {
    const {push} = useRouter()
    const [userToken, setUserToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const {isLoggedIn, setIsLoggedIn} = useUserDataContext();
    const i18n = useI18n()
    const [notification, getNotification] = useFetch(fetchDashboardNotification,)

    //initialize socket url
    const [SOCKET_URL, setSOCKET_URL] = useState('')
    const [settings, getSettings] = useFetch(fetchSettings)

    useEffect(() => {
        if (settings?.url?.socket_url) {
            setSOCKET_URL(settings?.url?.socket_url)
        }
    }, [settings]);

    useEffect(() => {
        if (SOCKET_URL) {
            const socket = io(String(SOCKET_URL));
            // Listen for the "notification" event
            socket.on('ticket_notification', data => {
                getNotification()
            });
            // Disconnect from the server when the component unmounts
            return () => {
                socket.disconnect();
            };
        }
    }, [SOCKET_URL]);

    const getProfile = (token) => {
        fetchProfile(token).then(({error, data}) => {
            if (error === false) {
                setUserData({...data})
            } else {
                setUserData({})
            }
        })
    }

    const handleLogOut = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("auth_type");
        setUserToken(null);
        setIsLoggedIn(false)
    }
    useEffect(() => {
        const token = localStorage.getItem("authToken")
        setUserToken(token)
        getProfile(userToken)

    }, [userToken, isLoggedIn])

    const profileDropDowns = {
        name: <Avatar
            size="large"
            icon={userData?.image ? <img src={userData?.image} /> : < UserOutlined />}
            style={
                {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }
            }
        />,
        icon: false,
        placement: "bottom",
        items: <Menu className="header custom-menu">
            <Menu.Item key={1}>
                <Link href="/profile">
                    <a target="_blank">Profile</a>
                </Link>
            </Menu.Item>
            <Menu.Item key={2}>
                <Link href={
                    "/"
                }>
                    <a target="_blank">Landing Page</a>
                </Link>
            </Menu.Item>
            <Menu.Item key={3}>
                <Link href="">
                    <a onClick={handleLogOut} >Logout</a>
                </Link>
            </Menu.Item>

        </Menu>
    }

    const notificationList = (
        <Menu>
            {notification?.notifications?.slice(0, 10)?.map((notification) =>
            (
                <Menu.Item
                    key={notification?._id}
                >
                    <Badge
                        dot={!notification?.read}
                    >
                        <div onClick={async () => {
                            await postDashboardNotification({_id: notification?._id})
                            getNotification()
                            userData?.role === "admin" ?
                                push(`/${userData?.role}/ticket/tickets/${notification?.data?.ticket_id}`)
                                :
                                push(`/${userData?.role}/support-ticket/${notification?.data?.ticket_id}`)
                        }}
                            className="flex gap-2 py-2 text-base">
                            <div>
                                {/* different emoji based on different notification type */}
                                {notification.type.toLowerCase() === "ticket" && "🎫"}
                            </div>
                            <div>
                                {`${notification.title}: ${notification?.data?.ticket_id}`}
                            </div>
                        </div>
                    </Badge>
                </Menu.Item>
            )
            )
            }
            {
                notification?.notifications?.length >= 10 &&
                <Menu.Item key={112}>
                    <Link href={`/${userData?.role}/notifications`}><a className="flex justify-center items-center !text-blue-600 !underline">see more</a></Link>
                </Menu.Item>
            }
        </Menu >
    );

    return (
        <header className="header">
            <div className="h-16 px-4 flex justify-between items-center">
                <div>
                    <FaBars size={18} role="button" onClick={() => {
                        document.querySelector('.dashboard')?.classList.toggle(window.innerWidth > 1024 ? 'mini' : 'mobile')
                    }} />
                </div>
                <div className="nav-menu flex items-center space-x-6">
                    <Link href="/">
                        <a target="_blank" title="Go to Frontend"><FaGlobe /></a>
                    </Link>

                    {/* notification  */}
                    <Dropdown overlay={notificationList} trigger={['click']}>
                        <Badge size={"small"} overflowCount={5} count={notification?.total_unread_notifications}>
                            < AiOutlineBell style={{fontSize: '1.5rem'}} />
                        </Badge>
                    </Dropdown>

                    <NavDropdown
                        title={i18n?.languages?.find(l => l.key === i18n.lang)?.name}
                        className="language-selector"
                    >
                        {i18n?.languages?.map((l, index) => (
                            <NavDropdown.Item onClick={() => i18n.changeLang(l.key)}
                                key={index}>{l.name}</NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    {/* login/register/profile  */}
                    <div>
                        <Dropdowns placement="bottomRight" {...profileDropDowns} />
                    </div>
                </div>
            </div>
        </header>
    )
}
export default Header