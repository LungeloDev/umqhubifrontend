import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Form, Modal, Col, Row, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import {useI18n} from "../../../../contexts/i18n";
import {useAction, useFetch} from "../../../../helpers/hooks";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import Button from "../../../../components/common/button";
import {
    fetchSettings, fetchCustomPage, postPage, delPage
} from '../../../../helpers/backend_helper';
import PageTemplate from "./page_template";
import swalAlert from "../../../../components/common/alert";

const Index = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [editForm] = Form.useForm()
    const [settings, getSettings] = useFetch(fetchSettings)
    const [logo, setLogo] = useState('/img/shops.png')
    const [isEdit, setIsEdit] = useState(false)
    const [pages, getpages] = useFetch(fetchCustomPage);
    const [pagesList, setpagesList] = useState([{}]);
    const [active, setActive] = useState()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        let temp = pages?.map((vData, i) => {
            return {
                title: vData.title, page: vData.page
            }
        })
        setpagesList(temp)
    }, [pages]);

    useEffect(() => {
        if (pagesList?.length > 0) {
            setActive({title: pagesList[0].title, page_name: pagesList[0].page, key: 0})
        }
    }, [pagesList]);

    useEffect(() => {
        if (settings) {
            form.setFieldsValue({
                ...settings, logo: undefined,
            })
            setLogo(settings?.logo || '/img/shops.png')
        }
    }, [settings])


    return (<>
        <PageTitle title="Custom Page" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]}
            key={active?.key} />
        <Row gutter={10}>
            <Col md={6}>
                <div className="bg-white rounded overflow-hidden shadow-sm">
                    <div
                        onClick={() => {
                            form.resetFields()
                            setIsEdit(false)
                            setIsVisible(true)
                        }}
                        className={`px-4 mb-2 py-2 text-sm bg-main text-white  text-center flex justify-center items-center`}
                        role="button">
                        <span className={'text-3xl mr-2 text-black '}>+</span> <p className={'text-black'}>Add New
                            Page</p>
                    </div>

                    {pagesList?.map((option, index) => (<div
                        onClick={() => setActive({title: option.title, page_name: option.page, key: index})}
                        className={`px-4 py-2 text-sm ${active?.key === index ? 'bg-main2 text-white' : ''}`}
                        role="button" key={index}>
                        <Row gutter={8}>
                            <Col span={16}><p className={'text-black'}>{i18n.t(option.title)}</p></Col>
                            <Col span={4}>
                                <button className={'bg-main px-2 py-1 rounded text-center text-twContent transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'} onClick={(data) => {
                                    setIsEdit(true)
                                    form.resetFields();
                                    form.setFieldsValue({
                                        page: option.page, title: option.title,
                                    });
                                    setIsVisible(true);
                                }}>Edit</button>
                            </Col>
                            <Col span={4}><button className={'bg-red-500 px-2 py-1 rounded text-center text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'} onClick={async () => {
                                const is_confirm = await swalAlert.confirm('Delete')
                                if (is_confirm.isConfirmed) {
                                    delPage({page: option.page})
                                    getpages()
                                }
                            }}> Delete</button></Col>
                        </Row>
                    </div>))}
                </div>
            </Col>
            {active?.page_name &&
                <Col md={18} >
                    <PageTemplate title={active?.title} page_name={active?.page_name} key={active?.key} />
                </Col>
            }
        </Row>

        <Modal title={isEdit ? "Update Page" : "Add Page"} visible={isVisible} footer={null} onCancel={() => setIsVisible(false)}>
            <Form
                form={form}
                onFinish={(values) => {
                    if (!isEdit) {
                        values.page = convertToSnakeCase(values.title);
                    }
                    values.type = 'custom';
                    useAction(postPage, values, () => {
                        getpages()
                        setIsVisible(false)
                    })
                }}
                layout='vertical'
            >
                <HiddenFormItem name="page" />
                <FormInput
                    label="Title"
                    name={"title"}
                    required
                    placeholder={'Uniq Title'}
                />
                <Button>{isEdit ? "Update Page" : "Add Page"}</Button>
            </Form>
        </Modal>
    </>)
}

Index.layout = AdminLayout
export default Index

function convertToSnakeCase(str) {// Replace spaces with underscores
    str = str.replace(/\s+/g, '_');
    // Convert to lowercase
    str = str.toLowerCase();
    // If the string starts with "the_", remove "the_"
    if (str.startsWith('the_')) {
        str = str.slice(4);
    }
    return str;
}