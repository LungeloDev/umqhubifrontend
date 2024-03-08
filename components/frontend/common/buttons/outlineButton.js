import React from 'react';

const OutlineButton = ({ name }) => {
    return (
        <div>
            <button className='px-[36px] py-[14px] text-twSecondary-shade700 hover:bg-twSecondary-shade700 hover:text-white border border-twSecondary-shade700 text-lg lg:text-xl font-medium rounded-lg'>
                {name}</button>
        </div>
    );
};

export default OutlineButton;