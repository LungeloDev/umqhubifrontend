import {Form, Modal} from 'antd';
import React, {useState} from 'react';
import {useEffect} from 'react';
import Button from '../../../components/common/button';
import Card from '../../../components/common/card';
import FormInput, {HiddenFormItem} from '../../../components/form/input';
import {
    delHeplPage, fetchPage, fetchHeplPage, fetchLanguages, postHelp, postHeplPage, postPage
} from '../../../helpers/backend_helper';
import {useAction, useActionConfirm, useFetch} from '../../../helpers/hooks';
import AdminLayout from '../../../layouts/admin';
import {useI18n} from "../../../contexts/i18n";
import TextEditor from "../../../components/form/editor";
import PageTitle from "../../../components/common/page-title";

const AboutUs = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()

    const [aboutUs, getAboutUs] = useFetch(fetchPage, {pages: 'about_us'}, false);
    const [languages] = useFetch(fetchLanguages);
    const [language, setLanguage] = useState(null);
    const [key, setKey] = useState(0)

    useEffect(() => {
        form.resetFields();
        setKey(key + 1)
        form.setFieldsValue(aboutUs?.content?.about_us?.value)
    }, [aboutUs])

    useEffect(() => {
        setKey(key + 1)
        if (!!language) {
            getAboutUs({lang: language})
        }
    }, [language])

    useEffect(() => {
        languages?.forEach((d) => {
            if (d.default === true) {
                setLanguage(d.code);
            }
        })
    }, [languages])

    const onFinish = async (values) => {
        const payload = {
            title: "About Us Page", page: "about_us", content: {
                about_us: {
                    type: "object", name: 'about_us', value: values, lang: language
                }
            }
        };
        return useAction(postPage, payload, () => {
            getAboutUs()
        })
    }


    return (<section>
        <div className='card_container'>
            <PageTitle title="About Us Page" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]}/>
            <div className={'mt-4 flex justify-end space-x-4'}>

                {languages?.map((d, index) => (<button key={index}
                                                       className={`px-4 py-2 rounded bg-main2 ${language === d.code ? 'bg-[#FFE57E]' : ''}`}
                                                       onClick={() => {
                                                           setLanguage(d.code)
                                                       }}>{d.name}</button>))}
            </div>
            <Form
                form={form}
                onFinish={onFinish}
                layout='vertical'
            >
                <Card className='shadow-sm mt-4'>

                    <FormInput
                        label="Title"
                        name={"title"}
                        required
                        initialValue={aboutUs?.content?.about_us?.value?.title}
                    />
                    <FormInput
                        label="Subtitle"
                        name={"subtitle"}
                        required
                        textArea
                        initialValue={aboutUs?.content?.about_us?.value?.subtitle}

                    />
                    <Form.Item name="content" initialValue={aboutUs?.content?.about_us?.value?.content}>
                        <TextEditor key={key}/>
                    </Form.Item>
                    <Button>Save</Button>
                </Card>
            </Form>
        </div>
    </section>);
};

AboutUs.layout = AdminLayout;
export default AboutUs;