import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Select, Checkbox, Spin } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";
import FormInput from '../../../utils/inputText';
import FormSwitch from '../../../utils/switch';
import FormNumber from '../../../utils/inputNumber';
import FormDateInput from '../../../utils/inputDate';
import FormTimeInput from '../../../utils/inputTime';
import FormInputSelect from '../../../utils/inputSelect';
import FormInputRadioButton from '../../../utils/inputRadioButton';
import InputFileUpload from '../../../utils/inputFile';
import InputImageUpload from '../../../utils/inputImageUpload';
import FormTextArea from '../../../utils/inputTextArea';
import DigitalSignature from '../../../utils/digitalSignature';
import InputCheckbox from '../../../utils/inputCheckbox';
import { awsFileUpload } from '../../../common/fileUploadAWS';
import {postDriverVehicle} from '../../../../helpers/backend_helper';
const { Option } = Select;

function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
}

// user form fill up -> step 2
const RiderFormFields2 = ({ provinceData, getVehicleId, checkFieldStatus, formFieldsData = [], setPageToggle, registeredFormId = null, responseData }) => {
    const [form] = Form.useForm();
    const digitalSignatureRef = useRef();
    const [signature, setSignature] = useState(null);
    const router = useRouter()

    // user image handling
    const [fileLoading, setFileLoading] = useState({ isloading: false, inputName: '' });
    const [images, setImages] = useState([]);
    const handleImage = async (e, input_name) => {
        const files = ['image/jpeg', 'image/png', 'image/jpg'];
        if (files.includes(e.target.files[0].type) && (e.target.files[0].size <= 3145728)) {
            const obj = {};
            setFileLoading({ isloading: true, inputName: input_name });
            const url = await awsFileUpload(e.target.files[0]);
            if (url) {
                obj[input_name] = url;
                const duplicateV = images?.find(dt => dt[input_name]);
                if (!!duplicateV) {
                    const filterObj = images?.filter(dt => !dt[input_name])
                    setImages([...filterObj, obj])
                } else {
                    setImages(pre => [...pre, obj])
                }
                setFileLoading({ isloading: false, inputName: '' });
            } else {
                setFileLoading({ isloading: false, inputName: '' });
                toast.warning("Something went wrong!")
            }
        } else {
            setFileLoading({ isloading: false, inputName: '' });
            toast.warning("The file must be an image & <= 3MB!")
        }
    };

    // user file handling
    const [files, setFiles] = useState([]);
    const handleFile = async (e, input_name) => {
        const fileSupport = ['image/jpeg', 'application/pdf', 'image/png', 'image/jpg', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'application/vnd.rar'];
        if (fileSupport.includes(e.target.files[0].type) && (e.target.files[0].size <= 5242880)) {
            const obj = {};
            setFileLoading({ isloading: true, inputName: input_name });
            const url = await awsFileUpload(e.target.files[0]);
            if (url) {
                obj[input_name] = url;
                const duplicateV = files?.find(dt => dt[input_name]);
                if (!!duplicateV) {
                    const filterObj = files?.filter(dt => !dt[input_name])
                    setFiles([...filterObj, obj])
                } else {
                    setFiles(pre => [...pre, obj])
                }
                setFileLoading({ isloading: false, inputName: '' });
            } else {
                setFileLoading({ isloading: false, inputName: '' });
                toast.warning("Something went wrong!")
            }
        } else {
            setFileLoading({ isloading: false, inputName: '' });
            toast.warning("Maximum size is 5 MB! Valid files are image, csv, pdf, excel, zip, rar")
        }
    };

    // digital signature
    const handleDigitalSignatureClear = () => {
        digitalSignatureRef.current?.clear();
    }
    const handleDigitalSignatureData = () => {
        const digitalSignature = digitalSignatureRef.current?.toDataURL('jpg');
        setSignature(digitalSignature)
        toast.success('Your signature has stored successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    // Times handling and managing
    const [timePickUpName, setTimePickUpName] = useState('');
    const [timePickUpArr, setTimePickUpArr] = useState([]);
    // input on chancge value
    const handleTimePickUp = (time, timeString) => {
        const obj = {};
        obj[timePickUpName] = timeString;
        const duplicateV = timePickUpArr?.find(dt => dt[timePickUpName])
        if (!!duplicateV) {
            const filterObj = timePickUpArr?.filter(dt => !dt[timePickUpName])
            setTimePickUpArr([...filterObj, obj])
        } else {
            setTimePickUpArr(pre => [...pre, obj])
        }
    }
    // input on focus value
    const handleTimeField = (fieldName) => {
        setTimePickUpName(fieldName)
    }

    // Date handling and managing
    const [datePickUpName, setDatePickUpName] = useState('');
    const [datePickUpArr, setDatePickUpArr] = useState([]);
    // input on chancge value
    const handleDatePickUp = (date, dateString) => {
        const obj = {};
        obj[datePickUpName] = dateString;
        const duplicateV = datePickUpArr?.find(dt => dt[datePickUpName])
        if (!!duplicateV) {
            const filterObj = datePickUpArr?.filter(dt => !dt[datePickUpName])
            setDatePickUpArr([...filterObj, obj]);
        } else {
            setDatePickUpArr(pre => [...pre, obj])
        }
    }
    // input on focus value
    const handleDateField = (fieldName) => {
        setDatePickUpName(fieldName)
    }

    // handle boolean status
    const [allBooleanFields, setAllBooleanFields] = useState([]);
    const handleBooleanStatus = (e, input_name) => {
        const obj = {};
        obj[input_name] = e.target.checked;
        const duplicateV = allBooleanFields?.find(dt => dt[input_name])
        if (!!duplicateV) {
            const filterObj = allBooleanFields?.filter(dt => !dt[input_name])
            setAllBooleanFields([...filterObj, obj]);
        } else {
            setAllBooleanFields(pre => [...pre, obj])
        }
    }

    // handle switch boolean status
    const [allSwitchBooleanFields, setAllSwitchBooleanFields] = useState([]);
    const handleSwitchBooleanStatus = (e, input_name) => {
        const obj = {};
        obj[input_name] = e;
        const duplicateV = allSwitchBooleanFields?.find(dt => dt[input_name])
        if (!!duplicateV) {
            const filterObj = allSwitchBooleanFields?.filter(dt => !dt[input_name])
            setAllSwitchBooleanFields([...filterObj, obj]);
        } else {
            setAllSwitchBooleanFields(pre => [...pre, obj])
        }
    }

    // back to the previous page
    const handleBackPage = () => {
        setPageToggle(pre => !pre)
    }

    // update user information
    const [loadingNext, setLoadingNext] = useState(false)
    const onFinish = (values) => {
        setLoadingNext( pre => pre = true)

        // // add all time based input into values
        timePickUpArr?.forEach(tm => values[Object.keys(tm)[0]] = Object.values(tm)[0])
        // // add all date based input into values images
        datePickUpArr?.forEach(dt => values[Object.keys(dt)[0]] = Object.values(dt)[0])
        // // add images input into values 
        images?.forEach(imag => values[Object.keys(imag)[0]] = Object.values(imag)[0])
        // // files
        files?.forEach(fil => values[Object.keys(fil)[0]] = Object.values(fil)[0])
        // // all boolean fields
        allBooleanFields?.forEach(bl => values[Object.keys(bl)[0]] = Object.values(bl)[0])
        // // all Switch BooleanFields
        allSwitchBooleanFields?.forEach(bl => values[Object.keys(bl)[0]] = Object.values(bl)[0])
        // // digital signature
        values.digital_signature = signature;

        const token = localStorage.getItem('authToken') ?? '';
        const decoded = token && jwt_decode(token);

        if (signature === null && (checkFieldStatus('digital_signature') === true)) {
            toast.error('Signature required!', {
                position: "bottom-right", autoClose: 3000, hideProgressBar: false,
                closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
            })
        }

        if (!registeredFormId) {
            toast.error('Application ID required!', {
                position: "bottom-right", autoClose: 3000, hideProgressBar: false,
                closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
            })
        }

        if (registeredFormId && getVehicleId && (checkFieldStatus('digital_signature') === (false || undefined) ? true : signature) && (values.terms_and_conditions === false ? false : true)) {
            setLoadingNext( pre => pre = false)
            const details = {
                ...responseData?.details,
                ...values
            }
            postDriverVehicle({details, _id: responseData?._id}).then(res => {
                if (res?.error === false) {
                    toast.success(res?.msg)
                    setTimeout(() => {
                        router.push('/home/')
                    }, 4000);
                } else {
                    toast.error(res?.msg)
                }
            })
        } else {
            setLoadingNext(false)
            toast.error('Invalid Input! Try again...', {
                position: "bottom-center", autoClose: 3000, hideProgressBar: false,
                closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
            })
        }
    };


    return (
        <section>
            <span className='mb-4 ml-5 inline-block border-b border-main text-[16px] font-medium'>Vehicle Information</span>

            <div className='px-3'>
                <Form
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    {/* dynamic form's field generation, sorting stage 1 */}
                    <div className='md:grid md:grid-cols-2 gap-x-2 md:gap-x-10 gap-y-1'>
                        {
                            formFieldsData?.map(field =>
                                <>
                                    {
                                        (field?.input_type === 'text' && checkFieldStatus(field?.input_name)) &&
                                        <FormInput
                                            label={field?.input_name?.split('_').join(' ').toUpperCase()}
                                            formName={field?.input_name}
                                            formPlaceholder={capitalizeFirstLetter(field?.placeholder?.split('_').join(' '))}
                                            formMessage={field?.input_name?.split('_').join(' ')}
                                            formRequired={false}
                                            requiredOption={field?.field_required}
                                        />
                                    }

                                    {
                                        ((field?.input_type === 'boolean' || field?.input_type === 'switch') && checkFieldStatus(field?.input_name)) &&
                                        <FormSwitch
                                            label={field?.placeholder?.split('_').join(' ').toUpperCase()}
                                            formName={field?.input_name}
                                            formPlaceholder={capitalizeFirstLetter(field?.input_name?.split('_').join(' '))}
                                            handleSwitchBooleanStatus={handleSwitchBooleanStatus}
                                            requiredOption={field?.field_required}
                                        />
                                    }

                                    {
                                        (field?.input_type === 'number' && checkFieldStatus(field?.input_name)) &&
                                        <FormNumber
                                            label={field?.input_name?.split('_').join(' ').toUpperCase()}
                                            formName={field?.input_name}
                                            formPlaceholder={capitalizeFirstLetter(field?.placeholder?.split('_').join(' '))}
                                            formMessage={field?.input_name?.split('_').join(' ')}
                                            formRequired={false}
                                            requiredOption={field?.field_required}
                                        />
                                    }

                                    {
                                        (field?.input_type === 'date' && checkFieldStatus(field?.input_name)) &&
                                        <FormDateInput
                                            label={field?.input_name?.split('_').join(' ').toUpperCase()}
                                            formName={field?.input_name}
                                            formPlaceholder={capitalizeFirstLetter(field?.placeholder?.split('_').join(' '))}
                                            formMessage={field?.input_name?.split('_').join(' ')}
                                            formRequired={false}
                                            requiredOption={field?.field_required}
                                            handleDatePickUp={handleDatePickUp}
                                            handleDateField={handleDateField}
                                        />
                                    }

                                    {
                                        (field?.input_type === 'time' && checkFieldStatus(field?.input_name)) &&
                                        <FormTimeInput
                                            label={field?.input_name?.split('_').join(' ').toUpperCase()}
                                            formName={field?.input_name}
                                            formPlaceholder={capitalizeFirstLetter(field?.placeholder?.split('_').join(' '))}
                                            formMessage={field?.input_name?.split('_').join(' ')}
                                            formRequired={false}
                                            handleTimePickUp={handleTimePickUp}
                                            handleTimeField={handleTimeField}
                                            requiredOption={field?.field_required}
                                        />
                                    }

                                    {
                                        (field?.input_type === 'select' && checkFieldStatus(field?.input_name)) &&
                                        <FormInputSelect
                                            label={field?.input_name?.split('_').join(' ').toUpperCase()}
                                            formName={field?.input_name}
                                            formPlaceholder={capitalizeFirstLetter(field?.placeholder?.split('_').join(' '))}
                                            formMessage={field?.input_name?.split('_').join(' ')}
                                            formRequired={false}
                                            select_options={field?.select_options}
                                            provinceData={provinceData}
                                            requiredOption={field?.field_required}
                                        />
                                    }

                                    {
                                        // try more
                                        (field?.input_type === 'radio_button' && checkFieldStatus(field?.input_name)) &&
                                        <FormInputRadioButton
                                            label={field?.input_name?.split('_').join(' ').toUpperCase()}
                                            input_name={field?.input_name}
                                            formPlaceholder={capitalizeFirstLetter(field?.input_name?.split('_').join(' '))}
                                            select_options={field?.select_options}
                                            requiredOption={field?.field_required}
                                        />
                                    }

                                    {
                                        (field?.input_type === 'file' && checkFieldStatus(field?.input_name)) &&
                                        <InputFileUpload
                                            input_name={field?.input_name}
                                            fileTitle={field?.input_name?.split('_').join(' ').toUpperCase()}
                                            imgURL=''
                                            fileLoading={fileLoading}
                                            handleFile={handleFile}
                                            files={files}
                                            requiredOption={field?.field_required}
                                        />
                                    }
                                </>
                            )
                        }
                    </div>

                    {/* dynamic form's field generation, sorting stage 2 */}
                    <div className='md:grid md:grid-cols-2'>
                        {
                            formFieldsData?.map(field =>
                                <>
                                    {
                                        (field?.input_type === 'image' && checkFieldStatus(field?.input_name)) &&
                                        <InputImageUpload
                                            input_name={field?.input_name}
                                            imgTitle={field?.placeholder?.split('_').join(' ')}
                                            imgURL=''
                                            fileLoading={fileLoading}
                                            handleImage={handleImage}
                                            images={images}
                                            requiredOption={field?.field_required}
                                        />
                                    }
                                </>
                            )
                        }
                    </div>

                    {/* dynamic form's field generation, sorting stage 3 */}
                    <div className=''>
                        {
                            formFieldsData?.map(field =>
                                <>
                                    {
                                        (field?.input_type === 'textarea' && checkFieldStatus(field?.input_name)) &&
                                        <FormTextArea
                                            label={field?.input_name?.split('_').join(' ').toUpperCase()}
                                            formName={field?.input_name}
                                            formPlaceholder={capitalizeFirstLetter(field?.placeholder?.split('_').join(' '))}
                                            formMessage={field?.input_name?.split('_').join(' ')}
                                            formRequired={false}
                                            requiredOption={field?.field_required}
                                        />
                                    }
                                </>
                            )
                        }
                    </div>

                    {/* dynamic form's field generation, sorting stage 4 */}
                    <div className='mt-3'>
                        {
                            formFieldsData?.map(field =>
                                <>
                                    {
                                        (field?.input_type === 'digital_signature' && checkFieldStatus(field?.input_name)) &&
                                        <DigitalSignature
                                            handleDigitalSignatureData={handleDigitalSignatureData} handleDigitalSignatureClear={handleDigitalSignatureClear}
                                            digitalSignatureRef={digitalSignatureRef}
                                        />
                                    }
                                </>
                            )
                        }
                    </div>

                    {/* dynamic form's field generation, sorting stage 5 */}
                    <div className='md:grid md:grid-cols-2 gap-x-2 md:gap-x-10 gap-y-1'>
                        {
                            formFieldsData?.map(field =>
                                <>
                                    {
                                        (field?.input_type === 'checkbox' && (field?.input_name !== "terms_and_conditions") && checkFieldStatus(field?.input_name)) &&
                                        <InputCheckbox
                                            label={field?.input_name?.split('_').join(' ').toUpperCase()}
                                            input_name={field?.input_name}
                                            formName={field?.input_name}
                                            formPlaceholder={capitalizeFirstLetter(field?.input_name?.split('_').join(' '))}
                                            handleBooleanStatus={handleBooleanStatus}
                                            checkLink={field?.link}
                                            requiredOption={field?.field_required}
                                        />
                                    }
                                </>
                            )
                        }
                    </div>

                    {/* term and condition */}
                    <div className='mt-3'>
                        {
                            formFieldsData?.map(field =>
                                <>
                                    {
                                        (field?.input_type === 'checkbox' && (field?.input_name === "terms_and_conditions")) &&
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
                                                <Checkbox>I accept the <a href={field?.link ?? '#'} target="__blank" className='text-purple-500'>Terms and Conditions</a></Checkbox>
                                            </Form.Item>
                                        </div>
                                    }
                                </>
                            )
                        }
                    </div>


                    {/* submit button */}
                    <div className='flex gap-2 mb-4 mt-5'>

                        <button className='btn btn-danger'>SAVE &amp; FINISH</button>
                        <span onClick={handleBackPage} className='btn btn-info text-light'>BACK</span>

                    </div>

                    {
                        loadingNext &&
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
        </section >
    );
};

export default RiderFormFields2;