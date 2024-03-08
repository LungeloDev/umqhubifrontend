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

const UserKnowledgeBase = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [form1] = Form.useForm()
    const [knowledgeBase, getknowledgeBase] = useFetch(fetchPage, {pages: 'knowledge_base'}, false);
    const [languages] = useFetch(fetchLanguages);
    const [language, setLanguage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        form.resetFields();
        form1.resetFields();
        form1.setFieldsValue(knowledgeBase?.content?.header?.value || [])
    }, [knowledgeBase]);

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
            getknowledgeBase({lang: language})
        }
    }, [language])

    const onFinish = async (values) => {
        if (isEdit) {
            let data = knowledgeBase?.content?.knowledgeBase?.value || [];
            data[values._id] = values;
            const payload = {
                title: "Knowledge Base Page", page: "knowledge_base", content: {
                    knowledgeBase: {
                        type: "object", name: 'knowledgeBase', value: data, lang: language
                    }
                }
            };
            return useAction(postPage, payload, () => {
                getknowledgeBase()
                setIsModalVisible(false);
            })
        } else {
            let data = knowledgeBase?.content?.knowledgeBase?.value || [];
            data.push(values);
            const payload = {
                title: "Knowledge Base Page", page: "knowledge_base", content: {
                    knowledgeBase: {
                        type: "object", name: 'knowledgeBase', value: data, lang: language
                    }
                }
            };
            return useAction(postPage, payload, () => {
                getknowledgeBase()
                setIsModalVisible(false);
            })
        }
    }

    const onHeaderFinish = async (values) => {
        const payload = {
            title: "Knowledge Base Page", page: "knowledge_base", content: {
                header: {
                    type: "object", name: 'knowledgeBase', value: values, lang: language
                }
            }
        }
        return useAction(postPage, payload, () => {
            getknowledgeBase()
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }
    let action = (
        <div className={'flex justify-end space-x-8'}>
            {languages?.map((d, index) => (
                    <button key={index}
                            className={`px-4 py-2 rounded bg-main2 ${language === d.code ? 'bg-[#FFE57E]' : ''}`}
                            onClick={() => setLanguage(d.code)}>{d.name}
                    </button>
                )
            )}
            <Button
                className="mr-2"
                onClick={() => {
                    form.resetFields();
                    setIsModalVisible(true);
                }}>
                Add Knowledge Base
            </Button>
        </div>
    )
    let columns = [
        {
            dataField: 'question',
            text: 'Questions',
            formatter: question => <span className='capitalize'>{question}</span>
        },
        {
            dataField: 'answer',
            text: 'Answer',
            formatter: answer => answer.length > 50 ? <span className='capitalize'>{answer?.slice(0, 50)}...</span> :
                <span className='capitalize'>{answer}</span>
        }
    ];

    return (
        <section>
            <div className='card_container'>
                <PageTitle title="Knowledge Base"/>
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
                    columns={columns}
                    data={knowledgeBase?.content?.knowledgeBase?.value?.map((d, index) => ({...d, _id: index}))}
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
                    afterActions={({_id}) => (
                        <button className="btn btn-outline-danger btn-sm focus:shadow-none me-2" title="Delete"
                            onClick={async () => {
                                let data = (knowledgeBase?.content?.knowledgeBase?.value || [])
                                data.splice(_id, 1)
                                await useActionConfirm(postPage, {
                                    title: "Knowledge Base Page", page: "knowledge_base", content: {
                                        knowledgeBase: {
                                            type: "object", name: 'knowledgeBase', value: data, lang: language
                                        }
                                    }
                                }, () => {
                                    getknowledgeBase()
                                }, 'Are you sure you want to delete this item?', 'Yes, Delete', i18n.t)
                            }}
                        >
                            <FaTrashAlt />
                        </button>)
                    }
                    onReload={getknowledgeBase}
                />
            </div>

            {/* status updated modal */}
            <Modal title={`Knowledge Base Details`} visible={isModalVisible} onCancel={handleCancel} destroyOnClose
                footer={null}
                width={569}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout='vertical'
                >
                    <HiddenFormItem name='_id' initialValue={''} />
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
                    <Button>{isEdit ? "Update Knowledge Base" : "Add Knowledge Base"}</Button>
                </Form>
            </Modal>
        </section>);
};
UserKnowledgeBase.layout = AdminLayout;
export default UserKnowledgeBase;
