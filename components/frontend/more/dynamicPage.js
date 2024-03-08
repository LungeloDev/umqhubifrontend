import React from "react";
import RouteLoader from "../../../components/common/preloader";

const DynamicComponent = ({ data }) => {
  if (!data) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <RouteLoader />
      </div>
    );
  }

  return (
    <div className=" py-16 font-Poppins">
      <div className="container">
        <p
          className="font-medium text-lg mt-[4px] mx-auto text-twContent-light text-justify"
          dangerouslySetInnerHTML={{ __html: data?.content?.page?.value?.content }}
        />
      </div>
    </div>
  );
};

export default DynamicComponent;
