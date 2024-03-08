import { FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HomeLayout from '../layouts/home';

function SuccessPage() {
    const [showPage, setShowPage] = useState(false);

    useEffect(() => {
        setShowPage(true);
    }, []);

    return (
        <div
            className={`font-Poppins px-2 flex flex-col mt-[8%] items-center justify-center bg-ffe57e transition-opacity duration-1000 ${showPage ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="text-6xl text-green-500">
                        <FaCheckCircle />
                    </div>
                </div>
                <div className="mt-8 text-center text-twContent">
                    <p className="text-lg">Thank you for your application. We have received your documents and will contact you soon.</p>
                </div>
                <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4">
                    <Link href="/">
                        <a className="border-2 !border-twSecondary-shade700 text-twSecondary-shade700 hover:text-twSecondary-shade700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Go to Home
                        </a>
                    </Link>
                    <Link href="/home/my-vehicle">
                        <a className="bg-[#fdd835] text-center text-twContent hover:text-twContent font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Update Documents
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
}

SuccessPage.layout = HomeLayout
export default SuccessPage