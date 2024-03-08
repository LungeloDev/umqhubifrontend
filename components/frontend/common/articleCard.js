import moment from "moment";
import Link from "next/link";

const ArticleCard = ({cover_image, tags, heading, date, timeToRead, _id, details, press}) => {
  // extract text from html 
  function extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };

  return (
    <div>
      <div className="max-w-sm ml-[20px] rounded-md overflow-hidden shadow-md mb-3">
        <Link href={`/home/blog/post?_id=${_id}`}>
          <a href="">
            {" "}
            <img
              className={`rounded-md h-[250px] w-full ${press ? " " : "transition ease-in-out delay-200 hover:scale-110 duration-500 overflow-hidden"} `}
              src={`${cover_image}`}
              alt=""
            ></img>
          </a>
        </Link>
        <div className="min-h-[80px] px-2 py-3">
          <div className={`${press ? "hidden" : "flex flex-wrap"} line-clamp-2`}>
            {tags &&
              tags?.map((tag, index) => <span
                key={index}
                className="pr-[8px] mt-3 underline text-[#F9A825] text-sm"
              >
                {tag}
              </span>
              )}
          </div>
        </div>
        <Link href={`/home/blog/post?_id=${_id}`}>
          <div className="min-h-[64px] border-b border-dashed">
            <p title={heading} className="line-clamp-2  ml-[8px] font-medium text-2xl cursor-pointer ">
              {heading}
            </p>
          </div>
        </Link>
        <div className="py-[8px] border-dashed border-b">
          <p className="min-h-[80px] line-clamp-5 mx-[8px] font-normal text-xs text-[#A0A0A0] text-justify">
            {extractContent(details)}
          </p>
        </div>
        <div className="my-[16px] flex justify-between mx-[8px]">
          <p className="ml-[8px] font-medium text-lg text-[#646464]">
            {moment(date).format("MMM DD, YYYY")}
          </p>
          <p className="ml-8 font-medium text-lg text-[#646464]">
            {timeToRead}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
