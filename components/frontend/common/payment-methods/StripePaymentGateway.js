import React, { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import StripeCheckout from "react-stripe-checkout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchSettings,
  fetchSiteSettings,
  postTipsStripePayment,
  stripeDeposit,
  stripePayment,
} from "../../../../helpers/backend_helper";
import { useRouter } from "next/router";
import { Loader } from "../../../common/preloader";
import { isAndroid, isIOS } from "react-device-detect";
import { useFetch } from "../../../../helpers/hooks";

const StripePaymentGateway = ({
  userEmail,
  amount,
  countryCurrency = "",
  transactionType,
  review,
}) => {
  const router = useRouter();
  const [organizationName, setOrganizationName] = useState("");
  const [organizationLogo, setOrganizationLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [settings] = useFetch(fetchSettings);

  const tripId = router?.query?.tripId;
  const userToken = router?.query?.token;

  useEffect(() => {
    if (paymentComplete) {
      localStorage.clear();
      if (isAndroid) {
        const url =
          "intent://cartogo.com/#Intent;scheme=car2gouser;package=bd.com.appstick.car2gouser;end";
        window.location.replace(url);
      } else if (isIOS) {
        window.location.replace("car2gouser://");
        setTimeout(() => {
          window.location.replace(
            "https://apps.apple.com/us/app/instagram/id389801252"
          );
        }, 3000);
      } else {
        router.replace("/");
      }
    }
  }, [paymentComplete]);

  const handleStripePayment = async (token) => {
    let paymentData;
    transactionType === "payment"
      ? (paymentData = {
          token,
          tripInfo: {
            amount: amount,
            description: "Payment",
            countryCurrency,
            _id: tripId,
          },
        })
      : transactionType === "tipPayment"
      ? (paymentData = {
          tips_amount: amount,
          token,
          countryCurrency,
          review,
        })
      : (paymentData = {
          token,
          deposit: {
            countryCurrency,
            amount: amount,
            description: `Wallet Deposit`,
          },
        });

    // if payment : redirect to index -> redirect to app/ios/site (according to device)
    // if deposit : redirect to wallet index page
    // if tips    : redirect to app/ios/site (according to device)
    transactionType === "payment"
      ? paymentData?.tripInfo?.amount &&
        stripePayment(paymentData).then((data) => {
          if (data?.error === false) {
            setLoading(true);
            toast.success(data?.msg);
            setTimeout(() => {
              router.replace(`/payment/?tripId=${tripId}&token=${userToken}`);
            }, 3000);
          } else {
            toast.error(data?.msg);
          }
        })
      : transactionType === "tipPayment"
      ? paymentData?.tips_amount &&
        postTipsStripePayment(paymentData).then((data) => {
          if (data?.error === false) {
            setLoading(true);
            toast.success(data?.msg);
            setTimeout(() => {
              setPaymentComplete(true);
            }, 3000);
          } else {
            toast.error(data?.msg);
          }
        })
      : paymentData?.deposit?.amount &&
        stripeDeposit(paymentData).then((data) => {
          if (data?.error === false) {
            setLoading(true);
            toast.success(data?.msg);
            setTimeout(() => {
              router.replace("/user/wallet/summary");
            }, 2700);
          } else {
            toast.error(data?.msg);
          }
        });
  };

  // load organization name / site setting
  useEffect(() => {
    fetchSiteSettings().then((res) => {
      if (res?.status !== false) {
        setOrganizationName(res?.data?.site_name);
        setOrganizationLogo(res?.data?.logo);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mt-20 mr-5">
        {amount <= 0 || isNaN(amount) ? (
          <div className="bg-gray-400 !cursor-not-allowed rounded-[3px] py-2 px-3 text-white hover:shadow-lg transition duration-300 hover:-translate-y-1 w-fit mx-auto">
            <div className="flex items-center justify-center gap-3">
              <span className="text-[18px] font-semibold">
                {" "}
                <BsArrowRight />{" "}
              </span>
              <span className="custom_front"> Pay With Stripe </span>
            </div>
          </div>
        ) : (
          <StripeCheckout
            name={organizationName}
            image={organizationLogo}
            shippingAddress
            billingAddress
            description={`Your Total is ${amount} ${countryCurrency}`}
            amount={Math.round(amount?.amount * 100)}
            currency={countryCurrency && countryCurrency}
            stripeKey={settings?.stripe?.credentials?.stripe_publishable_key}
            token={handleStripePayment}
            email={userEmail}
          >
            <button className="rounded-[3px] bg-[#7269E0] py-2 px-3 text-white hover:shadow-lg transition duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center gap-3">
                <span className="text-[18px] font-semibold">
                  {" "}
                  <BsArrowRight />{" "}
                </span>
                <span className="custom_front"> Pay With Stripe </span>
              </div>
            </button>
          </StripeCheckout>
        )}
      </div>

      {/* toast message */}
      <ToastContainer
        position="bottom-center"
        autoClose={2700}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default StripePaymentGateway;
