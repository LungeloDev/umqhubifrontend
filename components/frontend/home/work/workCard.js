import { Button, Popover } from "antd";

const WorkCard = ({ icon, heading, paragraph, focus }) => {

  return (
    <div
      className={`${focus
        ? "py-20 max-w-[400px] min-h-[450px] border-2 border-twPrimary shadow-md "
        : "py-14 max-w-[300px] h-[380px]"
        } px-8 bg-[#FFFCF2] flex flex-col justify-center items-center rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex justify-center">
        <img className="w-[80px] h-[80px]" src={icon} alt=""></img>
      </div>
      <h3
        className={`${focus ? "font-semibold text-3xl" : "font-medium text-2xl"
          } text-center mb-[20px] mt-[20px] text-3xl text-twContent`}
      >
        {heading}
      </h3>
      <p
        className={`${focus
          ? "font-normal text-twContent"
          : "font-medium text-twContent-muted"
          } text-justify `}
      >
        {paragraph?.length > 150 ? (
          <>
            {paragraph?.slice(0, 150)}
            <Popover
              placement="top"
              content={
                <div className="max-w-sm text-twContent text-base">
                  {paragraph}
                </div>
              }
              trigger="click"
            >
              <br />
              <button className="text-twSecondary-shade700 hover:text-twSecondary-shade800">
                ....see more
              </button>
            </Popover>
          </>
        ) : (
          paragraph
        )}
      </p>
    </div>
  );
};

export default WorkCard;
