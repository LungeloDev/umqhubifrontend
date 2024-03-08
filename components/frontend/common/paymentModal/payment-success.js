import { Modal } from 'antd';
import React, { useState } from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import Button from '../../../common/button';

const PaymentSuccess = ({ setOpenPaymentSuccessModal, openPaymentSuccessModal }) => {

  return (
    <>
      <Modal
        width={750}
        style={{
          top: 100,
        }}
        maskClosable={false}
        visible={openPaymentSuccessModal}
        footer={null}
        onCancel={() => setOpenPaymentSuccessModal(false)}
      >
        <div className="text-center">
          <BiCheckCircle
            size={100}
            className={"text-green-600 mx-auto mt-[40px]"}
          />
          <h1 className='text-3xl font-medium mt-[30px]'>Payment Successful!!</h1>
          <p className='text-twContent-light text-lg mt-[20px]'>Deposited the money successfully<br />Check your email for your receipt </p>
          <Button onClick={() => setOpenPaymentSuccessModal(false)} className="font-Poppins !bg-twPrimary !py-[16px] !text-twContent font-medium text-[18px] mb-[100px] mt-[20px]">
            OK
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PaymentSuccess;
