import Head from "next/head";
import Card from "../../../../components/common/card";
import Table, {TableImage} from "../../../../components/common/table";
import {BsBank2} from "react-icons/bs";
import {
  delWithdrawRequest,
  fetchWithdrawRequest,
  postWithdrawReqAdmin,
} from "../../../../helpers/backend_helper";
import {useActionConfirm, useFetch} from "../../../../helpers/hooks";
import AdminLayout from "../../../../layouts/admin";
import moment from "moment";
import {Drawer, Select, Switch} from "antd";
import {useState} from "react";
import {useSite} from "../../../../contexts/site";
import {useI18n} from "../../../../contexts/i18n";

const WithdrawRequest = () => {
  const i18n = useI18n();
  const {currency_code} = useSite()
  const [method, setMethod] = useState({})
  const [withdraw, getWithdraw, {loading, error}] = useFetch(fetchWithdrawRequest);

  // drawer
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  // filter 
  const action = (
    <div className="space-x-2">
      {/* filter by approve status  */}
      <Select
        allowClear
        placeholder={"Filter by approve status"}
        onChange={(e) => {
          e === 'approved' ? getWithdraw({approved: true}) : e === "disapproved" ? getWithdraw({approved: false}) : getWithdraw({approved: e})
        }}
        className={`capitalize`
        }
        style={{
          width: 210,
        }}
        options={[
          {
            value: 'approved',
            label: 'Approved',
          },
          {
            value: 'disapproved',
            label: 'Disapproved',
          },
        ]}
      />
      {/* filter by payment status  */}
      <Select
        allowClear
        placeholder={"Filter by payment status"}
        onChange={(e) => getWithdraw({status: e})}
        className={`capitalize`
        }
        style={{
          width: 210,
        }}
        options={[

          {
            value: 'completed',
            label: 'Completed',
          },
          {
            value: 'pending',
            label: 'Pending',
          },
          {
            value: 'cancelled',
            label: 'Cancelled',
          },
          {
            value: 'processing',
            label: 'Processing',
          },
        ]}
      />
    </div>
  )

  return (
    <>
      <section className="font-Poppins !text-twContent px-2">
        <Head>
          <title>Withdraw Request</title>
        </Head>

        <Card className={"shadow-sm"}>
          <h1 className={"text-gray-600 text-[16px] font-semibold tracking-wider"}>
            {!!i18n && i18n?.t("Withdraw Request")}
          </h1>
        </Card>

        <Card className='bg-white rounded-md p-2 shadow-sm'>
          <div className='card_container'>
            {/* table data show */}
            <Table
              indexed
              pagination
              data={withdraw}
              onReload={getWithdraw}
              loading={loading}
              action={action}
              columns={[
                {
                  dataField: "image",
                  text: "image",
                  formatter: (_, d) => <TableImage url={d?.by?.image} />,
                },
                {
                  dataField: "name",
                  text: "name",
                  formatter: (_, d) => d?.by?.name,
                },
                {
                  dataField: "phone",
                  text: "phone",
                  formatter: (_, d) => d?.by?.phone,
                },
                {
                  dataField: "email",
                  text: "email",
                  formatter: (_, d) => d?.by?.email,
                },
                {
                  dataField: "amount",
                  text: "amount",
                  formatter: (_, d) => <span>
                    {`${currency_code ? currency_code : ""} ${d?.amount}`}
                  </span>,
                },
                {
                  dataField: "trx_id",
                  text: "transaction id",
                  formatter: (_, d) => d?.trx_id,
                },
                {
                  dataField: "payment_accept",
                  text: "slected method",
                  formatter: (_, d) => (
                    <div onClick={() => {
                      setMethod({methodName: d?.payment_accept?.method_name, accountDetails: d?.payment_accept?.account_details})
                      showDrawer()
                    }}>
                      {d?.payment_accept && (
                        <a
                          type="button"
                          onClick={showDrawer}
                          className="hover:text-twSecondary-shade800"
                        >
                          <BsBank2 size={24} />
                        </a>
                      )}
                    </div>
                  ),
                },
                {
                  dataField: "createdAt",
                  text: "date",
                  formatter: (_, d) => (
                    <span className="">
                      {moment(d?.createdAt).format("MMM DD, YYYY")}
                    </span>
                  ),
                },
                {
                  dataField: "approved",
                  text: "Approved",
                  formatter: (_, d) => (
                    <Switch
                      onChange={(e) => useActionConfirm(postWithdrawReqAdmin, {_id: d?._id, approved: e}, () => getWithdraw())}
                      checkedChildren={'Approve'} unCheckedChildren={'Disapprove'} checked={d?.approved} />
                  ),
                },
                {
                  dataField: "status",
                  text: "status",
                  formatter: (_, d) => (
                    <Select
                      onChange={(e) => useActionConfirm(postWithdrawReqAdmin, {_id: d?._id, status: e}, () => getWithdraw())}
                      className={`capitalize ${d?.status?.toLowerCase() === 'completed' && 'text-green-500'} 
                    ${d?.status?.toLowerCase() === 'pending' && 'text-yellow-500'}
                    ${d?.status?.toLowerCase() === 'accepted' && 'text-blue-500'}
                    ${d?.status?.toLowerCase() === 'processing' && 'text-blue-500'}
                    ${d?.status?.toLowerCase() === 'declined' && 'text-red-500'}
                    ${d?.status?.toLowerCase() === 'cancelled' && 'text-red-500'}`
                      }
                      defaultValue={d?.status}
                      style={{
                        width: 120,
                      }}
                      options={[
                        {
                          value: 'completed',
                          label: 'Completed',
                        },
                        {
                          value: 'pending',
                          label: 'Pending',
                        },
                        {
                          value: 'cancelled',
                          label: 'Cancelled',
                        },
                        {
                          value: 'processing',
                          label: 'Processing',
                        },
                      ]}
                    />
                  ),
                },
              ]}
              onDelete={delWithdrawRequest}
              shadow={false}
            />
          </div>
        </Card>
      </section>

      {/* drawer open */}
      <Drawer
        title="Selected Method"
        placement="right"
        onClose={onClose}
        visible={open}
      >
        <div className="text-center">
          <p className="text-lg font-medium underline text-blue-700">Payment Method</p>
          <p className="text-lg font-medium text-twSecondary-shade800">
            {method.methodName}
          </p>
        </div>
        <div className="border-2 border-twSecondary-shade800 border-opacity-40 mt-10 p-[10px] text-center shadow-sm min-h-[100px]">
          <p className="text-lg font-medium underline text-blue-700">Account Details</p>
          <p className="text-lg text-twContent">
            {method.accountDetails}
          </p>
        </div>
      </Drawer>
    </>
  );
};

WithdrawRequest.layout = AdminLayout;
export default WithdrawRequest;
