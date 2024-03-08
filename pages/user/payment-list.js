import React from "react";
import { useSite } from "../../contexts/site";
import { useFetch } from "../../helpers/hooks";
import moment from "moment";
import Link from "next/link";
import Card from "../../components/common/card";
import UserLayout from "../../layouts/user";
import { UserPaymentList } from "../../helpers/backend_helper";
import Table from "../../components/common/table";
import { useI18n } from "../../contexts/i18n";

const ShowUserPaymentList = () => {
  const { currency_code } = useSite();
  const i18n = useI18n();
  const [payments, getPayments] = useFetch(UserPaymentList);

  // table columns
  const columns = [
    {
      dataField: "trip",
      text: "Trip Id",
      formatter: (_, data) => (
        <Link href={`/user/trip-history/details/?_id=${data?.trip?._id}`}>
          <a className="underline text-blue-600">{data?.trip?._id}</a>
        </Link>
      ),
    },
    {
      dataField: "tran_id",
      text: "Transaction Id",
      formatter: (_, data) => (
        <div className="">
          <span className="">{data?.tran_id}</span>
        </div>
      ),
    },
    {
      dataField: "name",
      text: "Driver Name",
      formatter: (_, data) => (
        <div className="">
          <span className="">{data?.driver?.name}</span>
        </div>
      ),
    },
    {
      dataField: "email",
      text: "Driver Email",
      formatter: (_, data) => (
        <div className="">
          <span className="">{data?.driver?.email}</span>
        </div>
      ),
    },
    {
      dataField: "date",
      text: "Date",
      formatter: (_, data) => (
        <div className="">
          <span className="">
            {moment(data?.tran_date).format("MMM DD, YYYY")}
          </span>
        </div>
      ),
    },
    {
      dataField: "date",
      text: "Time",
      formatter: (_, data) => (
        <div className="">
          <span className="">{moment(data?.tran_date).format("hh:mm A")}</span>
        </div>
      ),
    },
    {
      dataField: "distance",
      text: "Distance",
      formatter: (_, data) => (
        <div className="">
          <span className="">{(data?.trip?.distance || 0)?.toFixed(2)} km</span>
        </div>
      ),
    },
    {
      dataField: "total",
      text: "Total Fare",
      formatter: (_, data) => (
        <div className="">
          <span className="">{`${
            currency_code ? currency_code : ""
          } ${(data?.trip?.total || 0)?.toFixed(2)}`}</span>
        </div>
      ),
    },
    {
      dataField: "amount",
      text: "Paid",
      formatter: (_, data) => (
        <div className="">
          <span className="text-blue-500">{`${
            currency_code ? currency_code : ""
          } ${data?.amount || 0}`}</span>
        </div>
      ),
    },
    {
      dataField: "payment_method",
      text: "payment_method",
      formatter: (_, data) => (
        <div className="">
          <span className="capitalize">{`${data?.payment_method}`}</span>
        </div>
      ),
    },
    {
      dataField: "status",
      text: "Payment Status",
      formatter: (status, data) => (
        <span className={`capitalize text-green-500`}>
          {data?.status === "paid" ? "success" : data?.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">
          {!!i18n && i18n?.t("Payment List")}
        </h1>
      </Card>
      <Card>
        <Table
          columns={columns}
          data={payments}
          pagination={true}
          noActions={true}
          indexed={true}
          shadow={false}
          onReload={getPayments}
          textCenter={true}
        />
      </Card>
    </div>
  );
};

ShowUserPaymentList.layout = UserLayout;
export default ShowUserPaymentList;
