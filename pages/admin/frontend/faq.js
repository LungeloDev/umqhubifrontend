import {Form, Modal} from 'antd';
import React, {useState} from 'react';
import {useEffect} from 'react';
import Button from '../../../components/common/button';
import Card from '../../../components/common/card';
import Table from '../../../components/common/table';
import FormInput, {HiddenFormItem} from '../../../components/form/input';
import {fetchPage, fetchLanguages, postPage} from '../../../helpers/backend_helper';
import {useAction, useActionConfirm, useFetch} from '../../../helpers/hooks';
import AdminLayout from '../../../layouts/admin';
import {useI18n} from "../../../contexts/i18n";
import {FaTrashAlt} from "react-icons/fa";
import PageTitle from "../../../components/common/page-title";

const UserFaq = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [form1] = Form.useForm()
    const [faqs, getFaqs] = useFetch(fetchPage, {pages: 'faq_page'}, false);
    const [languages] = useFetch(fetchLanguages);
    const [language, setLanguage] = useState(null);
    // modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        form.resetFields();
        form1.resetFields();
        form1.setFieldsValue(faqs?.content?.header?.value || [])
    }, [faqs]);

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
            form1.resetFields();
            getFaqs({lang: language})
        }
    }, [language])

    const onFaqUpdateOrPost = async (values) => {
        if(isEdit){
            let data = faqs?.content?.faqs?.value || [];
            data[values._id] = values;
            const payload = {
                title: "Faq Page", page: "faq_page", content: {
                    faqs: {
                        type: "object", name: 'faqs', value: data, lang: language
                    }
                }
            };
            return useAction(postPage, payload, () => {
                getFaqs()
                setIsModalVisible(false);
            })
        }else{
            let data = faqs?.content?.faqs?.value || [];
            data.push(values);
            const payload = {
                title: "Faq Page", page: "faq_page", content: {
                    faqs: {
                        type: "object", name: 'faqs', value: data, lang: language
                    }
                }
            };
            return useAction(postPage, payload, () => {
                getFaqs()
                setIsModalVisible(false);
            })
        }
    }

    const onHeaderFinish = async (values) => {
        const payload = {
            title: "Faq Page", page: "faq_page", content: {
                header: {
                    type: "object", name: 'faqs', value: values, lang: language
                }
            }
        }
        return useAction(postPage, payload, () => {
            getFaqs()
        })
    }


    const handleCancel = () => {
        setIsModalVisible(false);
    }
    let action = (<div className={'flex justify-end space-x-8'}>
        {languages?.map((d, index) => (<button key={index}
                                               className={`px-4 py-2 rounded bg-main2 ${language === d.code ? 'bg-[#FFE57E]' : ''}`}
                                               onClick={() => setLanguage(d.code)}>{d.name}</button>))}
        <Button
            className="mr-2"
            onClick={() => {
                setIsEdit(false)
                form.resetFields();
                setIsModalVisible(true);
            }}>
            Add FAQ
        </Button>
    </div>)
    let columns = [
        {
            dataField: 'question',
            text: 'Questions',
            formatter: question => <span className='capitalize'>{question}</span>
        },
        {
            dataField: 'answer',
            text: 'Answer',
            formatter: answer => <span className='capitalize'>{answer?.slice(0, 50)}...</span>
        }];

    return (
        <section>

            <div className='card_container'>

                <PageTitle title="Faq Page" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]}/>

                <Form
                    form={form1}
                    onFinish={onHeaderFinish}
                    layout='vertical'
                >
                    <HiddenFormItem name='_id' initialValue={''}/>
                    <Card className='shadow-sm mt-4'>
                        <FormInput
                            label="Title"
                            name={"title"}
                            required
                        />
                        <FormInput
                            label="Subtitle"
                            name={"subtitle"}
                            textArea
                            required
                        />
                        <Button>Save</Button>
                    </Card>
                </Form>

                <Table
                    title={'Faq Lists'}
                    columns={columns}
                    data={faqs?.content?.faqs?.value?.map((d, index) => ({...d, _id: index}))}
                    noActions={false}
                    action={action}
                    indexed={true}
                    shadow={false}
                    onEdit={(data) => {
                        form.resetFields();
                        form.setFieldsValue({
                            ...data,
                        });
                        setIsModalVisible(true);
                        setIsEdit(true)
                    }}
                    afterActions={({_id}) => (<button className="btn btn-outline-danger btn-sm focus:shadow-none me-2"
                                                      title="Delete" onClick={async () => {
                        let data = (faqs?.content?.faqs?.value || [])
                        data.splice(_id, 1)
                        await useActionConfirm(postPage, {
                            title: "Faq Page", page: "faq_page", content: {
                                faqs: {
                                    type: "object", name: 'faqs', value: data, lang: language
                                }
                            }
                        }, () => {
                            getFaqs()
                        }, 'Are you sure you want to delete this item?', 'Yes, Delete', i18n.t)
                    }}>
                        <FaTrashAlt/>
                    </button>)}
                    onReload={getFaqs}
                />
            </div>

            {/* status updated modal */}
            <Modal title={`FAQ Details`} visible={isModalVisible} onCancel={handleCancel} destroyOnClose footer={null}
                   width={569}>
                <Form
                    form={form}
                    onFinish={onFaqUpdateOrPost}
                    layout='vertical'
                >
                    <HiddenFormItem name='_id' initialValue={''}/>
                    <FormInput
                        label="Question"
                        name={"question"}
                        placeholder={'Enter Question'}
                        required
                    />
                    <FormInput
                        label="Answer"
                        name={"answer"}
                        textArea
                        placeholder={'Enter Answer'}
                        required
                    />
                    <Button>{isEdit ? "Update FAQ" : "Add FAQ"}</Button>
                </Form>
            </Modal>
        </section>);
};

UserFaq.layout = AdminLayout;
export default UserFaq;
