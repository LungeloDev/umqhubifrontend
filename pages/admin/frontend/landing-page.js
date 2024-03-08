import {Form} from 'antd';
import React, {useEffect, useState} from 'react';
import {Col, Row} from 'react-bootstrap';
import {ScaleLoader} from 'react-spinners';
import Button from '../../../components/common/button';
import Card from '../../../components/common/card';
import InputFile, {getUploadImagesUrl} from '../../../components/form/file';
import ImageInput from '../../../components/form/image';
import FormInput, {HiddenFormItem} from '../../../components/form/input';
import {useI18n} from '../../../contexts/i18n';
import {fetchPage, fetchLanguages, postPage} from '../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../helpers/hooks';
import AdminLayout from '../../../layouts/admin';
import PageTitle from "../../../components/common/page-title";
import {awsFileUpload, getAwsUploadImagesUrl} from "../../../components/common/fileUploadAWS";


const LandingPage = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()

    const [loadingData, setLoadingData] = useState(false);
    const [logo, setLogo] = useState(null);
    const [images, setImages] = useState({});

    const [landingPageData, getLandingPageData, {loading, error}] = useFetch(fetchPage, {pages: 'land_page'}, false);

    const [languages] = useFetch(fetchLanguages);
    const [language, setLanguage] = useState(null);

    useEffect(() => {
        languages?.forEach((d) => {
            if (d.default === true) {
                setLanguage(d.code);
            }
        })
    }, [languages])

    useEffect(() => {
        if (!!language) {
            form.resetFields();
            getLandingPageData({lang: language})
        }
    }, [language])

    useEffect(() => {
        if (landingPageData) {
            form.resetFields();
            form.setFieldsValue({
                ...landingPageData?.content,
                hero_section_banners: {
                    type: 'object',
                    value: landingPageData?.content?.hero_section_banners?.value?.map((d, index) => ({
                        uid: '-' + (index + 1),
                        name: `image${index}.png`,
                        status: 'done',
                        url: d
                    }))
                },
            })
        }
    }, [landingPageData])

    const onFinish = async (values) => {
        setLoadingData(true);
        // hero section image upload
        values.hero.value.image = await awsFileUpload(values.hero?.value.image);
        // hero section banner image upload
        values.hero_section_banners.value = await getAwsUploadImagesUrl(values.hero_section_banners.value);
        //work section image upload
        values.work.value.image1 = await awsFileUpload(values.work?.value.image1);
        values.work.value.image2 = await awsFileUpload(values.work?.value.image2);
        values.work.value.image3 = await awsFileUpload(values.work?.value.image3);
        values.benifit.value.image1 = await awsFileUpload(values.benifit?.value.image1);
        values.benifit.value.image2 = await awsFileUpload(values.benifit?.value.image2);
        values.benifit.value.image3 = await awsFileUpload(values.benifit?.value.image3);

        setLoadingData(false);
        Object.keys(values).forEach(key => {
            values[key]["lang"] = language;
        })
        if (!loadingData) {
            values = {title: "Landing Page", page: "land_page", content: values}
            return useAction(postPage, values, () => {
                getLandingPageData()
            })
        }
    }

    return (<section>
        <PageTitle title="Landing Page" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]} />
        <div className={'mt-4 flex justify-end items-center space-x-8'}>
            {languages?.map((d, index) => (<button key={index}
                className={`px-4 py-2   rounded bg-main2 ${language === d.code ? 'bg-[#FFE57E]' : ''}`}
                onClick={() => setLanguage(d.code)}>{d.name}</button>))}
        </div>

        <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
        >

            {/* hero section part */}
            <Card className="shadow-none border rounded-md mt-3" title={'Hero Section'}>
                <Row>
                    <Col md={6}>
                        <HiddenFormItem name={['hero', 'type']} initialValue="object" />
                        <FormInput
                            name={['hero', 'value', 'title']} label="Hero section title"
                            placeholder="Hero section top title" />
                    </Col>
                    <Col md={6}>
                        <FormInput name={['hero', 'value', 'description']} label="Hero section description"
                            placeholder="Hero section Descirption" />
                    </Col>
                    <Col md={12}>
                        <Col md={12}>
                            <Form.Item name={['hero', 'value', 'image']} label={i18n.t("Hero section title image")}>
                                <ImageInput onSelect={(url) => {
                                    setImages(images => ({...images, hero_image: url}));
                                }} />
                            </Form.Item>
                            <img className="h-28 pb-4"
                                src={images['hero_image'] || landingPageData?.content?.hero?.value.image} alt="" />
                        </Col>
                    </Col>

                </Row>

            </Card>

            {/* Brand logo section  */}
            <Card className="shadow-none border rounded-md mt-3" title={'Brand Partner'}>
                <Row>
                    <Col md={6}>
                        <Row title="Images">
                            <HiddenFormItem name={['hero_section_banners', 'type']} initialValue="object" />
                            <InputFile max={10} name={['hero_section_banners', 'value']} />
                        </Row>
                    </Col>
                </Row>

            </Card>

            {/* work part */}
            <Card className="shadow-none border rounded-md mt-2" title={"Work Section"}>
                <Row>
                    <Col md={8}>
                        <HiddenFormItem name={['work', 'type']} initialValue="object" />

                        <FormInput name={['work', 'value', 'work_title']} label="Work title"
                            placeholder="Enter work title" />

                    </Col>
                    <Col md={8}>
                        <FormInput name={['work', 'value', 'work_description']} label="Work description"
                            placeholder="Enter work description" />
                    </Col>

                    <Card className="shadow-none border rounded-md mt-3">
                        <Row>
                            <Col md={6}>
                                <Form.Item name={['work', 'value', 'image1']} label={i18n.t(" Image")}>
                                    <ImageInput onSelect={url => {
                                        setImages(images => ({...images, work_image1: url}));
                                    }} />
                                </Form.Item>

                                <img className="h-28 pb-4"
                                    src={images['work_image1'] || landingPageData?.content?.work?.value.image1}
                                    alt="" />
                            </Col>
                            <Col md={6}>
                                <FormInput name={['work', 'value', 'middle_card_titile']} label="Middle card title"
                                    placeholder="Middle card title" />
                            </Col>

                            <Col md={6}>
                                <FormInput name={['work', 'value', 'middle_card_description']}
                                    label="Middle card description"
                                    placeholder="Middle card description" type='textArea'
                                />
                            </Col>

                        </Row>
                    </Card>
                    <Card className="shadow-none border rounded-md mt-3">
                        <Row>
                            <Col md={6}>
                                <Form.Item name={['work', 'value', 'image2']} label={i18n.t("Image")}>
                                    <ImageInput onSelect={setLogo} />
                                </Form.Item>
                                <img className="h-28 pb-4" src={landingPageData?.content?.work?.value.image2} alt="" />

                            </Col>
                            <Col md={6}>
                                <FormInput name={['work', 'value', 'left_card_titile']} label="Left card title"
                                    placeholder="Left card title" />
                            </Col>

                            <Col md={6}>
                                <FormInput name={['work', 'value', 'left_card_description']}
                                    label="Left card description"
                                    placeholder="Left card description" type="textArea" />
                            </Col>
                        </Row>
                    </Card>
                    <Card className="shadow-none border rounded-md mt-3">
                        <Row>
                            <Col md={6}>
                                <Form.Item name={['work', 'value', 'image3']} label={i18n.t("Image")}>
                                    <ImageInput onSelect={setLogo} />
                                </Form.Item>
                                <img className="h-28 pb-4" src={landingPageData?.content?.work?.value.image3} alt="" />

                            </Col>
                            <Col md={6}>
                                <FormInput name={['work', 'value', 'right_card_titile']} label="Right card title"
                                    placeholder="Right Card Title" />
                            </Col>

                            <Col md={6}>
                                <FormInput name={['work', 'value', 'right_card_description']}
                                    label="Right Card Description"
                                    placeholder="Right Card Description" type="textArea" />
                            </Col>
                        </Row>
                    </Card>

                </Row>
            </Card>

            {/* Best courses part */}
            <Card className="shadow-none border rounded-md mt-2" title={"Numeric Statistics"}>
                <Row>
                    <Col md={6}>
                        <HiddenFormItem name={['statistics', 'type']} initialValue="object" />

                        <FormInput
                            name={['statistics', 'value', 'data_1st']}
                            label="Enter Number"
                            placeholder="Enter Number"
                        />
                    </Col>
                    <Col md={6}>
                        <FormInput name={['statistics', 'value', 'description_1st']} label="Enter Short Description"
                            placeholder="Enter short description" />

                    </Col><Col md={6}>
                        <FormInput
                            name={['statistics', 'value', 'data_2nd']}
                            label="Enter Number"
                            placeholder="Enter Number"
                        />
                    </Col>
                    <Col md={6}>
                        <FormInput name={['statistics', 'value', 'description_2nd']} label="Enter Short Description"
                            placeholder="Enter short description" />

                    </Col>
                    <Col md={6}>
                        <FormInput
                            name={['statistics', 'value', 'data_3rd']}
                            label="Enter Number"
                            placeholder="Enter Number"
                        />
                    </Col>
                    <Col md={6}>
                        <FormInput name={['statistics', 'value', 'description_3rd']} label="Enter Short Description"
                            placeholder="Enter short description" />

                    </Col><Col md={6}>
                        <FormInput
                            name={['statistics', 'value', 'data_4th']}
                            label="Enter Number"
                            placeholder="Enter Number"
                        />
                    </Col>
                    <Col md={6}>
                        <FormInput name={['statistics', 'value', 'description_4th']} label="Enter Short Description"
                            placeholder="Enter short description" />
                    </Col>
                </Row>

            </Card>


            {/* Benifit */}
            <Card className="shadow-none border rounded-md mt-2" title={"Benifit Section"}>
                <Row>

                    <HiddenFormItem name={['benifit', 'type']} initialValue="object" />
                    <Col md={8}>

                        <FormInput name={['benifit', 'value', 'benifit_title']} label="Benifit Title"
                            placeholder="Enter Benifit title" />
                    </Col>

                    <Card className="shadow-none border rounded-md mt-3">
                        <Row>
                            <Col md={6}>
                                <Form.Item name={['benifit', 'value', 'image1']} label={i18n.t("Image")}>
                                    <ImageInput onSelect={setLogo} />
                                </Form.Item>
                                <img className="h-28 pb-4" src={landingPageData?.content?.benifit?.value.image1}
                                    alt="" />

                            </Col>
                            <Col md={6}>
                                <FormInput name={['benifit', 'value', 'middle_card_titile']} label="Middle Card Title"
                                    placeholder="Middle Card Title" />
                            </Col>

                            <Col md={6}>
                                <FormInput name={['benifit', 'value', 'middle_card_description']}
                                    label="Middle Card Description"
                                    placeholder="Middle Card Description"
                                    type='textArea'
                                />
                            </Col>

                        </Row>
                    </Card>
                    <Card className="shadow-none border rounded-md mt-3">
                        <Row>
                            <Col md={6}>
                                <Form.Item name={['benifit', 'value', 'image2']} label={i18n.t("Image")}>
                                    <ImageInput onSelect={setLogo} />
                                </Form.Item>
                                <img className="h-28 pb-4" src={landingPageData?.content?.benifit?.value.image2}
                                    alt="" />


                            </Col>
                            <Col md={6}>
                                <FormInput name={['benifit', 'value', 'left_card_titile']} label="Left Card Title"
                                    placeholder="left Card Title" />
                            </Col>

                            <Col md={6}>
                                <FormInput name={['benifit', 'value', 'left_card_description']}
                                    label="Left Card Description"
                                    placeholder="Left Card Description" type='textArea' />
                            </Col>
                        </Row>
                    </Card>
                    <Card className="shadow-none border rounded-md mt-3">
                        <Row>
                            <Col md={6}>
                                <Form.Item name={['benifit', 'value', 'image3']} label={i18n.t("Image")}>
                                    <ImageInput onSelect={setLogo} />
                                </Form.Item>
                                <img className="h-28 pb-4" src={landingPageData?.content?.benifit?.value.image3}
                                    alt="" />
                            </Col>

                            <Col md={6}>
                                <FormInput name={['benifit', 'value', 'right_card_titile']} label="Right Card Title"
                                    placeholder="Right Card Title" />
                            </Col>

                            <Col md={6}>
                                <FormInput name={['benifit', 'value', 'right_card_description']}
                                    label="Right Card Description"
                                    placeholder="Right Card Description" type='textArea' />
                            </Col>
                        </Row>
                    </Card>

                </Row>
                <SubmitButton loadingData={loadingData} />
            </Card>



        </Form>


    </section>);
};
LandingPage.layout = AdminLayout;
export default LandingPage;

const SubmitButton = ({loadingData}) => {
    return (
        <div className='flex items-center gap-5'>
            <Button>Submit</Button>
            <div className="text-center md:ml-20">
                {loadingData === true && <div className="-space-y-4">
                    <p className="">
                        <ScaleLoader size={50} className='' color="#36d7b7" />
                    </p>
                </div>}
            </div>
        </div>
    )
}



