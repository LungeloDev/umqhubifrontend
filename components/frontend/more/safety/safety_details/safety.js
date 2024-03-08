import React from "react";

const Safety = ({ title, subtitle, image, paragraph, imageSide }) => {

  return (
    <div className="bg-yellow-50 bg-opacity-20 mt-20  py-16 font-Poppins">
      <div className="container">
        <div className="text-center">
          <h1 className="text-[40px] text-twContent-heading">
            {title}
          </h1>
          <p className="font-medium text-xl text-twContent-light mt-[20px] mb-10">
            {subtitle}
          </p>
        </div>
        <div className='grid lg:grid-cols-2 mt-[60px] items-center'>
          <div className={`${imageSide === 'right' ? 'md:order-last' : ''}`}>
            <img className="lg:ml-10 mx-auto" src={image} width={575} height={492} alt="image"></img>
          </div>
          <div className="text-medium text-lg text-twContent-light mt-8">
            <p className="">{paragraph}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Safety;
