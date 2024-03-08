import { Modal } from 'antd';
import React, { useState } from 'react';
import { VscError } from 'react-icons/vsc';
import Button from '../../../common/button';

const PaymentFailed = ({ setOpenPaymentFailedModal, openPaymentFailedModal }) => {

  return (
    <>
      <Modal
        width={750}
        style={{
          top: 100,
        }}
        maskClosable={false}
        visible={openPaymentFailedModal}
        footer={null}
        onCancel={() => setOpenPaymentFailedModal(false)}
      >
        <div className="text-center">
          <VscError
            size={100}
            className={"text-red-600 mx-auto mt-[40px]"}
          />
          <h1 className='text-3xl font-medium mt-[30px]'>Payment Failed!!</h1>
          <p className='text-twContent-light text-lg mt-[20px]'>Failed to deposit the money<br />Please try again.</p>
          <Button onClick={() => setOpenPaymentFailedModal(false)} className="font-Poppins !bg-twPrimary !py-[16px] !text-twContent font-medium text-[18px] mb-[100px] mt-[20px]">
            Try Again
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PaymentFailed;
