import React from "react";
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import RouteLoader from "../../../common/preloader";
const { Panel } = Collapse;

const KnowledgeComponent = ({data}) => {
    
    if (!data) {
        return <div className="w-full h-screen flex justify-center items-center">
          <RouteLoader />
        </div>
      }

  return (
    <div className='container'>
        <div className="lg:px-56">
              {data?.content?.knowledgeBase?.value?.map((knowledge, i) => 
                <Collapse
                bordered={false}
                defaultActiveKey={['0']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                className="site-collapse-custom-collapse mt-10 bg-yellow-50 bg-opacity-20"
            >
                    <Panel header={knowledge?.question} key={i} className="site-collapse-custom-panel text-base">
                        <p className="text-twContent-light text-justify pl-6">{knowledge?.answer}</p>
                    </Panel>
                </Collapse>
            )}
        </div> 
    </div>
  );
};

export default KnowledgeComponent;
