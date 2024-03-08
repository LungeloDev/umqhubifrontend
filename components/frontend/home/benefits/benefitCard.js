const BenefitCard = ({ icon, heading, paragraph }) => {

    return (
        <div className='bg-twPrimary-shade50 border-2 border-twPrimary py-7 max-w-md rounded-br-[40px] rounded-tl-[40px]'>
            <div className='flex justify-center'>
                <img className="md:max-w-1/3 max-w-1/2 max-h-[120px]" src={icon} alt=""></img>
            </div>
            <h6 className='my-[20px] font-semibold text-twContent text-3xl max-w-sm mx-auto'>{heading}</h6>
            <p className='max-w-sm mx-auto px-10 text-justify font-medium text-twContent-muted text-lg'>{paragraph}</p>
        </div>
    );
};

export default BenefitCard;