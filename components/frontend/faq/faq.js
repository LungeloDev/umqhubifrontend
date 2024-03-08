import React from "react";
import { Collapse } from "antd";
import RouteLoader from "../../../components/common/preloader";
const { Panel } = Collapse;

const Faqs = ({ data }) => {

  if (!data) {
    return <div className="w-full h-screen flex justify-center items-center">
      <RouteLoader />
    </div>
  }

  return (
    <div className="container">
      <div className="my-20 grid lg:grid-cols-2 gap-20 items-center faq">
        <div className="">
          <img
            className="mx-auto lg:h-[400px] md:h-[300px] lg:w-[600px] "
            src={"/assets/faq.png"}
            alt=""
          />
        </div>
        <div className="lg:h-[400px] md:overflow-y-auto">
          <Collapse
            bordered={false}
            className="bg-yellow-50 bg-opacity-20"
            defaultActiveKey={["1"]}
          >
            {data?.content?.faqs?.value?.map((faq, i) =>
              <Panel header={faq?.question} key={i + 1}>
                <p className="text-twContent-light text-justify pl-6">{faq?.answer}</p>
              </Panel>)}
          </Collapse>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
