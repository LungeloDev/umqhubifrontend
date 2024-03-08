import WorkCard from "./workCard";

const Work = ({ workData }) => {

    return (
        <>
            {
                workData &&
                <div className="container font-Poppins">
                    <div className='py-20 flex flex-col justify-center items-center'>
                        <h2 className='font-medium text-4xl text-twContent'>{workData?.work_title}</h2>
                        <p className='max-w-2xl text-center mt-[8px] font-medium text-lg text-twContent-muted'>{workData?.work_description}</p>
                        <div className='mt-10 grid lg:grid-cols-3 gap-[20px] justify-items-center items-center'>
                            <WorkCard heading={workData?.left_card_titile} paragraph={workData?.left_card_description} icon={workData?.image2} ></WorkCard>
                            <WorkCard heading={workData?.middle_card_titile} paragraph={workData?.middle_card_description} icon={workData?.image1} focus={true}></WorkCard>
                            <WorkCard heading={workData?.right_card_titile} paragraph={workData?.right_card_description} icon={workData?.image3} ></WorkCard>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Work;