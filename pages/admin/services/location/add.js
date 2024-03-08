import React, { useState, useEffect } from 'react';
import AdminLayout from "../../../../layouts/admin";
import Card from "../../../../components/common/card";
import { ImLocation2 } from "react-icons/im";
import { Form, message } from "antd";
import FormInput, { HiddenFormItem } from "../../../../components/form/input";
import { Col, Row } from "react-bootstrap";
import { useI18n } from "../../../../contexts/i18n";
import CountryInput from "../../../../components/form/country";
import TimezoneSelect from 'react-timezone-select';
import FormSelect from "../../../../components/form/select";
import ServiceLocationMap from "./map";
import Button from "../../../../components/common/button";
import { useAction } from "../../../../helpers/hooks";
import { postServiceLocation } from "../../../../helpers/backend_helper";
import { useRouter } from "next/router";
import { getCurrentLocation } from '../../../../components/common/utilities';


const AddLocation = ({ form, timeZoneData, coordinatesData }) => {
    const i18n = useI18n();
    const { push } = useRouter();
    const [country, setCountry] = useState();
    const [selectedTimezone, setSelectedTimezone] = useState({});
    const [LocationList, setLocationList] = useState([]);
    const [centerLocation, setCenterLocation] = useState({});

    useEffect(() => {
        setSelectedTimezone({...timeZoneData})
    },[timeZoneData?.label])

    useEffect(() => {
        getCurrentLocation(setCenterLocation);
    }, []);


    return (
        <div>
            <Card className={'shadow-sm'}>
                <h1 className={'text-gray-600 text-[16px] font-semibold tracking-wider flex gap-2'}><ImLocation2
                    className={'text-teal-600'} />Add Location</h1>
            </Card>
            <div className={'bg-white p-5 rounded-md'}>
                <Form
                    form={form}
                    layout={'vertical'}
                    onFinish={values => {
                        values.country = country;
                        values.timezone = selectedTimezone ?? timeZoneData;
                        if(LocationList.length > 0) {
                            values.location = {
                                type: "Polygon",
                                coordinates: [LocationList]
                            };
                        } else if (coordinatesData?.coordinates?.length > 0) {
                            values.location = coordinatesData;
                        }

                        if (!!values.location) {
                            return useAction(postServiceLocation, values, () => {
                                setTimeout(async () => {
                                    await push('/admin/services/location')
                                }, 2000)
                            })
                        } else {
                            message.success('Please draw polygonal location first')
                        }
                    }}
                >
                    <HiddenFormItem name={'_id'} />
                    <Row>
                        <Col md={6}>
                            <FormInput
                                name={'name'}
                                label={i18n.t("Location Name")}
                                placeholder={i18n.t("Enter location name")}
                                required
                            />
                        </Col>
                        <Col md={6}>
                            <FormInput
                                name={'address'}
                                label={i18n.t("Full Address")}
                                placeholder={i18n.t("Enter your address")}
                                required
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <CountryInput name={'country'} label={'Select Country'} setCountry={setCountry} />
                        </Col>
                        <Col md={6}>
                            <div className="">
                                <p className='font-medium'>Select Time-Zone</p>
                                <div className="select-wrapper">
                                    <TimezoneSelect
                                        value={selectedTimezone}
                                        onChange={setSelectedTimezone}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormSelect
                                name={'distance_unit'}
                                label={i18n.t("Distance Unit")}
                                placeholder={i18n.t("Enter distance Unit")}
                                options={[{ label: 'KM', value: 'km' }, { label: 'Mile', value: 'mile' }]}
                                required
                            />
                        </Col>
                        <Col md={6}>
                            <FormSelect
                                name={'active'}
                                label={i18n.t("Active Status")}
                                placeholder={i18n.t("Select active status")}
                                options={[{ label: 'Active', value: true }, { label: 'Disable', value: false }]}
                                required
                            />
                        </Col>
                    </Row>

                    <div className={'flex justify-center mt-3 mb-5'}>
                        <ServiceLocationMap LocationList={LocationList} setLocationList={setLocationList} centerLocation={centerLocation} coordinatesData={coordinatesData} />
                    </div>

                    <Button>
                        Add Location
                    </Button>
                </Form>
            </div>
        </div>
    );
};
AddLocation.layout = AdminLayout;
export default AddLocation;