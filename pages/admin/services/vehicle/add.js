import React, { useEffect, useState } from "react";
import { Form, message, Select } from "antd";
import {
  fetchServiceList,
  fetchServiceWiseCategoriesPackages,
  fetchVehicleSetting,
  fetchVehicleSettings,
  postServiceVehicle,
} from "../../../../helpers/backend_helper";
import { useAction, useFetch } from "../../../../helpers/hooks";
import { useRouter } from "next/router";
import AdminLayout from "../../../../layouts/admin";
import { DotLoader } from "react-spinners";
import { Col, Row } from "react-bootstrap";
import FormSelect from "../../../../components/form/select";
import FormInput, { HiddenFormItem } from "../../../../components/form/input";
import Card from "../../../../components/common/card";
import { getAwsUploadImagesUrl } from "../../../../components/common/fileUploadAWS";
import Button from "../../../../components/common/button";
import ImageTrim from "../../../../components/admin/imageTrim";

const { Option } = Select;

const AddNewVehicle = ({ form, c_title = false, service, images }) => {
  const { push, query } = useRouter();
  const [loadingSpinner, setLoadSpinner] = useState(false);
  const [services, getServices] = useFetch(fetchServiceList);
  const [categoriesPackages, getCategoriesPackages] = useFetch(
    fetchServiceWiseCategoriesPackages,
    {},
    false
  );

  const [vehicles, getVehicles] = useFetch(fetchVehicleSettings, {}, false);
  const [vehicleModels, getVehicleModels] = useFetch(
    fetchVehicleSetting,
    {},
    false
  );
  const [serviceId, setServiceId] = useState();
  const [imageFile, setImageFile] = useState([]);

  useEffect(() => {
    if (!!service && !vehicles?.docs?.length > 0) {
      getVehicles({ service: service });
      getCategoriesPackages({ _id: service });
    }
  }, [service]);

  // form submit function
  const onFinish = async (values) => {
    setLoadSpinner(true);
    if (imageFile?.length > 0) {
      const url = await getAwsUploadImagesUrl(imageFile);
      values.image = url[0];
    } else {
      values.image = undefined;
    }
    setLoadSpinner(false);
    return useAction(postServiceVehicle, values, async () => {
      await push("/admin/services/vehicle");
    });
  };

  return (
    <div>
      <Card className={"shadow-sm"}>
        <h1
          className={"text-gray-600 text-[16px] font-semibold tracking-wider"}
        >
          {c_title ? "Update Service Vehicle" : "Add New Service Vehicle"}
        </h1>
      </Card>

      <section className="bg-white min-h-screen rounded-md p-2">
        <div className="card_container">
          {/* services information collection form */}
          <div className="vehicle_form md:w-2/3 mx-auto mt-5">
            <Form
              form={form}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              layout="vertical"
            >
              <HiddenFormItem name={"_id"} />
              <Row>
                <Col md={4}>
                  <FormSelect
                    name="service"
                    placeholder={"Select service"}
                    label={"Select Service"}
                    initialValue={[]}
                    options={services?.docs}
                    onSelect={(e) => {
                      setServiceId(e);
                      getVehicles({ service: e });
                      getCategoriesPackages({ _id: e });
                    }}
                    required
                  />
                </Col>
                <Col md={4}>
                  <FormSelect
                    name="service_category"
                    placeholder={"Select category"}
                    label={"Category"}
                    initialValue={[]}
                    options={
                      categoriesPackages?.length > 0
                        ? categoriesPackages[0]?.categories
                        : []
                    }
                    required
                  />
                </Col>
                <Col md={4}>
                  <FormSelect
                    name="service_package"
                    placeholder={"Select package"}
                    initialValue={[]}
                    label={"Service Package"}
                    options={
                      categoriesPackages?.length > 0
                        ? categoriesPackages[0]?.service_packages
                        : []
                    }
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormSelect
                    name="name"
                    placeholder={"Select Brand"}
                    label={"Brand Name"}
                    initialValue={[]}
                    options={vehicles?.docs}
                    onSelect={(e) => {
                      getVehicleModels({ _id: e });
                    }}
                    required
                  />
                </Col>
                <Col md={6}>
                  <FormSelect
                    name="vehicle_model"
                    placeholder={"Select model"}
                    label={"Vehicle Model"}
                    initialValue={[]}
                    options={
                      !!vehicleModels
                        ? vehicleModels?.models?.map((d) => ({
                            label: d?.name,
                            value: d?.name,
                          }))
                        : []
                    }
                    required
                  />
                </Col>
              </Row>
              <Form.Item
                label="Choose a Vehicle Image"
                name="image"
                rules={[
                  {
                    required: false,
                    message: "This field is required!",
                  },
                ]}
              >
                <ImageTrim setImageFile={setImageFile} images={images} />
              </Form.Item>
              <FormInput
                name="description"
                placeholder="Short description"
                label="Description"
                textArea
              />
              <div className={"flex items-center gap-5"}>
                <Button className="">Submit</Button>
                {loadingSpinner === true && (
                  <div>
                    <DotLoader color="purple" size={20} className="ml-5" />
                    <p className="text-purple-700 font-semibold text-[14px]">
                      Please Wait...
                    </p>
                  </div>
                )}
              </div>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
};
AddNewVehicle.layout = AdminLayout;
export default AddNewVehicle;
