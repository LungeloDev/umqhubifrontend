import {Form, Modal} from 'antd';
import React, {useState} from 'react';
import {useEffect} from 'react';
import Button from '../../../components/common/button';
import Card from '../../../components/common/card';
import FormInput, {HiddenFormItem} from '../../../components/form/input';
import {
    fetchPage, fetchLanguages, postPage
} from '../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../helpers/hooks';
import AdminLayout from '../../../layouts/admin';
import {useI18n} from "../../../contexts/i18n";
import TextEditor from "../../../components/form/editor";
import PageTitle from "../../../components/common/page-title";

const TermsConditions = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()

    const [TermsConditions, getTermsConditions] = useFetch(fetchPage, {pages: 'help_and_support'}, false);
    const [languages] = useFetch(fetchLanguages);
    const [language, setLanguage] = useState(null);

    const [key, setKey] = useState(0)


    useEffect(() => {
        form.resetFields();
        setKey(key + 1)
        form.setFieldsValue(TermsConditions?.content?.terms_conditions?.value)
    }, [TermsConditions])

    useEffect(() => {
        setKey(key + 1)
        if (!!language) {
            getTermsConditions({lang: language})
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
            title: "Help and Support", page: "help_and_support", content: {
                terms_conditions: {
                    type: "object", name: 'help_and_support', value: values, lang: language
                }
            }
        };
        return useAction(postPage, payload, () => {
            getTermsConditions()
        })
    }


    return (<section>

        <div className='card_container'>

            <PageTitle title="Help and Support" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]}/>

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
                        initialValue={TermsConditions?.content?.terms_conditions?.value?.title}
                    />
                    <FormInput
                        label="Subtitle"
                        name={"subtitle"}
                        required
                        textArea
                        initialValue={TermsConditions?.content?.terms_conditions?.value?.subtitle}

                    />
                    <Form.Item name="content" initialValue={TermsConditions?.content?.terms_conditions?.value?.content}>
                        <TextEditor key={key}/>
                    </Form.Item>
                    <Button>Save</Button>
                </Card>
            </Form>

        </div>


    </section>);
};

TermsConditions.layout = AdminLayout;
export default TermsConditions;