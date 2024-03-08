import Brands from "../../components/frontend/home/brands";
import Platform from "../../components/frontend/home/platform/platform";
import Hero from "../../components/frontend/common/hero";
import Work from "../../components/frontend/home/work/work";
import CounterSection from "../../components/frontend/home/counterSection";
import Benefits from "../../components/frontend/home/benefits/benefits";
import Testimonials from "../../components/frontend/home/testimonials/testimonials";
import Articles from "../../components/frontend/home/articles/articles";
import NewsLetter from "../../components/frontend/home/newsLetter";
import {useFetch} from "../../helpers/hooks";
import {getLandingPageData} from "../../helpers/backend_helper";
import {useUserDataContext} from "../../contexts/userDataContext";
import {useEffect} from "react";
import Header from "../../components/frontend/common/header";
import Footer from "../../components/frontend/common/footer";
import I18nContext, {initI18n} from "../../contexts/i18n";
import {Skeleton} from "antd";

const Frontend = () => {
    const i18n = initI18n()
    const {language} = useUserDataContext()
    const [data, getData] = useFetch(getLandingPageData, {}, false)

    useEffect(() => {
        if (language) {
            getData({pages: "land_page", lang: language})
        }
    }, [language])

    if (!!data) {
        return (
            < I18nContext.Provider value={i18n} >
                <div className="font-Poppins">
                    <Header />
                    <Hero heading={data?.content?.hero?.value?.title} paragraph={data?.content?.hero?.value?.description} image={data?.content?.hero?.value?.image} />
                    <Brands logos={data?.content?.hero_section_banners?.value} />
                    <Platform />
                    <Work workData={data?.content?.work?.value} />
                    <CounterSection counterData={data?.content?.statistics?.value} />
                    <Benefits benifitsData={data?.content?.benifit?.value} />
                    <Testimonials />
                    <Articles />
                    <NewsLetter />
                    <Footer />
                </div>
            </I18nContext.Provider >
        )
    }

    return (
        <div className="w-full container h-screen flex flex-col justify-center items-center">
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
        </div>
    )
}
export default Frontend