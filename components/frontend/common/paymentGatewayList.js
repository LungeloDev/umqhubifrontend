import { useRouter } from 'next/router';
import React from 'react';

const PaymentGatewayList = ({ name, logo, listFor, redirectUrl = "/user/wallet/add-money" }) => {
    const { push } = useRouter();

    const handleClick = async () => {
        const authToken = localStorage.getItem('authToken') || '';
        await push({
            pathname: `${redirectUrl}/${name}`,
            query: { access: authToken },
        });
    };

    return (
        <div
            onClick={handleClick}
            className='p-2 h-40 bg-twPrimary-shade50 rounded-lg  cursor-pointer flex items-center justify-center transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1'>
            <div className='w-full h-full flex items-center justify-center p-4'><img className='object-fill h-full w-full' src={logo} alt={name} /></div>
        </div>
    );
};

export default PaymentGatewayList;