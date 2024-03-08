import React from "react";
import ServiceStepDetails from "../serviceStepDetails";

const ServiceStep = ({data}) => {
  const steps = data?.slice(1);

  return (
    <>
      {steps?.map((data, i) => (
        <ServiceStepDetails
          imageSide={i % 2 === 0 ? 'left' : 'right'}
          sl={i+2}
          image={data.image}
          title={data.title}
          paragraph={data.description}
          key={i}
        ></ServiceStepDetails>
      ))}
    </>
  );
};

export default ServiceStep;
