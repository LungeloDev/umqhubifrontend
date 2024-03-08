import {Rate} from 'antd';

const TestimonialCard = ({data}) => {

    return (
        <div className='flex flex-col ml-[20px] items-center md:min-w-[400px] max-w-[400px] p-3'>
            <img className='rounded-full border-4 border-twSecondary-shade800 w-20 h-20 object-cover' src={data?.user?.image} alt=""></img>
            <h6 className='mt-[8px] text-xl font-medium text-twContent'>{data?.user?.name}</h6>
            <div className='flex'>
                <Rate className='text-twSecondary-shade800' allowHalf value={data?.rating} disabled />
            </div>
            <div className='min-h-[84px]'>
                <p title={data?.comment} className='line-clamp-4 mt-[20px] font-normal text-[#B8B8B8] text-lg'>{data?.comment}</p>
            </div>
        </div>

    );
};

export default TestimonialCard;