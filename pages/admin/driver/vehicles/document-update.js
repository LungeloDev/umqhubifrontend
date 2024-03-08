import React, {useEffect, useState} from 'react';
import {Checkbox, Form, Select, Spin, message} from "antd";
import {useRouter} from "next/router";
import {awsFileUpload} from "../../../../components/common/fileUploadAWS";
import {toast, ToastContainer} from "react-toastify";
import jwt_decode from "jwt-decode";
import {keyValuePairToObject, objectToKeyValuePair} from "../../../../components/common/utilities";
import {fetchDriverDocuments, fetchFormFields, postDriverDocuments} from "../../../../helpers/backend_helper";
import FormInput from "../../../../components/form/input";
import FormTextArea from "../../../../components/utils/inputTextArea";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {checkFormType} from "../../../../components/admin/driver/dynamic-form-type";
import AdminLayout from "../../../../layouts/admin";
import ImageFromInput from "../../../../components/utils/image";
import 'react-toastify/dist/ReactToastify.css';

const {Option} = Select;

function capitalizeFirstLetter(string) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
}

const DocumentUpdate = () => {
    const [form] = Form.useForm();
    const {query} = useRouter()
    const [driverDocuments, getDriverDocuments] = useFetch(fetchDriverDocuments);
    const [formFields, getFormFields, {loading, error}] = useFetch(fetchFormFields);
    const [imgLink, setImgLink] = useState({})
    const [fileLoading, setFileLoading] = useState({isloading: false, inputName: ''});
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (query?.driver) {
            getDriverDocuments({driver: query?.driver})
        }
    }, [query?.driver])

    useEffect(() => {
        if (driverDocuments?.length > 0) {
            const details = keyValuePairToObject(driverDocuments)
            form.setFieldsValue({
                ...details
            })
            setImgLink({...details})
        }
    }, [driverDocuments?.length > 0])

    // user image handling
    const handleImage = async (e, key) => {
        const files = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (files.includes(e.target?.files[0]?.type) && (e.target?.files[0]?.size <= 3145728)) {
            const obj = {};
            setFileLoading({isloading: true, inputName: key});
            const url = await awsFileUpload(e.target.files[0]);
            if (url) {
                obj[key] = url;
                const duplicateV = images?.find(dt => dt[key]);
                if (!!duplicateV) {
                    const filterObj = images?.filter(dt => !dt[key])
                    setImages([...filterObj, obj])
                    setImgLink(pre => pre = {...pre, obj})
                } else {
                    setImages(pre => [...pre, obj])
                    setImgLink(pre => pre = {...pre, ...obj})
                }
                setFileLoading({isloading: false, inputName: ''});
            } else {
                setFileLoading({isloading: false, inputName: ''});
                toast.warning("Something went wrong!")
            }
        } else {
            setFileLoading({isloading: false, inputName: ''});
            toast.warning("The file must be an image & <= 3MB!")
        }
    };

    // update user information
    const [loadingNext, setLoadingNext] = useState(false)
    const onFinish = async (values) => {
        setLoadingNext(pre => pre = true)
        images?.forEach(imag => values[Object.keys(imag)[0]] = Object.values(imag)[0])
        const token = localStorage.getItem('authToken') ?? '';
        const decoded = token && jwt_decode(token);
        if (!!values) {
            setLoadingNext(pre => pre = false)
            const documents = await objectToKeyValuePair(values);
            return useAction(postDriverDocuments, {driver: query?.driver, documents}, () => {
                getDriverDocuments()
            })
        } else {
            setLoadingNext(false)
            message.error('Invalid Input! Try again...')
        }
    };

    return (
        <section>
            <span
                className='mb-4 ml-5 inline-block border-b border-main text-[16px] font-medium'>Vehicle Information</span>

            <div className='px-3'>
                <Form
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout={'vertical'}
                    form={form}
                >
                    <div className='md:grid md:grid-cols-2 gap-x-2 md:gap-x-10 gap-y-1'>
                        {
                            driverDocuments?.map(field =>
                                <>
                                    {
                                        checkFormType(field, formFields) === "text" &&
                                        <FormInput
                                            label={field?.key?.split('_').join(' ').toUpperCase()}
                                            placeholder={capitalizeFirstLetter(field?.placeholder?.split('_').join(' '))}
                                            name={field?.key}
                                            required={field?.field_required}
                                        />
                                    }
                                    {
                                        (checkFormType(field, formFields) === 'number') &&
                                        <FormInput
                                            label={field?.key?.split('_').join(' ').toUpperCase()}
                                            placeholder={capitalizeFirstLetter(field?.key?.placeholder?.split('_').join(' '))}
                                            name={field?.key}
                                            required={field?.value}
                                            type={'number'}
                                        />
                                    }
                                </>
                            )
                        }
                    </div>

                    <div className='md:grid md:grid-cols-2 gap-x-2 md:gap-x-10 gap-y-1'>
                        {
                            driverDocuments?.map(field =>
                                <>
                                    {
                                        (checkFormType(field, formFields) === 'image') &&
                                        <Form.Item
                                            label={field?.key?.placeholder?.split('_').join(' ')}
                                            name={field?.key}
                                        >
                                            <ImageFromInput onChange={(e) => handleImage(e, field?.key)}
                                                url={imgLink[`${field?.key}`]} />
                                        </Form.Item>
                                    }
                                </>
                            )
                        }
                    </div>

                    <div className=''>
                        {
                            driverDocuments?.map(field =>
                                <>
                                    {
                                        (checkFormType(field, formFields) === 'textarea') &&
                                        <FormTextArea
                                            label={field?.key?.split('_').join(' ').toUpperCase()}
                                            formName={field?.key}
                                            formPlaceholder={capitalizeFirstLetter(field?.key?.placeholder?.split('_').join(' '))}
                                            formMessage={field?.key?.split('_').join(' ')}
                                            formRequired={false}
                                        />
                                    }
                                </>
                            )
                        }
                    </div>

                    <div className='mt-3'>
                        {
                            driverDocuments?.map(field =>
                                <>
                                    {
                                        (checkFormType(field, formFields) === "terms_and_conditions") &&
                                        <div>
                                            <Form.Item
                                                name="terms_and_conditions"
                                                valuePropName="checked"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please accept terms and conditions',
                                                    },
                                                ]}
                                            >
                                                <Checkbox>I accept the <a href={field?.link ?? '#'} target="__blank"
                                                    className='text-purple-500'>Terms and
                                                    Conditions</a></Checkbox>
                                            </Form.Item>
                                        </div>
                                    }
                                </>
                            )
                        }
                    </div>

                    {/* submit button */}
                    <div className='flex gap-2 mb-4 mt-5'>
                        <button className='bg-main rounded-md text-twContent px-4 py-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'>Update</button>
                    </div>
                    {
                        (loadingNext || fileLoading?.isloading === true) &&
                        <div className="flex justify-center">
                            <Spin />
                        </div>
                    }
                </Form>

                {/* toast message */}
                <ToastContainer
                    position="bottom-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </section>
    );
};
DocumentUpdate.layout = AdminLayout
export default DocumentUpdate;