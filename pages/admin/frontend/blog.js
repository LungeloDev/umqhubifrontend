import {Form, Modal} from 'antd';
import React, {useState} from 'react';
import {useEffect} from 'react';
import Button from '../../../components/common/button';
import Card from '../../../components/common/card';
import Table from '../../../components/common/table';
import FormInput, {HiddenFormItem} from '../../../components/form/input';
import {
    fetchPage,
    fetchLanguages,
    postPage,
    fetchBlogs,
    postBlog,
    delBlog
} from '../../../helpers/backend_helper';
import {useAction, useFetch} from '../../../helpers/hooks';
import AdminLayout from '../../../layouts/admin';
import {useI18n} from "../../../contexts/i18n";

import ImageInput from "../../../components/form/image";
import FormMultiTextSelect from "../../../components/form/multiselect";
import TextEditor from "../../../components/form/editor";
import PageTitle from "../../../components/common/page-title";
import {awsFileUpload} from "../../../components/common/fileUploadAWS";


const UserFaq = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [form1] = Form.useForm()

    const [languages] = useFetch(fetchLanguages);
    const [language, setLanguage] = useState(null);

    const [blog, getBlog] = useFetch(fetchPage, {pages: 'blog'}, false);
    const [blogs, getBlogs] = useFetch(fetchBlogs, {type: 'blog'}, false);

    const [key, setKey] = useState(0)
    const [text, setText] = useState('0')
    // modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);


    useEffect(() => {
        form.resetFields();

        form1.setFieldsValue(blog?.content?.header?.value || [])
    }, [blog]);

    useEffect(() => {
        form.resetFields();
        setText(blogs?.details)
    }, [blogs]);

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
            getBlog({lang: language})
            getBlogs({lang: language})
        }
    }, [language])


    const onHeaderFinish = async (values) => {
        const payload = {
            title: "blog", page: "blog", content: {
                header: {
                    type: "object", name: 'blog', value: values, lang: language
                }
            }
        }
        return useAction(postPage, payload, () => {
            getBlog()
            form.resetFields()
            setIsModalVisible(false)
        })
    }


    const handleCancel = () => {
        setIsModalVisible(false);
    }

    let action = (<div className={'p-4 flex justify-end space-x-8'}>
        {languages?.map((d, index) => (<button key={index}
            className={`px-4 py-2 rounded bg-main2 ${language === d.code ? 'bg-[#FFE57E]' : ''}`}
            onClick={() => setLanguage(d.code)}>{d.name}</button>))}
        <Button
            className="mr-2"
            onClick={() => {
                form.resetFields();
                setImages(null)
                setIsModalVisible(true);
            }}>
            Add Blog
        </Button>
    </div>)
    let columns = [
        {
            dataField: 'cover_image', text: 'Cover Image', formatter: (cell, row) => {
                return <img src={cell} alt={row.title} className={'w-16 h-16'} />
            }
        },
        {
            dataField: 'heading', text: 'Heading',
        },
        {
            dataField: 'timeToRead', text: 'Time To Read',
        },
        {
            dataField: 'tags', text: 'Tags',
        }
    ];

    const [images, setImages] = useState(null);

    return (
        <section>
            <div className='card_container'>

                <PageTitle title="Blog Page" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]} />

                <Form
                    form={form1}
                    onFinish={onHeaderFinish}
                    layout='vertical'
                >
                    <HiddenFormItem name='_id' initialValue={''} />
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
                    pagination
                    data={blogs}
                    noActions={false}
                    action={action}
                    indexed={true}
                    shadow={false}
                    onEdit={(data) => {
                        setImages(data.cover_image)
                        form.resetFields();
                        form.setFieldsValue({
                            ...data,
                        });
                        setIsModalVisible(true);
                        setIsEdit(true)
                    }}

                    onReload={getBlogs}
                    onDelete={delBlog}
                />
            </div>

            {/* status updated modal */}
            <Modal title={`Blog Details`} visible={isModalVisible} onCancel={handleCancel} destroyOnClose footer={null}
                width={888}>
                <Form
                    form={form}
                    onFinish={async (values) => {
                        values.lang = language;
                        values.type = 'blog';
                        values.cover_image = await awsFileUpload(values.cover_image);

                        return useAction(postBlog, values, () => {
                            getBlog()
                            getBlogs();
                            setIsModalVisible(false);
                        })
                    }}
                    layout='vertical'
                >
                    <HiddenFormItem name='_id' initialValue={''} />

                    <FormInput
                        label="Heading"
                        name={"heading"}
                        placeholder={'Enter Heading'}
                        required
                    />

                    <Form.Item
                        label="Details"
                        name={"details"}
                        placeholder={'Enter Details'}
                        rules={[
                            {required: true, message: `Please provide details`},
                        ]}
                        required
                    >
                        <TextEditor key={key} />
                    </Form.Item>

                    <Form.Item
                        name={'cover_image'}
                        label={i18n.t("Cover Image")}
                        rules={[
                            {required: true, message: `Please provide image`},
                        ]}
                    >
                        <ImageInput onSelect={(url) => {
                            setImages(url);
                        }}
                        />
                    </Form.Item>
                    <img className="h-28 pb-4" src={images} alt="" />

                    <FormInput
                        required
                        label="TimeToRead"
                        name={"timeToRead"}
                        placeholder={'Enter timeToRead'}
                    />

                    <FormMultiTextSelect
                        required
                        label="Tags"
                        name={"tags"}
                        placeholder={'Enter timeToRead'}
                    />

                    <Button>{isEdit ? "Update Blog" : "Add Blog"}</Button>
                </Form>
            </Modal>
        </section>
    );
};

UserFaq.layout = AdminLayout;
export default UserFaq;