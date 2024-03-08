import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import RouteLoader from "../../../components/common/preloader";
import SingleBlog from "../../../components/frontend/blogs/singleBlog";
import {fetchBlog} from "../../../helpers/backend_helper";
import {useFetch} from "../../../helpers/hooks";
import HomeLayout from "../../../layouts/home";

const Blog = () => {
  const [singleBlogPost, getSingleBLogPost] = useFetch(fetchBlog, {}, false)
  const {query} = useRouter()
  const id = query?._id;
  useEffect(() => {
    if (!!id) {
      getSingleBLogPost({_id: id})
    }
  }, [id])

  if (!singleBlogPost) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <RouteLoader />
      </div>
    );
  }

  return (
    <div>
      <SingleBlog {...singleBlogPost} />
    </div>
  );
};

Blog.layout = HomeLayout
export default Blog;