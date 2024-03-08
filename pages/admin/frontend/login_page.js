import {Form} from 'antd';
import React, {useEffect, useState} from 'react';
import {Col, Row} from 'react-bootstrap';
import {ScaleLoader} from 'react-spinners';
import Button from '../../../components/common/button';
import Card from '../../../components/common/card';
import ImageInput from '../../../components/form/image';
import FormInput, {HiddenFormItem} from '../../../components/form/input';
import {useI18n} from '../../../contexts/i18n';
import {fetchPage, fetchLanguages, postPage} from '../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../helpers/hooks';
import AdminLayout from '../../../layouts/admin';
import PageTitle from "../../../components/common/page-title";
import {awsFileUpload} from "../../../components/common/fileUploadAWS";


const LandingPage = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [loadingData, setLoadingData] = useState(false);
    const [logo, setLogo] = useState(null);
    const [images, setImages] = useState({});
    const [loginPage, getloginPage, {loading, error}] = useFetch(fetchPage, {pages: 'login_page'}, false);
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
            getloginPage({lang: language})
        }
    }, [language])


    useEffect(() => {
        if (loginPage) {
            form.resetFields();
        }
    }, [loginPage])

    const onFinish = async (values) => {
        setLoadingData(true);
        values.login.value.image = await awsFileUpload(values.login?.value?.image);
        setLoadingData(false);
        Object.keys(values).forEach(key => {
            values[key]["lang"] = language;
        })

        if (!loadingData) {
            const payload = {title: "Login Page",type:'object', page: "login_page", content: values}
            return useAction(postPage, payload, () => {
                getloginPage()
            })
        }
    }

    return (
        <section>
            <PageTitle title="Login Page" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]}/>
            <div className={'mt-4 flex justify-end items-center space-x-8'}>
                {languages?.map((d, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2   rounded bg-main2 ${language === d.code ? 'bg-[#FFE57E]' : ''}`}
                        onClick={() => setLanguage(d.code)}>{d.name}
                    </button>))}
            </div>

            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
            >

                <Card className="shadow-none border rounded-md mt-3" title={'Login Page Image'}>
                    <Row>
                        <Col md={12}>
                            <Col md={12}>
                                <HiddenFormItem name={['login', 'type']} initialValue="object" />

                                <Form.Item name={['login', 'value', 'image']} label={i18n.t("Login Page Image")}>
                                    <ImageInput onSelect={(url) => {
                                        setImages(images => ({...images, login_image: url}));
                                    }
                                    }/>
                                </Form.Item>
                                <img className="h-28 pb-4"
                                     src={images['login_image'] || loginPage?.content?.login?.value.image} alt=""/>
                            </Col>
                        </Col>
                    </Row>
                </Card>

                <div className='flex items-center gap-5'>
                    <Button>Submit</Button>
                    <div className="text-center md:ml-20">
                        {loadingData === true && <div className="-space-y-4">
                            <p className="">
                                <ScaleLoader size={50} className='' color="#36d7b7"/>
                            </p>
                        </div>}
                    </div>
                </div>
            </Form>

        </section>);
};
LandingPage.layout = AdminLayout;
export default LandingPage;





