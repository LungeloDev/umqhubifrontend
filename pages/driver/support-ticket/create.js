import React, {useEffect, useState} from 'react';
import Table from '../../../components/common/table';
import {useAction, useFetch} from "../../../helpers/hooks";
import {
    featchTickets, featchTicketsByUser,
    fetchProfile,
    fetchTicketCategory,
    fetchTicketDepartments,
    fetchTicketTypes,
    getTicketPriorities,
    postTicket,

} from "../../../helpers/backend_helper";
import Router from "next/router";
import FormInput from "../../../components/form/input";
import Button from "../../../components/common/button";
import {useI18n} from "../../../contexts/i18n";
import {Form, Modal, Row, Col} from "antd";
import FormSelect from "../../../components/form/select";
import InputFile, {getUploadImagesUrl} from "../../../components/form/file";
import DriverLayout from "../../../layouts/driver";
import Card from '../../../components/common/card';
import MultipleImageInput from '../../../components/form/multiple_image_input';

const Tickets = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    // modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit] = useState(false);
    const [tickets, getTickets] = useFetch(featchTicketsByUser)
    const [department] = useFetch(fetchTicketDepartments, {active: true})
    const [allCategories] = useFetch(fetchTicketCategory)
    const [allTypes] = useFetch(fetchTicketTypes, {}, false)
    const [ticketPriorities] = useFetch(getTicketPriorities)
    const [categories, getCategories] = useFetch(fetchTicketCategory, {}, false)
    const [types, getTypes] = useFetch(fetchTicketTypes, {}, false)
    const [user] = useFetch(fetchProfile);

    const onFinish = async (values) => {
        values.files = await getUploadImagesUrl(values.files);
        values.created_by = user._id;
        useAction(postTicket, values, (res) => {
            setIsModalVisible(false)
            getTickets()
        });
    }
    return (
        <>
            <Card>
                <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t("Tickets")}</h1>
            </Card>
            <section>
                <div className='card_container'>
                    <Table
                        columns={[
                            {
                                text: 'Tickets No', dataField: '_id'
                            },
                            {
                                text: 'Name', dataField: 'name'
                            },
                            {
                                text: 'Email', dataField: 'email'
                            },
                            {
                                text: 'Subject', dataField: 'subject'
                            },
                            {
                                text: 'Department',
                                dataField: 'department',
                                formatter: (cell) => department?.docs.find(d => d._id === cell)?.name
                            },
                            {
                                text: 'Category',
                                dataField: 'category',
                                formatter: (cell) => allCategories?.docs.find(d => d._id === cell)?.name
                            },
                            {
                                text: 'Type',
                                dataField: 'type',
                                formatter: (cell) => allTypes?.docs.find(d => d._id === cell)?.name
                            },
                            {
                                text: 'Priorities',
                                dataField: 'priorities',
                                formatter: (d) => ticketPriorities?.filter(e => e._id === d)[0].name
                            },
                            {
                                text: 'Assign TO', dataField: 'assigned_to',
                                formatter: (cell) => <div><p>{cell?.name}</p><p>{cell?.email}</p></div>
                            },
                            {
                                text: 'Date',
                                dataField: 'createdAt',
                                formatter: (cell) => new Date(cell).toLocaleDateString()
                            },
                            {
                                text: 'Status',
                                dataField: 'status',
                                formatter: (cell) => cell === 'pending' ?
                                    <div className={'px-2 py-1 rounded-2xl border-2 border-twSecondary-shade700 text-center text-twSecondary-shade700'}>Pending</div> :
                                    cell === 'closed' ?
                                        <div className={'px-2 py-1 rounded-2xl border-2 border-red-500 text-center text-red-500'}>Closed</div> :
                                        <div className={'px-2 py-1 rounded-2xl border-2 border-green-500 text-center text-green-500'}>Open</div>
                            }
                        ]}
                        data={tickets}
                        shadow={false}
                        onView={(data) => {
                            Router.push(`/driver/support-ticket/${data._id}`)
                        }}
                        action={(
                            <Button onClick={() => {
                                setIsModalVisible(true)
                            }}>
                                {!!i18n && i18n?.t("Add Ticket")}
                            </Button>
                        )}
                        onReload={getTickets}
                    />
                </div>

                <Modal title={`Ticket`} visible={isModalVisible} onCancel={() => setIsModalVisible(false)}
                    destroyOnClose
                    footer={null}
                    width={888}>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout='vertical'
                    >
                        <Row>
                            <Col span={24}>
                                <FormInput
                                    label="Name"
                                    name={"name"}
                                    required
                                    placeholder={'Enter Name'}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormInput
                                    label="Email"
                                    name={"email"}
                                    required
                                    placeholder={'Enter Email'}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormInput
                                    label="Subject"
                                    name={"subject"}
                                    required
                                    placeholder={'Enter Subject'}
                                />
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col xs={12} lg={6}>
                                <FormSelect
                                    name="department"
                                    label="Department"
                                    onSelect={(v) => {
                                        form.resetFields(['category', 'type']);
                                        getCategories({parent: v})
                                    }}
                                    required
                                    options={department?.docs} />
                            </Col>

                            <Col xs={12} lg={6}>
                                <FormSelect
                                    name="category"
                                    label="Category"
                                    required
                                    onSelect={(v) => {
                                        form.resetFields(['type']);
                                        getTypes({category: v, active: true})
                                    }}
                                    options={categories?.docs} />
                            </Col>

                            <Col xs={12} lg={6}>
                                <FormSelect
                                    name="type"
                                    label="Type"
                                    options={types?.docs} />
                            </Col>

                            <Col xs={12} lg={6}>
                                <FormSelect
                                    name="priorities"
                                    label="Priorities"
                                    required
                                    options={ticketPriorities} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormInput
                                    label="Write Message"
                                    name={"body"}
                                    required
                                    textArea
                                    placeholder={'Message...'}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <MultipleImageInput max={10} name={['files']} />
                            </Col>
                            <Col span={12} className={'flex justify-end items-center'}>
                                <Button>{isEdit ? "Update Ticket" : "Add Ticket"}</Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </section>
        </>
    );
};
Tickets.layout = DriverLayout;
export default Tickets;