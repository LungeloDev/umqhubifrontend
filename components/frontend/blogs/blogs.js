import React, {useEffect, useState} from "react";
import RouteLoader from "../../common/preloader";
import ArticleCard from "../common/articleCard";

const Blogs = ({data}) => {

  if (!data?.docs) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <RouteLoader />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="my-20 grid grid-cols md:grid-cols-2 lg:grid-cols-3 items-center justify-items-center gap-[60px]">
        {data?.docs?.map((blog) => (
          <ArticleCard key={blog?._id} {...blog} />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
