import Header from "../components/frontend/common/header";
import Footer from "../components/frontend/common/footer";
import {useEffect} from "react";
import {fetchProfile} from "../helpers/backend_helper";
import {useRouter} from "next/router";
import {useUserContext} from "../contexts/user";
import I18nContext, {initI18n} from "../contexts/i18n";

const HomeLayout = ({children}) => {
    const {pathname, push} = useRouter();
    const {isLoggedIn} = useUserContext();
    const i18n = initI18n()

    useEffect(() => {
        fetchProfile().then(({error, data}) => {
            if (error === false) {
                localStorage.setItem('user', data?.role)
            } else {
                if (['/profile'].includes(pathname)) {
                    push('/')
                }
            }
        })
    }, [isLoggedIn])

    return (
        <I18nContext.Provider value={i18n}>
            <div className="font-Poppins">
                <Header />
                {children}
                <Footer />
            </div>
        </I18nContext.Provider>
    );
}

export default HomeLayout
