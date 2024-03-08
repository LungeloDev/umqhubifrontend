import AdminLayout from "../../../layouts/admin";
import PageTitle from "../../../components/common/page-title";
import Card from "../../../components/common/card";
import {Form} from "antd";
import {Col, Row} from "react-bootstrap";
import FormInput from "../../../components/form/input";
import React, {useEffect, useState} from "react";
import Button from "../../../components/common/button";
import {useI18n} from "../../../contexts/i18n";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchSettings, postSettings} from "../../../helpers/backend_helper";
import dynamic from 'next/dynamic'
import FormSelect from "../../../components/form/select";
import SingleImageCropImage from "../../../components/form/simage_crop_image";
import {awsFileUpload} from "../../../components/common/fileUploadAWS";

const ReactIconsSelector = dynamic(() => import("../../../components/common/react-icon"), {ssr: false})

const SiteSettings = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [settings, getSettings] = useFetch(fetchSettings)
    const [logo, setLogo] = useState('/img/shops.png')

    useEffect(() => {
        if (settings) {
            form.setFieldsValue({
                ...settings,
                logo: undefined,
            })
            setLogo(settings?.logo || '/img/shops.png')
        }
    }, [settings])

    const [iconValue, setIconValue] = useState(undefined);

    return (
        <>
            <PageTitle title={!!i18n && i18n?.t('Site Settings')} />
            <div className={'bg-white p-4 rounded'}>
                <Form layout="vertical" form={form} onFinish={async values => {

                    values.logo = await awsFileUpload(values.logo, logo)

                    return useAction(postSettings, values, () => {
                        getSettings()
                    })
                }}>
                    <Row>
                        <Col md={6}>
                            <FormInput name="site_name" label="Site Name" required />
                        </Col>
                        <Col md={6}>
                            <FormInput name="site_email" label="Site Email" isEmail required />
                        </Col>
                        <Col md={6}>
                            <FormInput name="site_phone" label="Site Phone Number" required />
                        </Col>
                        <Col md={6}>
                            <FormInput name="currency_name" label="Currency Name" required />
                        </Col>
                        <Col md={6}>
                            <FormInput name="site_footer" label="Site Footer" required />
                        </Col>
                        <Col md={6}>
                            <FormInput name="currency_code" label="Currency Code" required />
                        </Col>
                        <Col md={6}>
                            <Form.Item name="logo" label={i18n.t("Site Logo")}>
                                <SingleImageCropImage onSelect={setLogo} />
                            </Form.Item>
                            <img className="h-28 pb-4" src={logo} alt="" />
                        </Col>
                        <Col md={6}>
                            <FormInput name="address" label="Address" textArea required />
                            <FormInput name="description" label="Description" textArea required />
                        </Col>

                        <Card title={'Social Media Link'} className={'shadow-sm'}>

                            <Form.List name="social_media_link">
                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map(({key, name}) => (
                                            <Row key={key} className="mb-2">
                                                <Col md={2}>
                                                    <Form.Item name={[name, 'icon']}
                                                        label={i18n.t("Select Social Media Icon")}>
                                                        <ReactIconsSelector onChange={(v) => setIconValue(v)}
                                                            value={iconValue}
                                                            className='border block rounded-md hover:bg-gray-50' />
                                                    </Form.Item>
                                                </Col>
                                                <Col md={4}>
                                                    <FormInput name={[name, 'name']} label=" Social Media Name"
                                                        placeholder="Enter  Social Media Name" required />
                                                </Col>
                                                <Col md={6}>
                                                    <FormInput name={[name, 'link']} label=" Social Media Link"
                                                        placeholder="Enter  Social Media Link" required />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Button type="button" onClick={() => add()}>Add Social Media Link</Button>
                                    </>
                                )}
                            </Form.List>
                        </Card>

                        <Card title={'Google Recaptcha'}>
                            <Row>
                                <Col md={6}>
                                    <FormSelect
                                        placeholder={'Login Recaptcha'}
                                        name={['recaptcha', 'login_recaptcha']}
                                        label={'Login Recaptcha'}
                                        options={[{label: 'Active', value: true}, {label: 'Inactive', value: false}]}
                                    />
                                </Col>
                                <Col md={6}>
                                    <FormSelect
                                        placeholder={'Register Recaptcha'}
                                        name={['recaptcha', 'register_recaptcha']}
                                        label={'Register Recaptcha'}
                                        options={[{label: 'Active', value: true}, {label: 'Inactive', value: false}]}
                                    />
                                </Col>
                            </Row>
                            <FormInput name={['recaptcha', 'site_key']} label="Recaptcha Site Key"
                                placeholder="Enter Recaptcha Site Key" type={'password'} />
                        </Card>

                        <Card title={'Google Map'}>
                            <FormInput
                                name={'googleMapsApiKey'}
                                label="Google Map API-Key"
                                placeholder="Enter Google Map API-Key"
                                type={'password'}
                            />
                        </Card>
                    </Row>

                    <Button>Submit</Button>
                </Form>

            </div>
        </>
    )
}
SiteSettings.layout = AdminLayout
export default SiteSettings
