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
import ImageInput from '../../../../components/form/image';
import {TbListDetails} from 'react-icons/tb';
import AdminLayout from "../../../../layouts/admin";
import {awsFileUpload} from "../../../../components/common/fileUploadAWS";
import {DotLoader} from "react-spinners";

const ServiceCategory = () => {
    const site = useSite();
    const [form] = Form.useForm();
    const {push} = useRouter();
    const [categories, getCategories, {loading, error}] = useFetch(fetchServiceCategories);
    const [loadingSpinner, setLoadSpinner] = useState(false);
    const [file, setFile] = useState();

    let columns = [
        {
            dataField: 'image', text: 'image',
            formatter: d => <TableImage url={d}/>
        },
        {
            dataField: 'name', text: 'Name',
            formatter: name => <span className='capitalize'>{name}</span>
        },
        {
            dataField: 'subcategories', text: 'Subcategories',
            formatter: subcategories => <span className=''>{subcategories ?? 0}</span>
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
                }}>Add Category</Button>
        </div>)

    let actions = (data) => (
        <div className="flex">
            <button className="btn btn-outline-success btn-sm focus:shadow-none me-2"
                    title="Subcategories and Courses"
                    onClick={() => push(`/admin/services/packages?_id=${data?._id}`)}>
                <TbListDetails className='cursor-pointer'/>
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
                    noActions={false}
                    action={action}
                    actions={actions}
                    indexed={true}
                    shadow={false}
                    onEdit={(data) => {
                        form.resetFields();
                        form.setFieldsValue({
                            ...data,
                        });
                        setFile(data?.image)
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
            <Modal title={isEdit ? "Update Category" : `Categories Details`} visible={isModalVisible}
                   onCancel={() => setIsModalVisible(false)}
                   destroyOnClose footer={null}>
                <Form
                    form={form}
                    onFinish={async (values) => {
                        setLoadSpinner(true)
                        if (!!values.image) {
                            values.image = await awsFileUpload(values.image);
                        }
                        if(values.image.length === 0) values.image = undefined;
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
                    <Form.Item name="image" label={"Category Image"}>
                        <ImageInput value={file}/>
                    </Form.Item>
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