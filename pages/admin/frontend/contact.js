import React, {useEffect, useState} from 'react';
import Card from '../../../components/common/card';
import {useI18n} from '../../../contexts/i18n';
import {fetchPage, fetchLanguages, postPage} from '../../../helpers/backend_helper';
import {Col, Form, Row} from 'antd';
import {AiOutlineStar} from 'react-icons/ai';
import {FaPlus} from 'react-icons/fa';
import {FiTrash} from 'react-icons/fi';
import Button from '../../../components/common/button';
import FormInput, {HiddenFormItem} from '../../../components/form/input';
import {useAction, useFetch} from '../../../helpers/hooks';
import AdminLayout from '../../../layouts/admin';
import PageTitle from "../../../components/common/page-title";


const ContactInformation = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()

    const [contactPage, getContactPage] = useFetch(fetchPage, {pages: 'contact_page'}, false);
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
            getContactPage({lang: language})
        }
    }, [language])


    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(contactPage?.content?.contact_page?.value || [])
    }, [contactPage])


    const onFinish = async (values) => {
        const payload = {
            title: "Contact Page", page: "contact_page", content: {
                contact_page: {
                    type: "object", name: 'contact_page', value: values, lang: language
                }
            }
        };

        return useAction(postPage, payload, () => {
            getContactPage()
        })
    }


    return (<section>
        <PageTitle title="Contact Page" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]}/>
        <div className={'mt-4 flex justify-end items-center space-x-8'}>
            {languages?.map((d, index) => (<button key={index}
                                                   className={`px-4 py-2   rounded bg-main2 ${language === d.code ? 'bg-[#FFE57E]' : ''}`}
                                                   onClick={() => setLanguage(d.code)}>{d.name}</button>))}
        </div>
        <Form
            form={form}
            layout='vertical'
            onFinish={onFinish}
        >
            <HiddenFormItem name={['basic', 'type']} initialValue="object"/>

            <Card className='shadow-sm mt-4'>
                <p className='mb-2 flex items-center gap-2'>
                    <AiOutlineStar className='text-main'/> {i18n.t("Email Address")}
                </p>

                <HiddenFormItem name={['email', 'type']} initialValue="object"/>
                <Form.List name={['email', 'value']}>
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name}) => (<Row key={key} className="mb-1">
                            <Col xs={10}>
                                <FormInput name={name} placeholder="Input email address"
                                           required/>
                            </Col>
                            <Col xs={2} className="ml-4">
                                <FiTrash onClick={() => remove(name)} className="text-danger mt-2"
                                         role="button" size={18} title="Remove this field"/>
                            </Col>
                        </Row>))}
                        <div className=''>
                                        <span type="button"
                                              className='bg-main rounded-full shadow-md text-white hover:cursor-pointer hover:shadow-lg p-2'
                                              onClick={() => add()} title="Add Email">
                                            <FaPlus/>
                                        </span>
                        </div>
                    </>)}
                </Form.List>


                <p className='mb-2 mt-3 flex items-center gap-2'>
                    < AiOutlineStar className='text-main'/> {i18n.t("Phone Number")}
                </p>

                <HiddenFormItem name={['phone', 'type']} initialValue="object"/>
                <Form.List name={['phone', 'value']}>
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name}) => (<Row key={key} className="mb-1">
                            <Col xs={10}>
                                <FormInput name={name} placeholder="Input phone number"
                                           required/>
                            </Col>
                            <Col xs={2} className="ml-4">
                                <FiTrash onClick={() => remove(name)} className="text-danger mt-2"
                                         role="button" size={18} title="Remove this field"/>
                            </Col>
                        </Row>))}
                        <div className=''>
                                        <span type="button"
                                              className='bg-main rounded-full shadow-md text-white hover:cursor-pointer hover:shadow-lg p-2'
                                              onClick={() => add()} title="Add Phone">
                                            <FaPlus/>
                                        </span>
                        </div>
                    </>)}
                </Form.List>
            </Card>

            <Card className='shadow-sm mt-4'>
                <h1 className='text-font_color font-semibold mb-3'>Contact Form Heading</h1>
                <HiddenFormItem name={['contact', 'type']} initialValue="object"/>
                <FormInput
                    label="Contact Form Title"
                    name={["contact", 'value', "title"]}
                    required
                    placeholder={'Enter Contact Form Title'}
                />
                <FormInput
                    label="Contact Form  Subtitle"
                    name={["contact", 'value', "subtitle"]}
                    required
                    placeholder={'Enter Contact Form Subtitle'}
                />
            </Card>

            <Card className='shadow-sm mt-4'>
                <h1 className='text-font_color font-semibold mb-3'>Contact Information</h1>

                <HiddenFormItem name={['map', 'type']} initialValue="object"/>
                <FormInput
                    label="Full Address"

                    name={["map", 'value', "address"]}
                    required
                    placeholder={'Enter Full Address'}
                />
                <FormInput
                    label="State"
                    name={["map", 'value', "state"]}
                    required
                    placeholder={'Enter state'}
                />
                <FormInput
                    label="Zip Code"
                    name={["map", 'value', "zip_code"]}
                    required
                    placeholder={'Enter zip code'}
                />
                <FormInput
                    label="Country"
                    name={["map", 'value', "country"]}
                    required
                    placeholder={'Enter country'}
                />
            </Card>
            <Button>Submit</Button>
        </Form>
    </section>);
};
ContactInformation.layout = AdminLayout;
export default ContactInformation;



