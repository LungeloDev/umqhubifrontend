import {Form} from 'antd';
import React, {useEffect, useState} from 'react';
import {Col, Row} from 'react-bootstrap';
import Button from '../../../../components/common/button';
import Card from '../../../../components/common/card';
import FormInput, {HiddenFormItem} from '../../../../components/form/input';
import {useI18n} from '../../../../contexts/i18n';
import {fetchPage, fetchLanguages, postPage} from '../../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";
import TextEditor from "../../../../components/form/editor";
import PageTitle from "../../../../components/common/page-title";


const PageTemplate = ({title, page_name}) => {
    const i18n = useI18n()
    const [form] = Form.useForm()

    const [key, setKey] = useState({});
    const [text, setText] = useState('');

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
            getLandingPageData({lang: language})
        }
    }, [language])

    useEffect(() => {
        if (landingPageData) {
            setText(landingPageData?.content?.page?.value?.content)
            form.resetFields();
            setKey(key + 1)
            form.setFieldsValue({
                ...landingPageData.content,
            })

            setScount(landingPageData?.content?.page?.value?.length || 1);
        }
    }, [landingPageData])

    const onFinish = async (values) => {
        Object.keys(values).forEach(key => {
            values[key]["lang"] = language;
        })
        values = {title: title, page: page_name, content: values}
        return useAction(postPage, values, () => {
            getLandingPageData()
        })
    }

    const [scount, setScount] = useState(1);


    return (<section>
        <PageTitle title={title} breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]}/>
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
            <Card className="shadow-none border rounded-md mt-3" title={'Custom Page'}>
                <Row>
                    <HiddenFormItem name={['page', 'type']} initialValue="object"/>
                    <FormInput
                        name={['page', 'value', 'title']} label="Title"
                        placeholder="Title"/>
                    <FormInput
                        name={['page', 'value', 'subtitle']} label="Subtitle"
                        placeholder="Subtitle"/>

                    <Form.Item name={['page', 'value', 'content']}
                               initialValue={text}>
                        <TextEditor key={key}/>
                    </Form.Item>
                </Row>
            </Card>
            <div className='flex items-center gap-5'>
                <Button>Submit</Button>
            </div>
        </Form>
    </section>);
};
PageTemplate.layout = AdminLayout;
export default PageTemplate;





