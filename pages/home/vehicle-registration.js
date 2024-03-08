import React, {useEffect, useState} from 'react';
import HomeLayout from "../../layouts/home";
import {useFetch} from "../../helpers/hooks";
import {fetchFormFields, fetchServiceVehicle, fetchVehicleVerify} from "../../helpers/backend_helper";
import {Breadcrumb, Form, Steps} from "antd";
import VehicleRegisterStepOne from "../../components/frontend/earnWithShare/step-one";
import VehicleRegisterStepTwo from "../../components/frontend/earnWithShare/step-two";
import {useRouter} from "next/router";
import {isAndroid, isIOS} from "react-device-detect";

const {Step} = Steps;

const VehicleRegistration = () => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0)
    const router = useRouter()
    const [serviceVehicle, getServiceVehicle] = useFetch(fetchServiceVehicle, {}, false);
    const [formFields, getFormFields, {loading, error}] = useFetch(fetchFormFields);
    const [toggle, setToggle] = useState(true);
    const [formData, setFormData] = useState({});
    const [vehicleParentsIds, setVehicleParentsIds] = useState({service_category: '', service: '', service_package: '', service_vehicle: ''})
    const [isComplete, setIsComplete] = useState(false);
    const [vehicleVerify, setVehicleVerify] = useFetch(fetchVehicleVerify)
    const [isUser, setIsUser] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if(!!token) {
            setIsUser(pre => pre = true);
        } else {
            setIsUser(pre => pre = false);
        }
    }, [])

    useEffect(() => {
        if (!!serviceVehicle?._id) {
            form.setFieldsValue({
                name: serviceVehicle?.name?.name,
                model_name: serviceVehicle?.vehicle_model,
            })
        }
    }, [serviceVehicle?._id])

    // checking field, is permitted or not by admin
    function checkFieldStatus(fieldName) {
        let status;
        formFields?.forEach(element => {
            if (element.input_name === fieldName) {
                status = element.status
            }
        });
        return status;
    }

    useEffect(() => {
        if (isComplete === true) {
            if (isAndroid) {
                const url = "intent://cartogo.com/#Intent;scheme=car2gouser;package=bd.com.appstick.car2gouser;end";
                window.location.replace(url);
            } else if (isIOS) {
                const url = "intent://cartogo.com/#Intent;scheme=car2gouser;package=bd.com.appstick.car2gouser;end";
                window.location.replace(url);
            } else {
                router.push("/success");
            }
        }
    }, [isComplete])

    return (
        <div className={"md:mx-[15%] mt-5"}>
            <div className={"md:w-1/2 flex justify-center md:block md:mx-auto"}>
                <div>
                    <Steps current={currentStep}>
                        <Step title="Vehicle Information"/>
                        <Step title="Documents"/>
                    </Steps>
                </div>
            </div>

            <div className={'mt-4 bg-gray-50 p-3 border-2 border-cyan-100 border-opacity-40'}>
                {
                    vehicleVerify?.error === true && <div className={'bg-red-400 py-3 rounded-md mb-3'}>
                        <h5 className={'text-slate-800 text-center text-[16px] px-1'}>
                            {
                                vehicleVerify?.msg
                            }
                        </h5>
                    </div>
                }
                {
                    isUser === false && <div className={'bg-red-400 py-3 rounded-md mb-3'}>
                        <h5 className={'text-slate-800 text-center text-[16px] px-1'}>
                            You're Not Logged In!
                        </h5>
                    </div>
                }
                <div className=''>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item href="/">
                            <span>Home</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="/home/earnWithShare/">
                            <span>Earn with share</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="/home/vehicle-registration">
                            <span>Vehicle registration</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className={'my-3 rounded-md'}>
                    {
                        toggle === true ?
                            <VehicleRegisterStepOne
                                setToggle={setToggle}
                                form={form}
                                setFormData={setFormData}
                                getServiceVehicle={getServiceVehicle}
                                setVehicleParentsIds={setVehicleParentsIds}
                                vehicleParentsIds={vehicleParentsIds}
                                setCurrentStep={setCurrentStep}
                                toggle={toggle}
                            />
                            :
                            <VehicleRegisterStepTwo
                                formData={formData}
                                checkFieldStatus={checkFieldStatus}
                                formFieldsData={formFields}
                                vehicleParentsIds={vehicleParentsIds}
                                setIsComplete={setIsComplete}
                                setToggle={setToggle}
                            />
                    }
                </div>
            </div>
        </div>
    );
};
VehicleRegistration.layout = HomeLayout;
export default VehicleRegistration;