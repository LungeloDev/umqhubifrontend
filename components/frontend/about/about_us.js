import React from "react";
import RouteLoader from "../../common/preloader";

const AboutUs = ({ data }) => {

  if (!data) {
    return <div className="w-full h-screen flex justify-center items-center">
      <RouteLoader />
    </div>
  }

  return (
    <div className=" text-center py-16 font-Poppins">
      <div className="container">
        <div className="font-medium text-lg mt-[4px] mx-auto text-twContent-light text-justify" dangerouslySetInnerHTML={{ __html: data?.content?.about_us?.value?.content }}></div>
      </div>
    </div>
  );
};

export default AboutUs;
