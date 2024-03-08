import Head from "next/head";
import Card from "../../../../components/common/card";
import Table, {TableImage} from "../../../../components/common/table";
import {
  delDriversPayment,
  fetchDriversPayment,
} from "../../../../helpers/backend_helper";
import {useFetch} from "../../../../helpers/hooks";
import AdminLayout from "../../../../layouts/admin";
import moment from "moment";
import {FaEye} from "react-icons/fa";
import {useRouter} from "next/router";
import {useSite} from "../../../../contexts/site";
import {useI18n} from "../../../../contexts/i18n";

const DriverEarning = () => {
  const i18n = useI18n();
  const {currency_code} = useSite()
  const router = useRouter();
  const [payment, getPayment, {loading, error}] = useFetch(fetchDriversPayment);

  let actions = (data) => (
    <div className="flex">
      <button
        className="btn btn-outline-primary btn-sm focus:shadow-none me-2"
        title="View details"
        onClick={() =>
          router.push(
            `/admin/trip-management/trips/details?_id=${data?.trip?._id}`
          )
        }
      >
        <FaEye className="cursor-pointer" />
      </button>
    </div>
  );

  return (
    <div>
      <section className="font-Poppins !text-twContent px-2">

        <Head>
          <title>Driver Earning</title>
        </Head>

        <Card className={"shadow-sm"}>
          <h1 className={"text-gray-600 text-[16px] font-semibold tracking-wider"}>
            {!!i18n && i18n?.t("Driver Earning")}
          </h1>
        </Card>

        {/* table data show */}
        <Table
          indexed
          pagination
          data={payment}
          onReload={getPayment}
          loading={loading}
          columns={[
            {
              dataField: "image",
              text: "image",
              formatter: (_, d) => <TableImage url={d?.driver?.image} />,
            },
            {
              dataField: "name",
              text: "name",
              formatter: (_, d) => d?.driver?.name,
            },
            {
              dataField: "phone",
              text: "phone",
              formatter: (_, d) => d?.driver?.phone,
            },
            {
              dataField: "email",
              text: "email",
              formatter: (_, d) => d?.driver?.email,
            },
            {
              dataField: "amount",
              text: "earning amount",
              formatter: (_, d) => <span>
                {`${currency_code ? currency_code : ""} ${d?.earning_amount}`}
              </span>,
            },
            {
              dataField: "tran_date",
              text: "date",
              formatter: (_, d) => (
                <span className="">
                  {moment(d?.createdAt).format("MMM DD, YYYY")}
                </span>
              ),
            },
          ]}
          onDelete={delDriversPayment}
          actions={actions}
          shadow={false}
        />
      </section>
    </div>
  );
};

DriverEarning.layout = AdminLayout;
export default DriverEarning;
