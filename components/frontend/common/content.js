import React from "react";

const Content = ({ heading, paragraph }) => {
  return (
    <div className="mt-7 lg:w-1/2 w-3/4 mx-auto">
      <h3 className="text-lg text-twContent-header">{heading}</h3>
      <p className="mt-[8px] text-[16px] text-twContent-light">{paragraph}</p>
    </div>
  );
};

export default Content;