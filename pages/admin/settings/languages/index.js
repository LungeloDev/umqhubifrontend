import React, {useState} from "react";
import {Checkbox, Form, Modal, Switch} from "antd";
import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import Table from "../../../../components/common/table";
import Button from "../../../../components/common/button";
import {HiddenFormItem} from "../../../../components/form/input";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {fetchAllLanguages, postLanguage, delLanguage} from "../../../../helpers/backend_helper";
import {useRouter} from "next/router";
import {languages} from "../../../../helpers/utils";
import FormSelect from "../../../../components/form/select";
import {CountryFlagInput} from "../../../../components/form/country";
import Flag from 'react-world-flags'
import {useI18n} from "../../../../contexts/i18n";

const Language = () => {
    const router = useRouter();
    const i18n = useI18n();
    const [languageSettings, getLanguageSettings] = useFetch(fetchAllLanguages);
    const [form] = Form.useForm();
    const [check, setCheck] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (values) => {
        values.name = languages?.find(d => d.value === values.code)?.label;
        return useAction(postLanguage, values, () => {
            getLanguageSettings()
            setOpen(false)
        })
    }

    return (
        <>
            <PageTitle title={!!i18n && i18n?.t("Languages")}/>
            <Table
                title={" "} //empty space string to avoid both title and search bar
                indexed
                data={languageSettings}
                onReload={getLanguageSettings}
                columns={
                    [
                        {
                            dataField: "name",
                            text: "Language",
                            formatter: (d, dd) => <span> <Flag className="h-4 mr-2 inline-block"
                                                               code={dd.flag}/> {d}</span>
                        },
                        {
                            dataField: "active",
                            text: "Status",
                            formatter: (d, dd) => (
                                <Switch
                                    checked={d}
                                    onChange={(value) => handleSubmit({
                                        _id: dd._id, active: value
                                    })}/>
                            )
                        },
                        {
                            dataField: "default",
                            text: "Default",
                            formatter: (d, dd) => (
                                <Switch
                                    checked={d}
                                    onChange={(value) => handleSubmit({
                                        _id: dd._id, default: value
                                    })}/>
                            )
                        },
                    ]
                }
                onDelete={delLanguage}
                onEdit={values => {
                    form.resetFields();
                    form.setFieldsValue(values);
                    setOpen(true);
                }}

                action={
                    <div className={'flex space-x-4'}>
                        <Button
                            onClick={() => router.push('/admin/settings/languages/translations')}> Translation</Button>

                        <Button onClick={() => {
                            form.resetFields();
                            form.setFieldsValue({
                                _id: languageSettings?._id,
                            });
                            setOpen(true)
                        }}> Add Language</Button>
                    </div>
                }
            />

            <Modal visible={open} onCancel={() => setOpen(false)} footer={null} title="Add Language">
                <Form form={form} layout="vertical" className="mt-4" onFinish={(values) => handleSubmit(values)}>
                    <HiddenFormItem name="_id"/>
                    <FormSelect required name="code" label="Language" options={languages} search/>
                    <CountryFlagInput required name="flag" label="Country"/>
                    <Form.Item name="rtl" initialValue={false} valuePropName="checked">
                        <Checkbox> RTL support</Checkbox>
                    </Form.Item>
                    <Button>Submit</Button>
                </Form>
            </Modal>
        </>
    );
};

Language.layout = AdminLayout;
export default Language;


