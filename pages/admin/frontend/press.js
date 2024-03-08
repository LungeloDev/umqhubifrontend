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
import TextEditor from "../../../components/form/editor";
import {awsFileUpload} from "../../../components/common/fileUploadAWS";


const UserFaq = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [form1] = Form.useForm()
    const [languages] = useFetch(fetchLanguages);
    const [language, setLanguage] = useState(null);
    const [press, getPress] = useFetch(fetchPage, {pages: 'press'}, false);
    const [presses, getPresses] = useFetch(fetchBlogs, {type: 'press'}, false);
    const [key, setKey] = useState(0)
    const [text, setText] = useState('0')
    // modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);


    useEffect(() => {
        form.resetFields();
        form1.setFieldsValue(press?.content?.header?.value || [])
    }, [press]);

    useEffect(() => {
        form.resetFields();
        setText(presses?.details)
    }, [presses]);

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
            getPress({lang: language})
            getPresses({lang: language})
        }
    }, [language])


    const onHeaderFinish = async (values) => {
        const payload = {
            title: 'press', page: 'press', content: {
                header: {
                    type: "object", name: 'press', value: values, lang: language
                }
            }
        }
        return useAction(postPage, payload, () => {
            getPress()
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
            Add Press
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
    ];

    const [images, setImages] = useState(null);


    return (<section>
        <div className='card_container'>
            <div
                className='h-16 border bg-white flex items-center justify-center text-[18px] font-semibold rounded-md'>
                <h1 className=''>Press Page</h1>
            </div>

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
                data={presses}
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

                onReload={getPresses}
                onDelete={delBlog}
            />
        </div>

        {/* status updated modal */}
        <Modal title={`Press Details`} visible={isModalVisible} onCancel={handleCancel} destroyOnClose footer={null}
            width={569}>
            <Form
                form={form}
                onFinish={async (values) => {
                    values.lang = language;
                    values.type = 'press';
                    values.cover_image = await awsFileUpload(values.cover_image);

                    return useAction(postBlog, values, () => {
                        getPress()
                        getPresses();
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
                <Form.Item label="Details" name={"details"} placeholder={'Enter Details'}
                    rules={
                        [
                            {
                                required: true,
                                message: i18n.t("Please provide a description")
                            }
                        ]
                    }
                    initialValue={text}>
                    <TextEditor key={key} required />
                </Form.Item>
                <Form.Item required name={'cover_image'} label={i18n.t("Cover image")}
                    rules={
                        [
                            {
                                required: true,
                                message: i18n.t("Please upload a cover image")
                            }
                        ]
                    }
                >
                    <ImageInput onSelect={(url) => {
                        setImages(url);
                    }

                    } />
                </Form.Item>
                <img className="h-28 pb-4" src={images} alt="" />
                <Button>{isEdit ? "Update Press" : "Add Press"}</Button>
            </Form>
        </Modal>
    </section>);
};

UserFaq.layout = AdminLayout;
export default UserFaq;