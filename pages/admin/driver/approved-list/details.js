import React, { useEffect } from "react";
import { Tabs } from "antd";
import { useFetch } from "../../../../helpers/hooks";
import AdminLayout from "../../../../layouts/admin";
import { fetchDriverDetails } from "../../../../helpers/backend_helper";
import { useRouter } from "next/router";
import VehicleCard from "./vehicleCard";
import { useI18n } from "../../../../contexts/i18n";

const RiderDetails = () => {
  const i18n = useI18n();
  const { query } = useRouter();
  const [driverDetails, getDriverDetails] = useFetch(fetchDriverDetails);

  useEffect(() => {
    getDriverDetails({ _id: query?._id });
  }, [query?._id]);


  return (
    <div className="my-10 driver-details">
      <section className="bg-white min-h-screen rounded-md p-[10px] ">
        <Tabs defaultActiveKey="1">
          {/* driver information  */}
          <Tabs.TabPane tab={!!i18n && i18n?.t("Personal Information")} key="1">
            <div className="w-full h-auto text-twContent text-base p-6 mt-20 max-w-[700px] mx-auto border-2 border-twPrimary shadow-sm">
              <div className="grid grid-cols-3 border-b py-[8px] px-2">
                <p>Verified Status</p>
                {driverDetails?.verified ? (
                  <p className="bg-green-600 w-fit px-[8px] py-[2px] my-auto rounded-xl text-white">
                    verified
                  </p>
                ) : (
                  <p className="bg-red-600 w-fit px-[8px] py-[2px] my-auto rounded-xl text-white">
                    unverified
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 border-b py-[8px] px-2">
                <p>Name</p>
                <p className="col-span-2 ">
                  {driverDetails?.name}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b py-[8px] px-2">
                <p>Email</p>
                <p className="col-span-2 ">{driverDetails?.email}</p>
              </div>
              <div className="grid grid-cols-3 py-[8px] px-2">
                <p>Phone</p>
                <p className="col-span-2 ">{driverDetails?.phone}</p>
              </div>
            </div>
          </Tabs.TabPane>

          {/* Vehicles information   */}
          <Tabs.TabPane tab={!!i18n && i18n?.t("Vehicles")} key="2">
              <VehicleCard data={driverDetails?.vehicle} />
          </Tabs.TabPane>

        </Tabs>
      </section >
    </div >
  );
};
RiderDetails.layout = AdminLayout;
export default RiderDetails;
