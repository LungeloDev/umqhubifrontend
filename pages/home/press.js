import Title from "../../components/frontend/common/title";
import PressComponent from "../../components/frontend/more/press/press";
import HomeLayout from "../../layouts/home";
import {useUserDataContext} from "../../contexts/userDataContext";
import {useFetch} from "../../helpers/hooks";
import {fetchBlogs, getLandingPageData} from "../../helpers/backend_helper";
import {useEffect} from "react";
import Pagination from "../../components/common/pagination";
import { Skeleton } from "antd";

const Press = () => {
    const {language} = useUserDataContext()
    const [data, getData] = useFetch(getLandingPageData, {}, false)
    const [blogs, getBlogs] = useFetch(fetchBlogs, {}, false);

    useEffect(() => {
        if(!!language){
            getData({lang: language, pages: "press"})
            getBlogs({type: "press", lang: language, size: 12})
        }
    }, [language])

    if (!blogs) {
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
            <Title heading={data?.content?.header?.value?.title} paragraph={data?.content?.header?.value?.subtitle} />
            <PressComponent data={blogs} />
            <div className="container">
                <Pagination page={blogs?.page} total={blogs?.totalDocs}
                    onSizeChange={size => getBlogs({type: "press", size})} limit={blogs?.limit}
                    totalPages={blogs?.totalPages} onPageChange={page => getBlogs({type: "press", page})} />
            </div>
        </div>
    );
};

Press.layout = HomeLayout
export default Press;