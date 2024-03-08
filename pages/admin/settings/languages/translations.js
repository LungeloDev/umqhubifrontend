import React, {Fragment, useEffect, useState} from "react";
import AdminLayout from "../../../../layouts/admin";
import {useAction, useActionConfirm, useFetch} from "../../../../helpers/hooks";
import {
    fetchTranslations, postTranslations,
} from "../../../../helpers/backend_helper";
import {useI18n} from "../../../../contexts/i18n";
import {translations} from "../../../../helpers/translations";
import {Form} from "antd";
import Button from "../../../../components/common/button";
import PageTitle from "../../../../components/common/page-title";


const Translation = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [languages, getLanguages] = useFetch(fetchTranslations);

    useEffect(() => {
        if (languages?.length > 0) {
            form.setFieldsValue(languages?.filter(d => d.flag !== 'US').reduce((acc, lang) => {
                acc[lang._id] = lang.translation
                return acc
            }, {}))
        }
    }, [languages]);


    return (<>
        <PageTitle title={!!i18n && i18n?.t("Translations")} />
        <div className="bg-white p-4 rounded-sm shadow-sm overflow-x-auto" >
            <div className="overflow-x-auto">
                <Form form={form} onFinish={values => {
                    return useAction(postTranslations, values, () => {
                        getLanguages()
                    })
                }}>
                    <table className="table-auto w-full mb-2">
                        <thead className="text-xs font-semibold uppercase bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-2 whitespace-nowrap">
                                <div className="font-semibold text-left">English</div>
                            </th>
                            {languages?.filter(d => d.flag !== 'US').map((language, index) => (
                                <th className="p-2 whitespace-nowrap" key={index}>
                                    <div className="font-semibold text-left">{language?.name}</div>
                                </th>))}
                        </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                        {translations()?.map((translation, index) => (<tr>
                            <td className="p-2 whitespace-nowrap text-gray-500">{translation}</td>
                            {languages?.filter(d => d.flag !== 'US').map((language, index) => (
                                <th className="p-2 whitespace-nowrap" key={index}>
                                    <div className="font-semibold text-left">
                                        <Form.Item className="mb-0" name={[language._id, translation]} defa>
                                            <input
                                                className="hover:outline-none focus:outline-none hover:border-blue-600"
                                                placeholder="Write Translation"/>
                                        </Form.Item>
                                    </div>
                                </th>))}
                        </tr>))}
                        </tbody>
                    </table>
                    <Button>Submit</Button>
                </Form>
            </div>
        </div>

    </>);
};

Translation.layout = AdminLayout;
export default Translation;




