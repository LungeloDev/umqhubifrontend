import React from 'react';

const DriverDashboardCards = ({ stat, title, icon }) => {
    return (
        <div className='flex py-[23px] px-10 shadow-sm bg-white rounded-md justify-between items-center max-w-lg'>
            <div>
                <p className='text-[40px]'>{stat}</p>
                <p className='text-[22px]'>{title}</p>
            </div>
            <div className='text-[70px] p-2 bg-gradient-to-br from-[#FFD428] to-[#F9B776] rounded text-white'>
                {icon}
            </div>
        </div>
    );
};

export default DriverDashboardCards;