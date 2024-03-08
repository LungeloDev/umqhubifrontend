import {Form} from 'antd';
import React, {useEffect, useState} from 'react';
import {Col, Row} from 'react-bootstrap';
import {ScaleLoader} from 'react-spinners';
import Button from '../../../../components/common/button';
import Card from '../../../../components/common/card';
import ImageInput from '../../../../components/form/image';
import FormInput, {HiddenFormItem} from '../../../../components/form/input';
import {useI18n} from '../../../../contexts/i18n';
import {fetchPage, fetchLanguages, postPage} from '../../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {awsFileUpload} from "../../../../components/common/fileUploadAWS";
import {AiFillDelete} from "react-icons/ai";
import * as sweetalert2 from "sweetalert2";


const ServiceTemplate = ({title, page_name}) => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [bikeService, setbikeService] = useState(false);
    const [logo, setLogo] = useState(null);
    const [images, setImages] = useState({});
    const [simages, setsImages] = useState({});
    const [key, setKey] = useState({});
    const [landingPageData, getLandingPageData, {loading, error}] = useFetch(fetchPage, {pages: page_name}, false);
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
            setImages({});
            setsImages([]);
            getLandingPageData({lang: language})
        }
    }, [language])

    useEffect(() => {
        if (landingPageData) {
            form.resetFields();
            form.setFieldsValue({
                ...landingPageData.content, hero_section_banners: {
                    type: 'object', value: landingPageData?.content?.hero_section_banners?.value?.map((d, index) => ({
                        uid: -(index + 1), name: `image${index}.png`, status: 'done', url: d
                    }))
                },
            })
            setScount(landingPageData?.content?.service?.value?.length || 1);
        }
    }, [landingPageData])

    const onFinish = async (values) => {
        values.hero.value.image = await awsFileUpload(values.hero?.value.image);
        values.work.value.middle_card.image = await awsFileUpload(values.work?.value.middle_card.image);
        values.work.value.left_card.image = await awsFileUpload(values.work?.value.left_card.image);
        values.work.value.right_card.image = await awsFileUpload(values.work?.value.right_card.image);

        for (let i = 0; i < values.service.value.length; i++) values.service.value[i].image = await awsFileUpload(values.service.value[i].image);

        setbikeService(false);
        Object.keys(values).forEach(key => {
            values[key]["lang"] = language;
        })
        values = {title: title, page: page_name, content: values}
        return useAction(postPage, values, () => {
            getLandingPageData()
        })
    }
    const deleteService = async (i) => {
        sweetalert2.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this  file!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(() => {
            //get the service values
            let values = landingPageData?.content?.service?.value;
            //remove the value from the array
            values.splice(i, 1);
            //set the new values
            let content = landingPageData?.content;
            content.service.value = values;
            //set the language
            content.service.lang = language;
            //set the payload
            const payload = {
                title: title,
                page: page_name,
                content: content,
            }
            //call the post page
            useAction(
                postPage,
                payload,
                () => {
                    getLandingPageData()
                })
        }
        )

    }

    const [scount, setScount] = useState(1);

    return (
        <section>
            <PageTitle title={title} breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]} />
            <div className={'flex justify-end items-center space-x-8'}>
                {languages?.map((d, index) => (<button key={index}
                    className={`px-4 py-2 rounded bg-main2 ${language === d.code ? 'bg-[#FFE57E]' : ''}`}
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
                            <FormInput name={['hero', 'value', 'description']} label="Hero section Description"
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

                {/* 2nd part */}
                <Card className="shadow-none border rounded-md mt-2" title={"2nd Section"}>
                    <Row>
                        <HiddenFormItem name={['work', 'type']} initialValue="object" />
                        <Card className="shadow-none border rounded-md mt-3">
                            <Row>
                                <Col md={4}>
                                    <Form.Item name={['work', 'value', 'middle_card', 'image']}
                                        label={i18n.t(" image")}>
                                        <ImageInput onSelect={url => {
                                            setImages(images => ({...images, work_image1: url}));
                                        }} />
                                    </Form.Item>
                                    <img className="h-28 pb-4"
                                        src={images['work_image1'] || landingPageData?.content?.work?.value?.middle_card?.image}
                                        alt="" />
                                </Col>
                                <Col md={4}>
                                    <FormInput name={['work', 'value', 'middle_card', 'title']}
                                        label="Middle Card Title"
                                        placeholder="Middle Card Title" />
                                </Col>

                                <Col md={4}>
                                    <FormInput name={['work', 'value', 'middle_card', 'description']}
                                        label="Middle Card Description"
                                        placeholder="Middle Card Description" textArea
                                    />
                                </Col>

                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Item name={['work', 'value', 'left_card', 'image']}
                                        label={i18n.t(" image")}>
                                        <ImageInput onSelect={url => {
                                            setImages(images => ({...images, work_image2: url}));
                                        }} />
                                    </Form.Item>
                                    <img className="h-28 pb-4"
                                        src={images['work_image2'] || landingPageData?.content?.work?.value?.left_card?.image}
                                        alt="" />
                                </Col>
                                <Col md={4}>
                                    <FormInput name={['work', 'value', 'left_card', 'title']}
                                        label="Left Card Title"
                                        placeholder="Left Card Title" />
                                </Col>

                                <Col md={4}>
                                    <FormInput name={['work', 'value', 'left_card', 'description']}
                                        label="Left Card Description"
                                        placeholder="Left Card Description" textArea
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Item name={['work', 'value', 'right_card', 'image']}
                                        label={i18n.t(" image")}>
                                        <ImageInput onSelect={url => {
                                            setImages(images => ({...images, work_image3: url}));
                                        }} />
                                    </Form.Item>
                                    <img className="h-28 pb-4"
                                        src={images['work_image3'] || landingPageData?.content?.work?.value?.right_card?.image}
                                        alt="" />
                                </Col>
                                <Col md={4}>
                                    <FormInput name={['work', 'value', 'right_card', 'title']}
                                        label="Right Card Title"
                                        placeholder="Right Card Title" />
                                </Col>

                                <Col md={4}>
                                    <FormInput name={['work', 'value', 'right_card', 'description']}
                                        label="Right Card Description"
                                        placeholder="Right Card Description" textArea
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Row>
                </Card>


                {/* 3rd part */}
                <Card className="shadow-none border rounded-md mt-2" title={"Last Sections"}>
                    <Row>
                        <Card className="shadow-none border rounded-md mt-3">
                            <HiddenFormItem name={['service', 'type']} initialValue="object" />

                            {[...Array(scount)].map((e, i) => (
                                <Row>
                                    <Col md={4}>
                                        <Form.Item name={['service', 'value', i, 'image']} label={i18n.t(" image")}>
                                            <ImageInput onSelect={url => {
                                                setImages(() => {
                                                    const newImages = simages;
                                                    newImages[i] = url;
                                                    setKey(key + 1);
                                                    return newImages
                                                });
                                            }} />
                                        </Form.Item>
                                        <img className="h-28 pb-4" key={key}
                                            src={simages && simages[i] || landingPageData?.content?.service?.value[i]?.image}
                                            alt="" />
                                    </Col>
                                    <Col md={4}>
                                        <FormInput name={['service', 'value', i, 'title']} label="Card Title"
                                            placeholder="Card Title" />
                                    </Col>

                                    <Col md={3}>
                                        <FormInput name={['service', 'value', i, 'description']}
                                            label="Card Description"
                                            placeholder="Card Description" textArea
                                        />
                                    </Col>
                                    <Col md={1} className={'flex justify-center items-start mt-6 '}>
                                        <div className={'p-2 border bg-red-500 rounded  text-white'}>
                                            <AiFillDelete className={'h-5 w-5'} onClick={() => {
                                                deleteService(i)
                                            }} />
                                        </div>
                                    </Col>

                                </Row>))}
                            <Col className={'flex justify-end'}>
                                <div className={'px-3 py-2 rounded bg-main text-black cursor-pointer'}
                                    onClick={() => setScount(scount + 1)}>Add Another
                                </div>
                            </Col>
                        </Card>

                    </Row>
                </Card>


                <div className='flex items-center gap-5'>
                    <Button>Submit</Button>
                    <div className="text-center md:ml-20">
                        {bikeService === true && <div className="-space-y-4">
                            <p className="">
                                <ScaleLoader size={50} className='' color="#36d7b7" />
                            </p>
                        </div>}
                    </div>
                </div>
            </Form>
        </section>
    );
};
ServiceTemplate.layout = AdminLayout;
export default ServiceTemplate;





