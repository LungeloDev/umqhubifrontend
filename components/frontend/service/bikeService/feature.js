import { Skeleton } from "antd";
import React from "react";
import FeatureCard from "../featureCard";

const Feature = ({data}) => {
    if (!data) {
      return (
        <div className="container w-full pt-20 flex flex-col gap-y-10 justify-center items-center">
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </div>
      );
    }
    
    return (
        <div className="mt-16 font-Poppins">
            <div className="container">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 md:gap-x-52 md:gap-y-10 gap-y-12 text-center">
                    <FeatureCard image={data?.left_card?.image} title={data?.left_card?.title} paragraph={data?.left_card?.description}></FeatureCard>
                    <FeatureCard image={data?.middle_card?.image} title={data?.middle_card?.title} paragraph={data?.middle_card?.description}></FeatureCard>
                    <FeatureCard image={data?.right_card?.image} title={data?.right_card?.title} paragraph={data?.right_card?.description}></FeatureCard>
                </div>
            </div>

        </div>
    );
};

export default Feature;
