import 'react-perfect-scrollbar/dist/css/styles.css';
import 'antd/dist/antd.css';
import 'bootstrap/scss/bootstrap.scss';
import 'nprogress/nprogress.css';
import "@fontsource/nunito";
import '../styles/app.scss'
import {Fragment, useEffect, useState} from "react";
import NProgress from 'nprogress';
import {Router} from "next/router";
import Head from "next/head";
import SiteContext from "../contexts/site";
import {useFetch} from "../helpers/hooks";
import {fetchSiteSettings, getLanguageSettings} from "../helpers/backend_helper";
import {Provider} from 'react-redux';
import UserDataContext from '../contexts/userDataContext';
import store from "../redux/store";

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App = ({Component, pageProps}) => {
    let Layout = Component.layout || Fragment
    const [settings] = useFetch(fetchSiteSettings)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [languages] = useFetch(getLanguageSettings);
    const [language, setLanguage] = useState();

    const siteSettingsData = {
        ...settings,
        languages: languages
    }

    useEffect(() => {
        const lang = localStorage.getItem("lang")
        setLanguage(lang || "en")
        const token = localStorage.getItem("authToken");
        if (!!token) {
            setIsLoggedIn(true)
        }
    }, [])

    const userDataContextValues = {
        isLoggedIn,
        setIsLoggedIn,
        language,
        setLanguage,
    }

    return (
        <Provider store={store}>
            <Head>
                <title>{settings?.site_name}</title>
                <link rel='manifest' href='/manifest.json' />
            </Head>
            {/* <RouteLoader /> */}
            <SiteContext.Provider value={siteSettingsData}>
                <UserDataContext.Provider value={userDataContextValues}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </UserDataContext.Provider>
            </SiteContext.Provider>
        </Provider>
    )
}

export default App