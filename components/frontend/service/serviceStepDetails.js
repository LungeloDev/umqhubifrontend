import React from "react";

const ServiceStepDetails = ({ sl, title, paragraph, image, imageSide }) => {

  return (
    <section className=" mt-20 font-Poppins">
      <section className="container">
        <div className="grid md:grid-cols-2 mt-[60px] items-center gap-x-[20px]">
          <div className={`${imageSide === 'right' ? 'md:order-last' : ''}`}>
            <img className="mx-auto md:mx-0" src={image} alt="" width="536px" />
          </div>
          <div className="">
            <div className="text-twContent flex-1  md:mt-0 mt-[16px] ">
              <h2 className="font-medium text-3xl md:text-[40px]">0{sl}</h2>
              <h2 className="font-medium text-3xl md:text-[40px] mt-[16px]">{title}</h2>
              <p className="font-medium text-[18px] mt-[16px]">
                {paragraph}
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );

};

export default ServiceStepDetails;
