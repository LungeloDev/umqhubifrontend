import React from "react";
import { fetchSettings } from "../../../helpers/backend_helper";
import { useFetch } from "../../../helpers/hooks";

const AppSection = ({ title, paragraph, image }) => {
  const [setting] = useFetch(fetchSettings);

  return (
    <section className="mt-16 font-Poppins">
      <section className="container">
        <div className="flex flex-col-reverse  md:flex-row justify-between items-center gap-4">
          <div className="text-twContent flex-1 mt-[16px] md-mt-0">
            <h2 className="font-medium text-[40px]">01</h2>
            <h2 className="font-medium text-[40px] mt-[16px]">{title}</h2>
            <p className="font-medium text-[18px] mt-[16px]">
              {paragraph}
            </p>
            <div className="w-fit flex gap-[11px] flex-col mt-[30px]  md:mx-0">
              <a href={setting?.app_link?.android} target="_blank">
                <div className='flex items-center justify-center border border-twContent max-w-xs py-[12px] px-6 rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'>
                  <div> <img src="/assets/playstore.png" alt=""></img></div>

                  <div className="flex flex-col ml-[12px] text-twContent font-normal text-xs">
                    <p>GET IT ON</p>
                    <p className='font-bold text-xl'>Google Play</p>
                  </div>

                </div>
              </a>
              <a href={setting?.app_link?.ios} target="_blank">
                <div className='flex items-center justify-center border border-twContent max-w-xs py-[12px] px-6 rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'>
                  <div> <img src={"/assets/appStore.png"} alt=""></img></div>
                  <div className="flex flex-col ml-[12px] text-twContent font-normal text-xs">
                    <p>Download on the</p>
                    <p className='font-bold text-xl'>App Store</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="flex-1 ">
            <img className="md:h-[728px] h-[350px] mx-auto" src={image} alt="" />
          </div>
        </div>
      </section>
    </section>
  );
};

export default AppSection;
