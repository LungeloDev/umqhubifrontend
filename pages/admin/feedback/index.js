import Head from "next/head";
import { useState } from "react";
import Card from "../../../components/common/card";
import Table, { TableImage } from "../../../components/common/table";
import {
  delUserFeedback,
  fetchUserFeedback,
  updateUserFeedback,
} from "../../../helpers/backend_helper";
import { useAction, useFetch } from "../../../helpers/hooks";
import AdminLayout from "../../../layouts/admin";
import { Modal, Rate, Switch } from "antd";
import { useI18n } from "../../../contexts/i18n";

const UserFeedback = () => {
  const i18n = useI18n();
  const [feedback, getFeedback, { loading, error }] = useFetch(fetchUserFeedback);

  // modal
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <section className="font-Poppins !text-twContent px-2">
        <Head>
          <title>User Feedback</title>
        </Head>

        <Card className={"shadow-sm"}>
          <h1 className={"text-gray-600 text-[16px] font-semibold tracking-wider"}>
            {!!i18n && i18n?.t("User Feedback")}
          </h1>
        </Card>

        {/* table data show */}
        <Table
          indexed
          pagination
          data={feedback}
          onReload={getFeedback}
          loading={loading}
          columns={[
            {
              dataField: "image",
              text: "image",
              formatter: (_, d) => <TableImage url={d?.user?.image} />,
            },
            {
              dataField: "name",
              text: "Name",
              formatter: (_, d) => d?.user?.name,
            },
            {
              dataField: "email",
              text: "Email",
              formatter: (_, d) => d?.user?.email,
            },
            {
              dataField: "phone",
              text: "Phone",
              formatter: (_, d) => d?.user?.phone,
            },
            {
              dataField: "rating",
              text: "Rating",
              formatter: (_, d) => (
                <Rate
                  className="text-twSecondary-shade800"
                  allowHalf
                  value={d?.rating}
                  disabled
                />
              ),
            },
            {
              dataField: "comment",
              text: "Comment",
              formatter: (_, d) => (
                <div>
                  {d?.comment?.slice(0, 20)}{" "}
                  {d?.comment?.length > 20 && (
                    <button
                      type="button"
                      onClick={showModal}
                      className="text-twSecondary-shade700"
                    >
                      ....see more
                    </button>
                  )}

                  {/* modal open */}
                  <Modal
                    title="Comment"
                    visible={open}
                    onCancel={handleCancel}
                    footer={null}
                  >
                    <p className="text-twContent-light text-base">
                      {d?.comment}
                    </p>
                  </Modal>
                </div>
              ),
            },
            {
              dataField: "approved",
              text: "Status",
              formatter: (approved, data) => (
                <div>
                  <Switch
                    onChange={(e) =>
                      useAction(
                        updateUserFeedback,
                        { _id: data?._id, approved: e },
                        () => getFeedback()
                      )
                    }
                    checkedChildren={"approved"}
                    unCheckedChildren={"blocked"}
                    checked={approved}
                  />
                </div>
              ),
            },
          ]}
          onDelete={delUserFeedback}
          shadow={false}
        />
      </section>
    </div>
  );
};

UserFeedback.layout = AdminLayout;
export default UserFeedback;
