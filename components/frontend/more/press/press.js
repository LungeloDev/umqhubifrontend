import {Skeleton} from "antd";
import React, {useEffect, useState} from "react";
import ArticleCard from "../../common/articleCard";

const PressComponent = ({data}) => {

  if (!data?.docs) {
    return (
      <div className="container w-full pt-20 flex flex-col gap-y-10 justify-center items-center">
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="my-20 grid grid-cols md:grid-cols-2 lg:grid-cols-3 items-center justify-items-center gap-[60px]">
        {data?.docs?.map((press) => (
          <ArticleCard key={press?._id} {...press} press={true} />
        ))}
      </div>
    </div>
  );
};

export default PressComponent;
