import moment from "moment";
import React from "react";

const SingleBlog = ({cover_image, createdAt, details, heading, timeToRead, tags}) => {

  return (
    <div className="container">
      <div className="mt-[20px] mb-20 lg:mx-56 md:mx-10">
        <div className="">
          <img
            className="h-auto mx-auto w-full"
            src={cover_image}
            alt={heading}
          />
        </div>

        {/* blog title */}
        <h1 className="text-twContent font-medium md:text-4xl text-2xl mt-[20px] text-justify leading-snug">
          {heading}
        </h1>

        <div className="my-[16px] flex justify-between">
          <p className="font-medium text-lg text-twContent-muted">
            {moment(createdAt).format("MMM DD, YYYY")}
          </p>
          <p className="font-medium text-lg text-twContent-muted">
            {timeToRead}
          </p>
        </div>

        {/* blog article */}
        <div className="mt-7">
          <article
            className="text-justify prose text-twContent-light"
            dangerouslySetInnerHTML={{__html: details}}
          />
        </div>

        {/* tags  */}
        {tags?.length > 0 && <div className="flex flex-wrap gap-2 mt-8 text-twContent font-bold text-lg">
          Tags:
          {tags.map((tag, i) => <span className="underline text-twSecondary-shade800 font-normal text-base" key={i}>{tag}</span>)}
        </div>}

      </div>
    </div>
  );
};

export default SingleBlog;
