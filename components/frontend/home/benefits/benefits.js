import React from 'react';
import BenefitCard from './benefitCard';

const Benefits = ({ benifitsData }) => {
    
    return (
        <>
            {
                benifitsData &&
                <div className='text-center my-20'>
                    <h3 className='font-medium text-4xl text-twContent'>{benifitsData?.benifit_title}</h3>
                    <div className='mt-10 grid lg:grid-cols-3 gap-[20px] px-[10%] justify-items-center'>
                        <BenefitCard icon={benifitsData?.image2} heading={benifitsData?.left_card_titile} paragraph={benifitsData?.left_card_description}></BenefitCard>
                        <BenefitCard icon={benifitsData?.image1} heading={benifitsData?.middle_card_titile} paragraph={benifitsData?.middle_card_description}></BenefitCard>
                        <BenefitCard icon={benifitsData?.image3} heading={benifitsData?.right_card_titile} paragraph={benifitsData?.right_card_description}></BenefitCard>
                    </div>
                </div>
            }
        </>
    );
};

export default Benefits;