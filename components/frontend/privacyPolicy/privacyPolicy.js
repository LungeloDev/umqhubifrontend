import React from 'react';
import RouteLoader from "../../../components/common/preloader";

const PrivacyPolicyComponent = ({data}) => {
    if (!data) {
        return <div className="w-full h-screen flex justify-center items-center">
          <RouteLoader />
        </div>
      }

    return (
        <div className=" py-16 font-Poppins">
            <div className="container">
                <div className="mt-[4px] mx-auto text-justify" dangerouslySetInnerHTML={{ __html: data?.content?.privacy_policy?.value?.content }}>
                    
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyComponent;