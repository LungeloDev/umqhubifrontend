import { Form } from 'antd';
import React from 'react';
import Card from './card';

const DynamicInputFields = () => {
    return (
        <div>
            <Card title="Variants">
                <Form.List name="variants">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name }) => (
                                <Row key={key} className="mb-2">
                                    <Col xs={6}>
                                        <FormInput name={[name, 'name']} placeholder="Name" required />
                                    </Col>
                                    <Col xs={5}>
                                        <FormInput name={[name, 'quantity']} placeholder="Quantity" required />
                                    </Col>
                                    <Col xs={1}>
                                        <FiTrash onClick={() => remove(name)} className="mt-2.5 text-danger"
                                            role="button" size={18} />
                                    </Col>
                                </Row>
                            ))}
                            <Button type="button" onClick={() => add()}>Add Variant</Button>
                        </>
                    )}
                </Form.List>
            </Card>
        </div>
    );
};

export default DynamicInputFields;