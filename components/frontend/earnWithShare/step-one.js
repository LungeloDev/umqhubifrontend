import React, {useEffect, useState} from 'react';
import FormInput from "../../form/input";
import {Col, Row} from "react-bootstrap";
import {useI18n} from "../../../contexts/i18n";
import InputFile from "../../form/file";
import Card from "../../common/card";
import FormSelect from "../../form/select";
import {Form, message, Spin} from "antd";
import {getAwsUploadImagesUrl} from "../../common/fileUploadAWS";
import {fetchProfile} from "../../../helpers/backend_helper";
import VehicleFiltering from "./vehicle-filtering";

const VehicleRegisterStepOne = ({setToggle, form, setFormData, getServiceVehicle, setVehicleParentsIds, vehicleParentsIds, setCurrentStep, toggle}) => {
    const i18n = useI18n()
    const [user, setUser] = useState();
    const [loadingNext, setLoadingNext] = useState(false)
    useEffect(() => {
        fetchProfile().then(res => {
            if (res?.error === false) {
                setUser(res?.data?.role);
            }
        })
    }, [])

    return (
        <div>
            <Form
                layout={'vertical'}
                form={form}
                onFinish={async values => {
                    if (user === 'driver') {
                        setLoadingNext(true)
                        values.images = await getAwsUploadImagesUrl(values.images)
                        setLoadingNext(false)
                        setFormData(values)
                        setToggle(pre => pre = false)
                        setCurrentStep(pre => pre = 1)
                    } else {
                        message.error("Driver data is missing")
                    }
                }}
            >
                <div className={'mt-3'}>
                    <Card className={'shadow-sm'}>
                        <VehicleFiltering
                            getServiceVehicle={getServiceVehicle}
                            setVehicleParentsIds={setVehicleParentsIds}
                            vehicleParentsIds={vehicleParentsIds}
                            toggle={toggle}
                        />
                    </Card>
                </div>

                <Card className={'shadow-sm'}>
                    <h3 className='font-semibold text-gray-600 mb-3'>Vehicle Basic Information:</h3>
                    <Row>
                        <Col>
                            <FormInput
                                label={!!i18n && i18n.t("Vehicle name")}
                                placeholder={!!i18n && i18n.t("Enter vehicle name")}
                                name={'name'}
                                readOnly
                                required
                            />
                        </Col>
                        <Col>
                            <FormInput
                                label={!!i18n && i18n.t("Vehicle model name")}
                                placeholder={!!i18n && i18n.t("Enter vehicle model name")}
                                name={'model_name'}
                                readOnly
                                required
                            />
                        </Col>
                    </Row>
                    <Row title="Images">
                        <InputFile max={10} name="images"/>
                    </Row>
                </Card>

                {/* Vehicle Specifications  */}
                <Card className={'shadow-sm'}>
                    <h3 className='font-semibold text-gray-600 mb-3'>Vehicle Specifications:</h3>
                    <Row>
                        <Col md={6}>
                            <FormInput
                                name={['specifications', 'max_power']}
                                placeholder={!!i18n && i18n.t('Enter max power. ex: 375.48bhp or 460hp')}
                                label={!!i18n && i18n.t('Max. power')}
                                required
                            />
                        </Col>
                        <Col md={6}>
                            <FormInput
                                name={['specifications', 'fuel_per_litre']}
                                placeholder={!!i18n && i18n.t('Enter fuel per litre. ex: 10km')}
                                label={!!i18n && i18n.t("Fuel per litre")}
                                required
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormInput
                                name={['specifications', 'max_speed']}
                                placeholder={!!i18n && i18n.t('Enter max speed. ex: 250kmph')}
                                label={!!i18n && i18n.t('Max. speed')}
                                required
                            />
                        </Col>
                        <Col md={6}>
                            <FormInput
                                name={['specifications', 'mph']}
                                placeholder={!!i18n && i18n.t('Enter acceleration. ex: 4.7sec')}
                                label={!!i18n && i18n.t("0-60mph")}
                                required
                            />
                        </Col>
                    </Row>
                </Card>

                {/* Vehicle Features  */}
                <Card className={'shadow-sm'}>
                    <h3 className='font-semibold text-gray-600 mb-3'>Vehicle Features:</h3>
                    <Row>
                        <Col md={6}>
                            <FormInput
                                name={['features', 'capacity']}
                                placeholder={!!i18n && i18n.t('Enter vehicle seat capacity: ex: 14')}
                                label={!!i18n && i18n.t('Seat capacity')}
                                required
                                type={'number'}
                            />
                        </Col>
                        <Col md={6}>
                            <FormInput
                                name={['features', 'color']}
                                placeholder={!!i18n && i18n.t('Enter vehicle color. ex: red')}
                                label={!!i18n && i18n.t('Vehicle color')}
                                required
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormSelect
                                name={['features', 'fuel_type']}
                                placeholder={!!i18n && i18n.t('Fuel type')}
                                label={!!i18n && i18n.t('Fuel type')}
                                required
                                options={[
                                    {label: 'Octane', value: 'octane'},
                                    {label: 'Petrol', value: 'petrol'},
                                    {label: 'Diesel', value: 'diesel'},
                                    {label: 'CNG', value: 'cng'},
                                    {label: 'Bio-Diesel', value: 'bio-diesel'},
                                    {label: 'LPG', value: 'lpg'},
                                    {label: 'Electric Vehicle', value: 'electric_vehicle'},
                                    {label: 'Other', value: 'other'},
                                ]}
                            />
                        </Col>
                        <Col md={6}>
                            <FormSelect
                                name={['features', 'gear_type']}
                                placeholder={!!i18n && i18n.t('Gear type')}
                                label={!!i18n && i18n.t('Gear type')}
                                required
                                options={[{label: 'Manual', value: 'manual'}, {label: 'Automatic', value: 'automatic'}]}
                            />
                        </Col>
                    </Row>
                </Card>

                <div className={'flex items-center gap-5'}>
                    <button
                        className={'mt-3 px-5 py-2 bg-amber-300 ' +
                            'rounded-md text-16 font-semibold text-gray-700' +
                            ' cursor-pointer'}
                    > {!!i18n && i18n.t('Next')} </button>
                    {
                        loadingNext &&
                        <div className="flex justify-center mt-3">
                            <Spin/>
                        </div>
                    }
                </div>
            </Form>
        </div>
    );
};

export default VehicleRegisterStepOne;