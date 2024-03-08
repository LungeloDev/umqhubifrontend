import {Form, Modal} from 'antd';
import Head from 'next/head';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import Button from '../../../../components/common/button';
import Table, {TableImage} from '../../../../components/common/table';
import FormInput, {HiddenFormItem} from '../../../../components/form/input';
import {useSite} from '../../../../contexts/site';
import {
    delServiceCategory,
    fetchServiceCategories,
    postServiceCategory,
} from '../../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";
import {
    getAwsUploadImagesUrl,
} from "../../../../components/common/fileUploadAWS";
import {DotLoader} from "react-spinners";
import {HiOutlinePlus} from "react-icons/hi";
import ImageCropInput from "../../../../components/form/ImageCrop";
import { useI18n } from '../../../../contexts/i18n';

const ServiceCategory = () => {
    const site = useSite();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const {push} = useRouter();
    const [categories, getCategories, {loading, error}] = useFetch(fetchServiceCategories);
    const [loadingSpinner, setLoadSpinner] = useState(false);

    let columns = [
        {
            dataField: 'image', text: 'image',
            formatter: d => <TableImage url={d}/>
        },
        {
            dataField: 'name', text: 'Name',
            formatter: name => <span className='capitalize'>{name}</span>
        },
    ];

    // modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    let action = (
        <div className="flex">
            <Button
                className="mr-2"
                onClick={() => {
                    form.resetFields();
                    setIsModalVisible(true);
                    setIsEdit(false)
                }}>{!!i18n && i18n?.t("Add Category")}</Button>
        </div>)

    let actions = (data) => (
        <div className="flex">
            <button className="btn btn-outline-success btn-sm focus:shadow-none me-2"
                    title="Add brief information"
                    onClick={() => push(`/admin/services/category/brief-information?_id=${data?._id}`)}>
                <HiOutlinePlus className='cursor-pointer'/>
            </button>
        </div>)


    return (
        <section>
            <Head>
                <title>Service Categories</title>
            </Head>
            <div className='card_container'>
                <Table
                    columns={columns}
                    data={categories}
                    pagination={true}
                    actions={actions}
                    noActions={false}
                    action={action}
                    indexed={true}
                    shadow={false}
                    onEdit={(data) => {
                        form.resetFields();
                        form.setFieldsValue({
                            ...data,
                            image: [data?.image]?.map((d, index) => ({
                                uid: '-' + (index + 1),
                                name: `image${index}.png`,
                                status: 'done',
                                url: d
                            })),
                        });
                        setIsModalVisible(true);
                        setIsEdit(true)
                    }}
                    onDelete={delServiceCategory}
                    onReload={getCategories}
                    error={error}
                    title='Service Categories'
                />
            </div>

            {/* status updated modal */}
            <Modal title={isEdit ? "Update Category" : `Category Details`} visible={isModalVisible}
                   onCancel={() => setIsModalVisible(false)}
                   destroyOnClose footer={null}>
                <Form
                    form={form}
                    onFinish={async (values) => {
                        setLoadSpinner(true)
                        if (!!values.image) {
                            const url = await getAwsUploadImagesUrl(values.image);
                            values.image = url[0]
                        }
                        if (values?.image?.length === 0) values.image = undefined;
                        setLoadSpinner(false)
                        return useAction(postServiceCategory, values, () => {
                            getCategories()
                            setIsModalVisible(false);
                        })
                    }}
                    layout='vertical'
                >
                    <HiddenFormItem name="_id"/>
                    <FormInput name='name' placeholder='Enter service category name' label='Category Name' required/>

                    <ImageCropInput name={'image'} form={form} aspect={3 / 2} label={"Image"}/>

                    <FormInput name="description" label="Description" textArea/>
                    <div className={'flex items-center gap-5'}>
                        <Button>{isEdit ? "Update" : "Add Category"}</Button>
                        {
                            loadingSpinner === true &&
                            <div>
                                <DotLoader color="purple" size={20} className='ml-5'/>
                                <p className='text-purple-700 font-semibold text-[14px]'>Please Wait...</p>
                            </div>
                        }
                    </div>
                </Form>
            </Modal>
        </section>
    );
};
ServiceCategory.layout = AdminLayout;
export default ServiceCategory;