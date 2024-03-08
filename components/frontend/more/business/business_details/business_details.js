import React from "react";
import { Loader } from "../../../../common/preloader";

const BusinessDetails = ({ description }) => {
  
  if (!description) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 bg-opacity-20 mt-20 text-center py-16 font-Poppins">
      <div className="container">
        <p className="font-medium text-xl text-twContent-light mt-[16px] mb-10" dangerouslySetInnerHTML={{ __html: description }}>
        </p>
      </div>
    </div>
  );
};

export default BusinessDetails;
