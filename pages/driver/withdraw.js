import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, Drawer, Form, Input, Select, Space} from 'antd';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swalAlert from '../../components/common/alert';
import Card from '../../components/common/card';
import Table from '../../components/common/table';
import FormInput from '../../components/form/input';
import {useI18n} from '../../contexts/i18n';
import {useSite} from '../../contexts/site';
import {driverDashboardCards, fetchWithdrawList, paymentGatewayList, postWithdrawReq} from '../../helpers/backend_helper';
import {useFetch} from '../../helpers/hooks';
import DriverLayout from '../../layouts/driver';

const Withdraw = () => {
    const i18n = useI18n();
    const [open, setOpen] = useState(false)
    const {currency_code} = useSite()
    const [withdrawList, getWithdrawList] = useFetch(fetchWithdrawList)
    const [wallet] = useFetch(driverDashboardCards)
    const [items, setItems] = useState();
    const [name, setName] = useState('');
    const inputRef = useRef(null);
    const [form] = Form.useForm()

    useEffect(() => {
        const getData = () => {
            paymentGatewayList().then(async (data) => {
                const activeGateways = await data?.data?.gateways?.map(gateway => gateway?.active && gateway?.name)
                setItems(activeGateways)
            })
        }
        getData()
    }, [])

    //on withdraw request form submit
    const handleWithdrawRequest = async (values) => {
        const {isConfirmed} = await swalAlert.confirm()
        if (isConfirmed) {
            postWithdrawReq(values).then((data) => {
                data?.error === true ? toast.warn(data?.msg)
                    : getWithdrawList();

            })
        }
        form.resetFields()
        setOpen(false)
    }

    //Input:Select
    const onNameChange = (event) => {
        setName(event.target.value);
    };
    const addItem = (e) => {
        e.preventDefault();
        setItems([...items, name || `New item ${index++}`]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    //Table Columns
    const columns = [
        {
            dataField: 'trx_id', text: 'Transaction Id',
            formatter: (_, data) => (<div className=''>{data?.trx_id}</div>)
        },
        {
            dataField: 'payment_accept', text: 'Payment Method',
            formatter: (_, data) => (<div className=''>{data?.payment_accept?.method_name}</div>)
        },
        {
            dataField: 'email', text: 'Withdraw Details',
            formatter: (_, data) => (<div className=''>{data?.payment_accept?.account_details}</div>)
        },
        {
            dataField: 'createdAt', text: 'Request Date',
            formatter: (_, data) => (<div className=''> <span className=''>{moment(data?.createdAt).format("MMM DD, YYYY")}</span></div>)
        },
        {
            dataField: 'createdAt', text: 'Request Time',
            formatter: (_, data) => (<div className=''> <span className=''>{moment(data?.createdAt).format("hh:mm A")}</span></div>)
        },
        {
            dataField: 'amount', text: 'Withdraw Amount',
            formatter: (_, data) => (<div className=''> <span className='text-blue-500'>{`${currency_code ? currency_code : ""} ${data?.amount.toFixed(2)}`}</span></div>)
        },
        {
            dataField: 'rating', text: 'Status',
            formatter: (_, data) => <span
                className={`capitalize ${data?.status?.toLowerCase() === 'completed' && 'text-green-500'} 
                    ${data?.status?.toLowerCase() === 'pending' && 'text-yellow-500'}
                    ${data?.status?.toLowerCase() === 'accepted' && 'text-blue-500'}
                    ${data?.status?.toLowerCase() === 'processing' && 'text-blue-500'}
                    ${data?.status?.toLowerCase() === 'declined' && 'text-red-500'}`
                }
            >
                {data?.status}
            </span>
        },

    ];

    return (
        <>
            {/* withdraw Page */}
            <div>
                <Card>
                    <div className='flex justify-between px-6 items-center'>
                        <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t("Withdraw")}</h1>
                        <button onClick={() => setOpen(true)} className='text-white font-semibold border rounded-lg !bg-twSecondary-shade800 px-4 py-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'>{!!i18n && i18n?.t("Withdraw")}</button>
                    </div>
                </Card>
                <Table
                    indexed
                    pagination
                    columns={columns}
                    title={"Withdraw List"}
                    data={withdrawList}
                    onReload={getWithdrawList}
                    noActions
                    shadow={false}
                />
            </div>

            {/* Drawer  */}
            <Drawer
                visible={open}
                onClose={() => setOpen(false)}
            >

                <Card
                    title={"Make Withdraw Request"}
                >
                    <p className='text-twContent-muted'>Your Wallet Balance: <span className={`${wallet?.remaining_balance <= 0 ? "text-twError" : "text-green-500"}`}>{`${currency_code ? currency_code : ""} ${wallet?.remaining_balance?.toFixed(2) || 0}`}</span></p>

                    <Form
                        layout='vertical'
                        form={form}
                        onFinish={handleWithdrawRequest}
                    >
                        <FormInput
                            type='number'
                            name={"amount"}
                            label={"Amount"}
                            required
                        />
                        <Form.Item
                            name={["payment_accept", "method_name"]}
                            label={"Preferred Payment Method"}
                            rules={[{
                                required: true,
                                message: 'This field is required'
                            }]}
                        >
                            <Select
                                style={{
                                    width: 300,
                                }}
                                placeholder="Payment Method"
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider
                                            style={{
                                                margin: '8px 0',
                                            }}
                                        />
                                        <Space
                                            style={{
                                                padding: '0 8px 4px',
                                            }}
                                        >
                                            <Input
                                                placeholder="Enter preferred gateway"
                                                ref={inputRef}
                                                value={name}
                                                onChange={onNameChange}
                                            />
                                            <Button className='bg-twPrimary hover:bg-twPrimary' type="text" icon={<PlusOutlined />} onClick={addItem}>
                                                Add item
                                            </Button>
                                        </Space>
                                    </>
                                )}
                                options={items?.map((item) => ({
                                    label: item,
                                    value: item,
                                }))}
                            />
                        </Form.Item>
                        <FormInput
                            type='textArea'
                            name={["payment_accept", "account_details"]}
                            label={"Account Details"}
                            required
                        />
                        <button className='bg-twSecondary-shade700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg' type="submit">{!!i18n?.t ? i18n?.t("Submit") : "Submit"}</button>
                    </Form>
                </Card>
            </Drawer>
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

Withdraw.layout = DriverLayout
export default Withdraw;