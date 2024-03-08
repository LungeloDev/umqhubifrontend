import Link from "next/link";
import React from "react";
import Button from "../components/common/button";

const ErrorPage = () => {
  const error = {
    number: "404",
    header: "That Page Doesn't Exist!",
    description: "Sorry, the page you were looking for could not be found.",
  };

  return (
    <div className="flex flex-col justify-center items-center border-2 h-screen text-center p-[4px]">
      <h1 className="md:text-[100px] text-[75px] font-Roboto text-twContent">
        {error?.number}
      </h1>
      <h2 className="md:text-[50px] text-[40px] font-serif mb-[8px] text-twContent-header">
        {error?.header}
      </h2>
      <p className="text-base text-twContent-light">{error?.description}</p>
      <Link href="/">
        <Button className="font-Poppins !bg-twPrimary !py-[16px] !text-twContent font-medium text-[16px] mt-[20px]">
          Go To Home
        </Button>
      </Link>
    </div>
  );
};

export default ErrorPage;
