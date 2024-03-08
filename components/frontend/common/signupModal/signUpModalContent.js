import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const SignUpModalContent = ({ heading, subHeading, buttonUrl, buttonText, setModalOpen }) => {

    const router = useRouter()

    return (
        <div className='my-[92px] max-w-[90%] md:max-w-[70%] mx-auto'>
            <h3 className='font-bold text-twContent text-xl md:text-4xl'>{heading}</h3>
            <p className='text-twContent-muted mt-[20px]'>{subHeading}</p>
            <div className='w-full mt-[40px]' onClick={() => setModalOpen(false)}>
                <Link href={buttonUrl}>
                    <a className='rounded-lg bg-twPrimary text-twContent hover:text-twContent block w-full py-[20px] font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'>{buttonText}</a>
                </Link>
            </div>

        </div>
    );
};

export default SignUpModalContent;