
const CounterSection = ({counterData}) => {
    
    return (
        <>
            {
                counterData &&
                <div className="container bg-twWarning-shade50 grid grid-cols md:grid-cols-2 lg:grid-cols-4 rounded-[10px] border-2 border-twPrimary">
                    <div className="py-[52px] text-center">
                        <h6 className="mb-[30px] font-medium text-[56px]">{counterData?.data_1st}</h6>
                        <p className="font-medium text-[22px]">{counterData?.description_1st}</p>
                    </div>
                    <div className="py-[52px] text-center">
                        <h6 className="mb-[30px] font-medium text-[56px]">{counterData?.data_2nd}</h6>
                        <p className="font-medium text-[22px]">{counterData?.description_2nd}</p>
                    </div>
                    <div className="py-[52px] text-center">
                        <h6 className="mb-[30px] font-medium text-[56px]">{counterData?.data_3rd}</h6>
                        <p className="font-medium text-[22px]">{counterData?.description_3rd}</p>
                    </div>
                    <div className="py-[52px] text-center">
                        <h6 className="mb-[30px] font-medium text-[56px]">{counterData?.data_4th}</h6>
                        <p className="font-medium text-[22px]">{counterData?.description_4th}</p>
                    </div>
                </div>
            }
        </>
    );
};

export default CounterSection;