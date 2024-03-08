import AdminLayout from "../../../../layouts/admin";
import PageTitle from "../../../../components/common/page-title";
import {Form, Tabs} from "antd";
import {Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useI18n} from "../../../../contexts/i18n";
import {useFetch} from "../../../../helpers/hooks";
import {
    fetchAllCategoryService, fetchSettings
} from "../../../../helpers/backend_helper";
import {Collapse} from 'antd';
const {Panel} = Collapse;
import ServiceTemplate from "./service_template";

const Index = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [services, getCategories] = useFetch(fetchAllCategoryService);
    const [serviceLIst, setServiceLIst] = useState([]);
    const [active, setActive] = useState({})

    useEffect(() => {
        let array = []
        let temp = services?.map((service, i) => {

            let name = service.name
            service.services.map((indivisual) => {
                array.push({title: (convertString(name + ' ' + indivisual.name)), page_name: name + indivisual.name})
            })
        })
        setServiceLIst(array)
    }, [services]);

    useEffect(() => {
        if (serviceLIst.length > 0) {
            setActive({title: serviceLIst[0].title, page_name: serviceLIst[0].page_name, key: 0})
        }
    }, [serviceLIst]);

    return (<>
        <PageTitle title="Services" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]}/>
        <Row>
            <Col md={3}>
                <div className="bg-white rounded overflow-hidden shadow-sm">
                    {serviceLIst?.map((option, index) => (<div
                        onClick={() => setActive({title: option.title, page_name: option.page_name, key: index})}
                        className={`px-4 py-2 text-sm ${active.key === index ? 'bg-twPrimary' : ''}`}
                        role="button" key={index}>
                        {i18n.t(option.title)}
                    </div>))}
                </div>
            </Col>
            <Col md={9}>
                <ServiceTemplate title={active.title} page_name={active.page_name} key={active.key}/>
            </Col>
        </Row>
    </>)
}

Index.layout = AdminLayout
export default Index

function convertString(str) {
    const words = str.split(" "); // split the string into an array of words
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)); // capitalize each word
    const output = capitalizedWords.join(" -> "); // combine the capitalized words with arrows
    return output; // return the converted string
}