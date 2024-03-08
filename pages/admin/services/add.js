import React, {useState} from 'react';
import {Form, message, Select} from 'antd';
import {fetchServiceCategories, fetchServicePackages, postService} from '../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../helpers/hooks';
import {useRouter} from 'next/router';
import AdminLayout from "../../../layouts/admin";
import {DotLoader} from "react-spinners";
import {Col, Row} from "react-bootstrap";
import FormSelect from "../../../components/form/select";
import FormInput, {HiddenFormItem} from "../../../components/form/input";
import Card from "../../../components/common/card";
import {getAwsUploadImagesUrl} from "../../../components/common/fileUploadAWS";
import Button from "../../../components/common/button";
import ImageTrim from "../../../components/admin/imageTrim";

const {Option} = Select;

const AddNewService = ({form, c_title = false, images}) => {
    const {push, query} = useRouter();
    const [loadingSpinner, setLoadSpinner] = useState(false);
    const [categories, getCategories, {loading, error}] = useFetch(fetchServiceCategories);
    const [packages, getPackages] = useFetch(fetchServicePackages);
    const [imageFile, setImageFile] = useState([])

    // form submit function
    const onFinish = async (values) => {
        setLoadSpinner(true)
        if (imageFile?.length > 0) {
            const url = await getAwsUploadImagesUrl(imageFile);
            values.image = url[0]
        }
        values.image = imageFile?.length === 0 ? values?.image[0]?.url : values.image
        setLoadSpinner(false)
        values.name = values.name.split(' ').join('_').toLowerCase();
        return useAction(postService, values, async () => {
            message.success('Service added successfully')
            await push('/admin/services');
        })
    };

    return (
        <div>
            <Card className={'shadow-sm'}>
                <h1 className={'text-gray-600 text-[16px] font-semibold tracking-wider'}>
                    {
                        c_title ? "Update Service" : "Add New Service"
                    }
                </h1>
            </Card>

            <section className='bg-white min-h-screen rounded-md p-2'>
                <div className='card_container'>
                    {/* services information collection form */}
                    <div className='vehicle_form md:w-2/3 mx-auto mt-5'>
                        <Form
                            form={form}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            layout='vertical'
                        >
                            <HiddenFormItem name={'_id'} />
                            <Row>
                                <Col md={6}>
                                    <FormSelect name='categories' placeholder={'Select categories'} label={'Category'}
                                        initialValue={[]}
                                        options={categories?.docs}
                                        isMulti
                                        required
                                    />
                                </Col>
                                <Col md={6}>
                                    <FormSelect name='service_packages' placeholder={'Select packages'}
                                        initialValue={[]}
                                        label={'Service Packages'}
                                        options={packages?.docs}
                                        isMulti
                                        required
                                    />
                                </Col>
                            </Row>
                            <FormInput name='name' placeholder='Service name' label='Name' required />
                            <Form.Item
                                label="Image"
                                name="image"
                                rules={[
                                    {
                                        required: false,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <ImageTrim setImageFile={setImageFile} images={images} />
                            </Form.Item>
                            <FormInput name='description'
                                placeholder='Short description about this service'
                                label='Description'
                                required
                                type="textArea" />

                            <div className={'flex items-center gap-5'}>
                                <Button className={'bg-main text-twContent transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'}>Submit</Button>
                                {
                                    loadingSpinner === true &&
                                    <div>
                                        <DotLoader color="purple" size={20} className='ml-5' />
                                        <p className='text-purple-700 font-semibold text-[14px]'>Please Wait...</p>
                                    </div>
                                }
                            </div>
                        </Form>
                    </div>
                </div>
            </section>
        </div>
    );
};
AddNewService.layout = AdminLayout
export default AddNewService;