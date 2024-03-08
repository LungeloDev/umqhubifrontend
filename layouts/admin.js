import Sidebar from "../components/dashboard/sidebar";
import {
    FaLaptop,
    FaQrcode,
    FaUsers,
    FaWrench,
    FaStar,
    FaReact,
    FaUser,
    FaList,
    FaUniversity,
    FaRegCheckSquare,
    FaTools,
    FaWallet, FaMicroblog, FaBusinessTime, FaSms, FaPrint, FaRegCalendarAlt, FaBraille
} from "react-icons/fa";
import {HiOutlineNewspaper, HiTicket} from "react-icons/hi";
import {
    MdOutlineWeb,
    MdOutlineMarkEmailRead,
    MdElectricBike,
    MdLocalTaxi,
    MdGrading,
    MdPublishedWithChanges,
    MdStars,
    MdOutlineFeedback,
    MdPolicy,
    MdOutlineDesignServices,
    MdAllInbox,
    MdTextsms,
    MdEmail,
    MdManageAccounts,
    MdAttachEmail,
    MdNotificationAdd,
    MdOutlineNotificationImportant,
    MdOutlineNotificationAdd,
    MdPermDataSetting,
    MdSettingsPhone,
    MdOutlineSupportAgent, MdAvTimer
} from "react-icons/md";
import {useEffect, useState} from "react";
import {fetchProfile} from "../helpers/backend_helper";
import {useRouter} from "next/router";
import UserContext from "../contexts/user";
import I18nContext, {initI18n} from "../contexts/i18n";
import {FiHelpCircle} from "react-icons/fi";
import Header from "../components/dashboard/header";
import {BsCashCoin, BsFileEarmarkBinary, BsFillFileEarmarkRuledFill} from "react-icons/bs";
import {TbBrandBootstrap, TbPackage} from "react-icons/tb";
import {BiCategory, BiDollar, BiDollarCircle, BiMessageAdd, BiMoney, BiNews, BiNotification} from "react-icons/bi";
import {ImCancelCircle, ImLocation2} from "react-icons/im";
import {VscFeedback, VscSettings} from "react-icons/vsc";
import {SiKnowledgebase} from "react-icons/si";
import {
    AiFillCar,
    AiFillNotification,
    AiFillSafetyCertificate,
    AiFillSetting,
    AiOutlineDashboard,
    AiOutlineFieldTime, AiOutlineFile, AiOutlineUsergroupAdd
} from "react-icons/ai";
import {Loader} from "../components/common/preloader";
import {RiChatSettingsLine, RiCompassDiscoverFill, RiMailSettingsFill, RiSettings6Fill} from "react-icons/ri";
import {useUserDataContext} from "../contexts/userDataContext";
import {GrContactInfo, GrOrganization, GrUserSettings} from "react-icons/gr";
import {IoNotificationsCircleSharp, IoPush} from "react-icons/io5";


const AdminLayout = ({children}) => {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const i18n = initI18n()
    const {isLoggedIn} = useUserDataContext()

    useEffect(() => {
        getProfile()
    }, [isLoggedIn])

    const getProfile = () => {
        fetchProfile().then(({error, data}) => {
            if (error === false && (data?.role === "admin" || data?.role === "employee")) {
                setUser({...data})
            } else {
                localStorage.removeItem("authToken")
                router.push('/login')
            }
        })
    }

    const menu = getMenu(user)
    if (user === null) {
        return (<div className="loader block">
            <Loader />
        </div>)
    }

    return (
        <I18nContext.Provider value={i18n}>
            <UserContext.Provider value={{...user, getProfile}}>
                <div className="dashboard relative">
                    <Sidebar menu={menu} />
                    <Header />
                    <div className="fixed top-0 h-16 z-10 w-full bg-white" />
                    <div className="main-content">
                        <div className="w-full sm:p-5 z-0" style={{minHeight: 400}}>
                            {children}
                        </div>
                    </div>
                </div>
            </UserContext.Provider>
        </I18nContext.Provider>
    )
}
export default AdminLayout

const menu = [
    {
        label: 'Dashboard',
        icon: FaLaptop,
        href: '/admin',
        permissions: ['admin', 'employee']
    },
    {
        label: 'Service Management',
        icon: FaReact,
        child: [
            {
                label: 'Category',
                icon: BiCategory,
                href: '/admin/services/category',
                childHrefs: ['/admin/services/category', "/admin/services/category/[_id]"],
                permissions: ['admin', 'service_category_show'],
            },
            {
                label: 'Packages',
                icon: TbPackage,
                href: '/admin/services/packages',
                childHrefs: ['/admin/services/packages/add', "/admin/services/packages/[_id]"],
                permissions: ['admin', 'service_package_show'],
            },
            {
                label: 'Services',
                icon: AiFillCar,
                href: '/admin/services',
                childHrefs: ['/admin/services/add', "/admin/services/[_id]"],
                permissions: ['admin', 'service_show'],
            },
            {
                label: 'Service Brands',
                icon: TbBrandBootstrap,
                href: '/admin/services/vehicle/setting',
                childHrefs: ['/admin/services/vehicle/setting/add', "/admin/services/vehicle/setting/[_id]"],
                permissions: ['admin', 'service_brands_show'],
            },
            {
                label: 'Service Vehicles',
                icon: MdElectricBike,
                href: '/admin/services/vehicle',
                childHrefs: ['/admin/services/vehicle/add', "/admin/services/vehicle/[_id]"],
                permissions: ['admin', 'service_vehicle_show'],
            },
            {
                label: 'Service Location',
                icon: ImLocation2,
                href: '/admin/services/location',
                childHrefs: ['/admin/services/location/add', "/admin/services/location/[_id]"],
                permissions: ['admin', 'service_location_show'],
            },
            {
                label: 'Fare Management',
                icon: BiDollar,
                href: '/admin/services/fare-management',
                childHrefs: ['/admin/services/fare-management/add', "/admin/services/fare-management/[_id]"],
                permissions: ['admin', 'service_fare_management_show'],
            },
            {
                label: 'Cancellation Reason',
                icon: TbPackage,
                href: '/admin/services/cancel-reason',
                permissions: ['admin'],
            },
        ]
    },
    {
        label: 'User Management',
        icon: FaUsers,
        child: [
            {
                label: 'User List',
                icon: FaUsers,
                href: '/admin/user',
                childHrefs: ['/admin/user/user-details'],
                permissions: ['admin', 'user_list_show'],
            },
            {
                label: 'Wallet Deposits',
                icon: FaWallet,
                href: '/admin/user/wallet',
                childHrefs: ['/admin/user/wallet'],
                permissions: ['admin', 'user_wallet_deposit_show'],

            },
            {
                label: 'Payment Records',
                icon: BsFileEarmarkBinary,
                href: '/admin/user/payment-records',
                childHrefs: ['/admin/user/payment-records'],
                permissions: ['admin', 'user_payment_record_show'],

            },
            {
                label: 'User Ratings',
                icon: MdStars,
                href: '/admin/user/ratings',
                childHrefs: ['/admin/user/ratings'],
                permissions: ['admin', 'user_ratting_show'],

            },
        ]
    },
    {
        label: 'Driver Management',
        icon: FaUser,
        child: [
            {
                label: 'Driver List',
                icon: FaUsers,
                href: '/admin/driver/approved-list',
                childHrefs: ['/admin/driver/approved-list/add', "/admin/driver/approved-list/[_id]"],
                permissions: ['admin', 'driver_list_show'],
            },
            {
                label: 'Vehicle List',
                icon: MdElectricBike,
                href: '/admin/driver/vehicles',
                permissions: ['admin', 'driver_vehicle_list_show'],
            },
            {
                label: 'Driver Earnings',
                icon: BiDollarCircle,
                href: '/admin/driver/earning',
                permissions: ['admin', 'driver_earnings_show'],
            },
            {
                label: 'Document Input',
                icon: AiOutlineFile,
                href: '/admin/driver/registration-forms',
                permissions: ['admin', 'driver_document_input_show'],
            },
        ]
    },
    {
        label: 'Coupon',
        icon: RiCompassDiscoverFill,
        child: [
            {
                label: 'List',
                icon: FaList,
                href: '/admin/coupon',
                childHrefs: ['/admin/coupon/list', "/admin/coupon/[_id]"],
                permissions: ['admin', 'coupon_list_show'],
            },
            {
                label: 'Create',
                icon: BiMessageAdd,
                href: '/admin/coupon/create',
                childHrefs: ["/admin/coupon/edit/[_id]"],
                permissions: ['admin', 'coupon_create_show'],
            },
        ]
    },
    {
        label: 'Trip Management',
        icon: MdLocalTaxi,
        child: [
            {
                label: 'Trips',
                icon: FaList,
                href: '/admin/trip-management/trips',
                childHrefs: ['/admin/trip-management/trips/', "/admin/trip-management/trips/[_id]"],
                permissions: ['admin', 'trips_show'],
            },
            {
                label: 'Cancelled Trips',
                icon: ImCancelCircle,
                href: '/admin/trip-management/canceled-trips',
                childHrefs: ['/admin/trip-management/canceled-trips/add', "/admin/trip-management/canceled-trips/[_id]"],
                permissions: ['admin', 'trips_cancelled_show'],
            },
        ]
    },
    {
        label: 'Withdraw',
        icon: BiMoney,
        child: [
            {
                label: 'All Withdraw Request',
                icon: BiDollarCircle,
                href: '/admin/withdraw/withdraw-request',
                childHrefs: ['/admin/withdraw/withdraw-request/[_id]'],
                permissions: ['admin', 'withdraw_request_show'],
            },
        ]
    },
    {
        label: 'Frontend Pages',
        icon: MdOutlineWeb,
        child: [
            {
                label: 'Landing Page',
                icon: FaQrcode,
                href: '/admin/frontend/landing-page',
                childHrefs: ['/admin/frontend/landing-page/add', "/admin/frontend/landing-page/[_id]"],
                permissions: ['admin', 'frontend_landing_page_show']
            }, {
                label: 'Login Page',
                icon: FaBraille,
                href: '/admin/frontend/login_page',
                permissions: ['admin', 'frontend_login_page_show']
            },
            {
                label: 'Contact Page',
                icon: MdOutlineMarkEmailRead,
                href: '/admin/frontend/contact',
                childHrefs: ['/admin/frontend/contact-page/add', "/admin/frontend/contact-page/[_id]"],
                permissions: ['admin', 'frontend_contact_page_show']
            },
            {
                label: 'FAQ',
                icon: FiHelpCircle,
                href: '/admin/frontend/faq',
                childHrefs: ['/admin/frontend/faq/add', "/admin/frontend/faq/[_id]"],
                permissions: ['admin', 'frontend_faq_show']
            },
            {
                label: 'About Us',
                icon: GrContactInfo,
                href: '/admin/frontend/about_us',
                permissions: ['admin', 'frontend_about_us_show']
            },
            {
                label: 'Terms & Conditions',
                icon: BsFillFileEarmarkRuledFill,
                href: '/admin/frontend/terms_conditions',
                permissions: ['admin', 'frontend_terms_and_conditions_show']
            },
            {
                label: 'Help and Support',
                icon: MdOutlineFeedback,
                href: '/admin/frontend/help_support',
                permissions: ['admin', 'frontend_terms_and_conditions_show']
            },
            {
                label: 'Privacy Policy ',
                icon: MdPolicy,
                href: '/admin/frontend/privacy_policy',
                permissions: ['admin', 'frontend_privacy_policy_show']
            },
            {
                label: 'Services',
                icon: MdOutlineDesignServices,
                href: '/admin/frontend/services',
                permissions: ['admin', 'frontend_services_show']
            },
            {
                label: 'Business',
                icon: FaBusinessTime,
                href: '/admin/frontend/business',
                permissions: ['admin', 'frontend_business_show']
            },
            {
                label: 'Safety',
                icon: AiFillSafetyCertificate,
                href: '/admin/frontend/safety',
                permissions: ['admin', 'frontend_safety_show']
            },
            {
                label: 'Blog',
                icon: FaMicroblog,
                href: '/admin/frontend/blog',
                permissions: ['admin', 'frontend_blog_show']
            },
            {
                label: 'Press',
                icon: BiNews,
                href: '/admin/frontend/press',
                permissions: ['admin', 'frontend_press_show']
            },
            {
                label: 'Custom Page',
                icon: MdAllInbox,
                href: '/admin/frontend/create_page',
                permissions: ['admin', 'frontend_custom_page_show']
            },
        ]
    },
    {
        label: 'HRM',
        icon: FaUsers,
        child: [
            {
                label: 'All Employee',
                icon: FaUsers,
                href: '/admin/hrm',
                childHrefs: ['/admin/hrm/add', "/admin/hrm/[_id]"],
                permissions: ['admin', 'hrm_all_employee_show']
            },
            {
                label: 'Departments',
                icon: FaUniversity,
                href: '/admin/hrm/departments',
                childHrefs: ['/admin/hrm/department/add', "/admin/hrm/department/[_id]"],
                permissions: ['admin', 'hrm_department_show']
            },
            {
                label: 'Roles & Permissions',
                icon: FaStar,
                href: '/admin/hrm/roles',
                childHrefs: ['/admin/hrm/roles', "/admin/hrm/roles/[_id]"],
                permissions: ['admin', 'hrm_role_permission_show']
            },
            {
                label: 'Attendance',
                icon: FaRegCheckSquare,
                href: '/admin/hrm/attendance',
                childHrefs: ['/admin/hrm/attendance/add', "/admin/hrm/attendance/[_id]"],
                permissions: ['admin', 'hrm_attendance_show']
            },
            {
                label: 'Attendance Settings',
                icon: AiFillSetting,
                href: '/admin/hrm/attendance/setting',
                childHrefs: ['/admin/hrm/attendance/settings/add', "/admin/hrm/attendance/settings/[_id]"],
                permissions: ['admin', 'hrm_attendance_settings_show']
            },
            {
                label: 'Time Sheet',
                icon: AiOutlineFieldTime,
                href: '/admin/hrm/time-sheet/details',
                childHrefs: ['/admin/hrm/time-sheet/add', "/admin/hrm/time-sheet/[_id]"],
                permissions: ['admin', 'hrm_time_sheet_show']
            },
            {
                label: 'Holidays',
                icon: MdGrading,
                href: '/admin/hrm/holiday',
                childHrefs: ['/admin/hrm/holiday/add', "/admin/hrm/holiday/[_id]"],
                permissions: ['admin', 'hrm_holidays_show']
            },
            {
                label: 'Leaves',
                icon: MdPublishedWithChanges,
                href: '/admin/hrm/leave',
                childHrefs: ['/admin/hrm/leave/add', "/admin/hrm/leave/[_id]"],
                permissions: ['admin', 'hrm_leaves_show']
            },
            {
                label: 'Leaves Setting',
                icon: FaTools,
                href: '/admin/hrm/leave/setting',
                childHrefs: ['/admin/hrm/leave/setting/add', "/admin/hrm/leave/setting/[_id]"],
                permissions: ['admin', 'hrm_leaves_setting_show']
            },
        ]
    },
    {
        label: 'Payroll',
        icon: BiDollar,
        child: [
            {
                label: 'Salary Sheet',
                icon: FaUsers,
                href: '/admin/payroll/salary-sheet',
                childHrefs: ['/admin/payroll/salary-sheet/add', "/admin/payroll/salary-sheet/[_id]"],
                permissions: ['admin', 'payroll_salary_sheet_show']
            },
            {
                label: 'Employee Salary',
                icon: BsCashCoin,
                href: '/admin/payroll/employee-salary',
                childHrefs: ['/admin/payroll/employee-salary', "/admin/payroll/employee-salary/[_id]"],
                permissions: ['admin', 'payroll_employee_salary_show']
            },
            {
                label: 'Advance Salary',
                icon: FaRegCheckSquare,
                href: '/admin/payroll/advance-salary',
                childHrefs: ['/admin/payroll/advance-salary/add', "/admin/payroll/advance-salary/[_id]"],
                permissions: ['admin', 'payroll_advance_salary_show']
            },
            {
                label: 'Salary Settings',
                icon: AiFillSetting,
                href: '/admin/payroll/salary-settings',
                childHrefs: ['/admin/payroll/salary-settings/add', "/admin/payroll/salary-settings/[_id]"],
                permissions: ['admin', 'payroll_salary_settings_show']
            },
        ]
    },
    {
        label: 'Employee Tickets',
        icon: FaUsers,
        href: '/admin/employee/tickets',
        permissions: ['employee_ticket']
    },
    {
        label: 'Support Ticket',
        icon: FaWrench,
        permissions: ['admin', 'support_ticket'],
        child: [
            {
                label: 'Tickets',
                icon: HiTicket,
                href: '/admin/ticket/tickets',
            },
            {
                label: 'Knowledge Base',
                icon: SiKnowledgebase,
                href: '/admin/ticket/knowledgebase',
            },
            {
                label: 'Organization',
                icon: GrOrganization,
                href: '/admin/ticket/organization',
            },
            {
                label: 'Agents',
                icon: MdOutlineSupportAgent,
                href: '/admin/ticket/agents',
            },
            {
                label: 'Settings',
                icon: GrUserSettings,
                href: '/admin/ticket/setting',
            }
        ]
    },
    {
        label: 'Marketing',
        icon: FaQrcode,
        permissions: ['admin', 'marketing'],
        child: [
            {
                label: 'Dashboard',
                icon: AiOutlineDashboard,
                href: '/admin/marketing',
            },
            {
                label: 'SMS options',
                icon: MdTextsms,
                href: '/admin/marketing/sms',
            },
            {
                label: 'WhatsApp options',
                icon: FaQrcode,
                href: '/admin/marketing/whatsapp',
            },
            {
                label: 'Email options',
                icon: MdEmail,
                href: '/admin/marketing/email',
            },
            {
                label: 'Manage User',
                icon: MdManageAccounts,
                href: '/admin/marketing/manage_user',
            },
            {
                label: 'Manage Group',
                icon: AiOutlineUsergroupAdd,
                href: '/admin/marketing/manage_group',
            },
            {
                label: 'SMS Settings',
                icon: FaSms,
                href: '/admin/marketing/sms_settings',
            },
            {
                label: 'WhatsApp Settings',
                icon: FaQrcode,
                href: '/admin/marketing/whatsapp_setting',
            },
            {
                label: 'Email Settings',
                icon: MdAttachEmail,
                href: '/admin/marketing/email_setting',
            },
        ]
    },
    {
        label: 'Push Notification',
        icon: AiFillNotification,
        permissions: ['admin', 'push_notification'],
        child: [
            {
                label: 'Send Notification',
                icon: MdNotificationAdd,
                href: '/admin/push-notification/send_notification',
            },
            {
                label: 'All Notification',
                icon: IoNotificationsCircleSharp,
                href: '/admin/push-notification/all_notification',
            },
            {
                label: 'Scheduled Notification',
                icon: MdOutlineNotificationAdd,
                href: '/admin/push-notification/schedule_notification',
            },
            {
                label: 'Failed Notification',
                icon: MdOutlineNotificationImportant,
                href: '/admin/push-notification/failed_notification',
            },
            {
                label: 'Manage Notification Group ',
                icon: BiNotification,
                href: '/admin/push-notification/manage_group',
            },
        ]
    },

    {
        label: 'Feedback',
        icon: MdOutlineFeedback,
        permissions: ['admin', 'feedback_show'],
        child: [{
            label: 'User Feedback',
            icon: VscFeedback,
            href: '/admin/feedback',
        }]
    },
    {
        label: 'Report',
        icon: FaPrint,
        permissions: ['admin', 'report'],
        child: [
            {
                label: 'User Report',
                icon: FaUser,
                href: '/admin/report/users',
            },
            {
                label: 'Driver Report',
                icon: FaRegCalendarAlt,
                href: '/admin/report/drivers',
            },
            {
                label: 'Company Report',
                icon: HiOutlineNewspaper,
                href: '/admin/report/company',
            },
        ]
    },
    {
        label: 'Settings',
        icon: FaWrench,
        permissions: ['admin', 'setting_show'],
        child: [
            {
                label: 'Site Settings',
                icon: VscSettings,
                href: '/admin/settings',
            },
            {
                label: 'Application Url',
                icon: FaTools,
                href: '/admin/settings/app_url',
            },
            {
                label: 'Email Settings',
                icon: RiMailSettingsFill,
                href: '/admin/settings/email',
            },
            {
                label: 'SMS Settings',
                icon: RiChatSettingsLine,
                href: '/admin/settings/sms',
            },
            {
                label: 'Payment Settings',
                icon: RiSettings6Fill,
                href: '/admin/settings/payment',
            },
            {
                label: 'Language & Translation',
                icon: MdPermDataSetting,
                href: '/admin/settings/languages',
            },
            {
                label: 'Whatsapp settings',
                icon: MdSettingsPhone,
                href: '/admin/settings/whatsapp',
            },
            {
                label: 'Push Notification Settings',
                icon: IoPush,
                href: '/admin/settings/push_notification',
            },
        ]
    }
]

const getMenu = user => {
    const router = useRouter()
    const hasPermission = menu => {
        if (menu.permission && havePermission(menu.permission, user?.permission)) {
            return true
        }
        if (menu.permissions) {
            for (let permission of menu.permissions) {
                if (havePermission(permission, user?.permission)) {
                    return true
                }
            }
        }
        if (menu.permissions) {
            for (let permission of menu.permissions) {
                if (roleWisePermission(permission, [user?.role])) {
                    return true
                }
            }
        }
        if (process.browser) {
            if (router?.pathname === menu.href && user) {
                router?.push('/').then(() => {
                })
            }
        }
        return false
    }
    return menu?.map(d => ({...d, href: d.href?.replace('[_id]', user?._id)})).filter(menu => {
        if (+user?.profile?.is_owner === 1) {
            return true
        } else if (menu?.permission === 'any' || menu?.permission === 'admin') {
            return true
        } else if (menu.permission || menu.permissions) {
            return hasPermission(menu)
        } else if (Array.isArray(menu.child)) {
            menu.child = menu.child.filter(child => {
                return hasPermission(child)
            })
            return menu.child.length > 0
        }
        return false
    })
}

export const havePermission = (permission, roles) => {
    for (let role of roles || []) {
        if (role?.permissions?.includes(permission)) {
            return true
        }
    }
    return false
}

export const roleWisePermission = (permission, roles) => {
    if (roles?.includes(permission)) {
        return true
    }
    return false
}