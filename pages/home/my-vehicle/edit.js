import {Form, Spin} from 'antd';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import Card from '../../../components/common/card';
import FormInput, {HiddenFormItem} from '../../../components/form/input';
import {useI18n} from '../../../contexts/i18n';
import {fetchDriverVehicle, postDriverVehicle} from "../../../helpers/backend_helper";
import InputFile from "../../../components/form/file";
import {Col, Row} from "react-bootstrap";
import {getAwsUploadImagesUrl} from "../../../components/common/fileUploadAWS";
import {useAction} from "../../../helpers/hooks";
import HomeLayout from "../../../layouts/home";


const EditVehicle = () => {
    const i18n = useI18n()
    const [form] = Form.useForm();
    const {query = '', push} = useRouter();
    const [loading, setLoading] = useState(false);
    const [vehicle, setVehicle] = useState({});
    const [loadingNext, setLoadingNext] = useState(false);

    // load VEHICLE data
    useEffect(() => {
        if (!!query?.driver) {
            fetchDriverVehicle({driver: query?.driver}).then(res => {
                if (res?.error === false) {
                    setVehicle(res?.data);
                }
            })
        }
    }, [query?.driver, loading])

    useEffect(() => {
        if (vehicle?._id) {
            form.setFieldsValue({
                ...vehicle,
                images: vehicle?.images?.map((d, index) => ({
                    uid: '-' + (index + 1),
                    name: `image${index}.png`,
                    status: 'done',
                    url: d
                })),
            })
        }
    }, [vehicle?._id])

    return (
        <div className={'md:w-2/3 md:mx-auto md:mt-[5%]'}>
            <Card className={'shadow-sm'}>
                <h1 className={'text-gray-600 text-[16px] font-semibold tracking-wider flex gap-2'}>
                    {i18n.t("Update Vehicle")}
                </h1>
            </Card>
            <Card className='my-3'>
                <Form
                    layout='vertical'
                    onFinish={async values => {
                        setLoadingNext(true)
                        values.images = await getAwsUploadImagesUrl(values.images)
                        setLoadingNext(false)
                        return useAction(postDriverVehicle, values, () => {
                            setLoading(pre => pre = true)
                        })
                    }}
                    form={form}
                >
                    {
                        <div className="">
                            <HiddenFormItem name={"_id"}/>
                            <Card className='my-3'>
                                <h3 className='text-14 my-2 font-semibold'>Vehicle Images:</h3>
                                <Row title="Images">
                                    <InputFile max={10} name="images"/>
                                </Row>
                            </Card>
                            {/* Vehicle Specifications  */}
                            <Card className='mb-3'>
                                <h3 className='text-14 my-4 font-semibold'>Vehicle Specifications:</h3>
                                <Row>
                                    <Col md={6}>
                                        <FormInput name={['specifications', 'max_power']} placeholder={'Max Power'}
                                                   label={'Max. Power'}/>
                                    </Col>
                                    <Col md={6}>
                                        <FormInput name={['specifications', 'fuel_per_litre']}
                                                   placeholder={'Fuel per Litre'} label={'Fuel per Litre'}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormInput name={['specifications', 'max_speed']}
                                                   placeholder={'Vehicle Max Speed'}
                                                   label={'Max. Speed'}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <FormInput name={['specifications', 'mph']} placeholder={'second'}
                                                   label={'0-60mph'}
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            {/* Vehicle Features  */}
                            <Card>
                                <h3 className='text-14 my-4 font-semibold'>Vehicle Features:</h3>
                                <Row>
                                    <Col md={6}>
                                        <FormInput name={['features', 'capacity']} placeholder={'Capacity'}
                                                   label={'Capacity'}/>
                                    </Col>
                                    <Col md={6}>
                                        <FormInput name={['features', 'color']} placeholder={'Color'} label={'Color'}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormInput name={['features', 'fuel_type']} placeholder={'Fuel Type'}
                                                   label={'Fuel Type'}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <FormInput name={['features', 'gear_type']} placeholder={'Gear Type'}
                                                   label={'Gear Type'}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    }

                    <h1 className={'py-3 font-semibold text-14'}>
                        Update documents :
                        <span className={'text-cyan-600 underline cursor-pointer tracking-wider'}
                              onClick={() => push("/home/my-vehicle/document-update?driver=" + query?.driver)}
                        >
                            click here
                        </span>
                    </h1>

                    <div className={'flex items-center gap-5'}>
                        <button
                            className={'mt-3 px-5 py-2 bg-amber-300 ' +
                                'rounded-md text-16 font-semibold text-gray-700' +
                                ' cursor-pointer'}
                        > {!!i18n && i18n.t('Update')} </button>
                        {
                            loadingNext &&
                            <div className="flex justify-center mt-3">
                                <Spin/>
                            </div>
                        }
                    </div>
                </Form>
            </Card>
        </div>
    );
};
EditVehicle.layout = HomeLayout
export default EditVehicle;