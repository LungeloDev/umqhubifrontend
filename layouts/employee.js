import Sidebar from "../components/dashboard/sidebar";
import {FaLaptop} from "react-icons/fa";
import {useEffect, useState} from "react";
import {fetchProfile} from "../helpers/backend_helper";
import {useRouter} from "next/router";
import UserContext from "../contexts/user";
import I18nContext, {initI18n} from "../contexts/i18n";
import Header from "../components/dashboard/header";
import {Loader} from "../components/common/preloader";
import {useUserDataContext} from "../contexts/userDataContext";

const EmployeeLayout = ({children}) => {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const i18n = initI18n()
    const {isLoggedIn} = useUserDataContext()

    useEffect(() => {
        getProfile()
    }, [isLoggedIn])

    const getProfile = () => {
        fetchProfile().then(({error, data}) => {
            if (error === false && data?.role === "employee") {
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
export default EmployeeLayout


const menu = [
    {
        label: 'Dashboard', icon: FaLaptop, href: '/employee', permission: 'any'
    },
    {
        label: 'Employee Tickets',
        icon: FaLaptop,
        href: '/employee/tickets',
        permission: 'any'
    },
]

const getMenu = user => {
    const router = useRouter()
    const hasPermission = menu => {
        if (menu.permission && havePermission(menu.permission, user?.roles)) {
            return true
        }
        if (menu.permissions) {
            for (let permission of menu.permissions) {
                if (havePermission(permission, user?.roles)) {
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
        } else if (menu?.permission === 'any') {
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
