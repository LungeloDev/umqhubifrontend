import Blogs from "../../../components/frontend/blogs/blogs";
import Title from "../../../components/frontend/common/title";
import HomeLayout from "../../../layouts/home";
import {useUserDataContext} from "../../../contexts/userDataContext";
import {useFetch} from "../../../helpers/hooks";
import {fetchBlogs, getLandingPageData} from "../../../helpers/backend_helper";
import {useEffect} from "react";
import {Skeleton} from "antd";
import Pagination from "../../../components/common/pagination";

const Blog = () => {
  const {language} = useUserDataContext()
  const [data, getData] = useFetch(getLandingPageData, {}, false)
  const [blogs, getBlogs] = useFetch(fetchBlogs, {}, false);

  useEffect(() => {
    if(!!language){
        getData({lang: language, pages: "blog"})
        getBlogs({type: "blog", lang: language, size: 12})
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
      <Blogs data={blogs} />
      <div className="container">
        <Pagination page={blogs?.page} total={blogs?.totalDocs}
          onSizeChange={size => getBlogs({size})} limit={blogs?.limit}
          totalPages={blogs?.totalPages} onPageChange={page => getBlogs({page})} />
      </div>
    </div>
  );
};

Blog.layout = HomeLayout
export default Blog;