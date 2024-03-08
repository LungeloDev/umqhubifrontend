import { Modal } from 'antd';
import React, { useState } from 'react';
import SignUpModalContent from './signUpModalContent';

const SignUpModal = ({ setModalOpen, modalOpen }) => {
    const [activeModalTab, setActiveModalTab] = useState('driver');

    // modal data 
    const signUpWithDriverModalData = {
        heading: "Get in the driver’s seat and get paid",
        subHeading: "Drive on the platform with the largest network of active drivers.",
        buttonUrl: "/driver-signup",
        buttonText: "Signup as a Driver",
        setModalOpen: setModalOpen
    }
    const signUpWithUserModalData = {
        heading: "Ride and payment",
        subHeading: "Rider on the platform with the largest network of active drivers.",
        buttonUrl: "/user-signup",
        buttonText: "Signup as a User",
        setModalOpen: setModalOpen
    }

    return (
        <div>
            <Modal
                width={1000}
                style={{
                    top: 100,
                }}
                maskClosable={false}
                visible={modalOpen}
                footer={null}
                onOk={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
            >
                <div className="text-center font-Poppins">
                    {/* tabs  */}
                    {/* tab navigation */}
                    <div className='mx-auto w-1/2 flex justify-around font-bold cursor-pointer' >
                        <div onClick={() => setActiveModalTab('driver')} className={`pb-[10px] md:pb-[27px] w-1/2 ${activeModalTab === 'driver' ? 'border-b-4 border-twSecondary' : ''}`}>Driver</div>
                        <div onClick={() => setActiveModalTab('user')} className={`pb-[10px] md:pb-[27px] w-1/2 ${activeModalTab === 'user' ? 'border-b-4 border-twSecondary' : ''}`}>User</div>
                    </div>
                    {/* tab content  */}
                    {
                        activeModalTab === 'driver'
                            ?
                            <SignUpModalContent {...signUpWithDriverModalData} />
                            :
                            <SignUpModalContent {...signUpWithUserModalData} />
                    }

                </div>
            </Modal>
        </div>
    );
};

export default SignUpModal;