import Table, { TableImage } from "../../../../components/common/table";
import React, { useState } from "react";
import {Form, Modal} from "antd";
import Button from "../../../../components/common/button";
import FormInput, { HiddenFormItem } from "../../../../components/form/input";
import { useAction, useFetch } from "../../../../helpers/hooks";
import {
    delServicePackage,
    fetchServicePackages,
    postServicePackage
} from "../../../../helpers/backend_helper";
import AdminLayout from "../../../../layouts/admin";
import { DotLoader } from "react-spinners";
import {getAwsUploadImagesUrl} from "../../../../components/common/fileUploadAWS";
import Card from "../../../../components/common/card";
import Head from "next/head";
import ImageCropInput from "../../../../components/form/ImageCrop";
import { useI18n } from "../../../../contexts/i18n";


const ServiceSubCategory = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [packages, getPackages, { loading }] = useFetch(fetchServicePackages);
    const [loadingSpinner, setLoadSpinner] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const handleSubmit = async (values) => {
        setLoadSpinner(true)
        if (!!values.image) {
            const url = await getAwsUploadImagesUrl(values.image);
            values.image = url[0]
        }
        setLoadSpinner(false)
        return useAction(postServicePackage, values, () => {
            setOpen(false)
            getPackages()
        })
    };


    return (
        <>
            <Head>
                <title>Services Packages</title>
            </Head>

            <Card className={'shadow-sm'}>
                <h1 className={'text-gray-600 text-[16px] font-semibold tracking-wider'}>{!!i18n && i18n?.t("Service Packages")}</h1>
            </Card>
            <Table
                indexed
                pagination
                data={packages}
                onReload={getPackages}
                loading={loading}
                columns={[
                    {
                        dataField: 'image', text: 'image',
                        formatter: d => <TableImage url={d} />
                    },
                    {
                        dataField: "name",
                        text: "Package Name",
                        formatter: (d, cat) => <span>{d}</span>
                    },
                ]}
                onEdit={data => {
                    setIsEdit(true)
                    form.resetFields();
                    form.setFieldsValue({
                        ...data,
                        parent: data?.parent?._id,
                        image: [data?.image]?.map((d, index) => ({
                            uid: '-' + (index + 1),
                            name: `image${index}.png`,
                            status: 'done',
                            url: d
                        })),
                    });
                    setOpen(true);
                }}
                onDelete={delServicePackage}
                action={<Button onClick={() => {
                    setIsEdit(false)
                    form.resetFields();
                    setOpen(true)
                }}>{!!i18n && i18n?.t("Add Package")}</Button>
                }
                shadow={false}
            />
            <Modal visible={open} onCancel={() => setOpen(false)} footer={null} title="Package Details">
                <Form form={form} layout="vertical" className="mt-4" onFinish={handleSubmit}>
                    <HiddenFormItem name="_id" />
                    <FormInput name="name" label="Package Name" required placeholder={'Package name'} />
                    <FormInput name="description" label="Description" textArea placeholder={'Package description'} />
                    <ImageCropInput name={'image'} form={form} aspect={3 / 2} label={"Image"}/>
                    <div className={'flex items-center gap-5 pt-3'}>
                        <Button>{isEdit ? "Update" : "Add Package"}</Button>
                        {
                            loadingSpinner === true &&
                            <div>
                                <DotLoader color="purple" size={20} className='ml-5' />
                                <p className='text-purple-700 font-semibold text-[14px]'>Please Wait...</p>
                            </div>
                        }
                    </div>
                </Form>
            </Modal>
        </>
    );
};
ServiceSubCategory.layout = AdminLayout;
export default ServiceSubCategory;