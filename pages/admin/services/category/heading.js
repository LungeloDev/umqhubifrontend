import React, {useEffect} from 'react';
import {Form} from "antd";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import Button from "../../../../components/common/button";
import Card from "../../../../components/common/card";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {fetchCategoryHeading, postCategoryHeading} from "../../../../helpers/backend_helper";

const Heading = () => {
    const [form] = Form.useForm();
    const [heading, setHeading] = useFetch(fetchCategoryHeading);

    useEffect(() => {
        if (heading?._id) {
            form.setFieldsValue({
                ...heading
            })
        }
    }, [heading?._id]);

    return (
        <div>
            <Card className={'shadow-sm'}>
                <h1 className={'mb-3 text-slate-700 font-semibold'}>Service Heading Info</h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={values => {
                        const data = {
                            _id: values._id,
                            section_title: values.section_title,
                            section_sub_title: values.section_sub_title
                        }
                        return useAction(postCategoryHeading, {...data}, async () => {
                            setHeading()
                        })
                    }}
                    initialValues={{
                        remember: true,
                    }}
                >
                    <HiddenFormItem name="_id"/>
                    <FormInput name="section_title" label='Section Title' required
                               placeholder="Set section one title"/>
                    <FormInput name="section_sub_title" label='Section Sub-Title' required
                               placeholder="Set section one sub-title"/>
                    <Button>Submit</Button>
                </Form>
            </Card>
        </div>
    );
};
export default Heading;