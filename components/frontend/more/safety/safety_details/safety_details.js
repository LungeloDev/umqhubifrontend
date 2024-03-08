import React from "react";
import RouteLoader from "../../../../common/preloader";
import Safety from "./safety";

const SafetyDetails = ({data}) => {
  if (!data) {
    return <div className="w-full h-screen flex justify-center items-center">
      <RouteLoader />
    </div>
  }

  return (
    data?.content?.service?.value.map((safety, i) => (
      <Safety
        imageSide={i % 2 == 1 ? 'left' : 'right'}
        title={safety.title}
        subtitle={safety.subtitle}
        image={safety.image}
        paragraph={safety.description}
        key={i}
      ></Safety>
    ))
  );
};

export default SafetyDetails;
