
const BulletPoints = ({ heading, paragraph }) => {
    return (
        <div className='flex mt-11'>
            <div className='mt-[8px] min-w-fit'>
                <img className='' width={12} height={20} src="/assets/arrow.png" alt=""></img>
            </div>
            <div className='ml-6'>
                <h4 className='font-medium text-2xl text-twContent-header'>{heading}</h4>
                <p className='mt-[20px] font-medium text-lg text-twContent-muted lg:max-w-lg text-justify'>{paragraph}</p>
            </div>
        </div>
    );
};

export default BulletPoints;