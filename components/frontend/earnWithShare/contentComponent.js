import React from "react";
import Content from "../common/content";
import { useFetch } from "../../../helpers/hooks";
import { fetchEarnWithShare } from "../../../helpers/backend_helper";

const ContentComponent = () => {
    const [contents] = useFetch(fetchEarnWithShare)

  return (
    <div className="bg-yellow-50 bg-opacity-20 mt-20 text-center py-16 font-Poppins">
      <div className="container">
        <h1 className="text-[40px] text-twContent-heading font-DM_Serif">{contents?.section_3?.title}</h1>
        <p className="font-medium text-xl text-twContent-light mt-[16px] mb-10">{contents?.section_3?.description}</p>
        {contents?.required.map((content) => (
          <Content
            heading={content?.title}
            paragraph={content?.description}
            key={content?._id}
          ></Content>
        ))}
      </div>
    </div>
  );
};

export default ContentComponent;
