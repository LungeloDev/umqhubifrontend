import React, {useEffect, useState} from 'react';
import {FiPhoneCall} from "react-icons/fi";
import {CiLocationArrow1} from "react-icons/ci";
import {Form, message} from "antd";
import FormInput from "../../../components/form/input";
import {fetchOnGoingRide, getChatList, sendTripMessage} from "../../../helpers/backend_helper";
import {io} from "socket.io-client";
import useChatScroll from "../../../components/chatting_scroll";
import Button from "../../../components/common/button";
import {BiMessageRoundedDots} from "react-icons/bi";
import {useRouter} from "next/router";
import DriverLayout from "../../../layouts/driver";

const UserMessage = () => {
    const {back} = useRouter();
    const [form] = Form.useForm();
    const [userInfo, setUserInfo] = useState()
    const [chatMsg, setChatMsg] = useState()
    const [chatMsgAPI, setChatMsgAPI] = useState([])
    const [messages , setMessages] = useState([])
    const ref = useChatScroll(messages)

    async function getMessages (to) {
        const res = await getChatList({to})
        setChatMsgAPI(res?.data)
        setMessages(res?.data)
    }

    useEffect(() =>{
        fetchOnGoingRide().then(res => {
            if(res?.error === false) {
                setUserInfo(res?.data)
            }
        })
    },[])

    const  handleCommunication = () => {
        navigator.clipboard.writeText(userInfo?.user?.phone)
        message.success(`Phone number copied successfully, ${userInfo?.user?.phone}`)
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        let socket = io(process.env.socket_io, {
            auth: {
                token
            }
        });
        socket.on('new_msg_received', (message) => {
            // console.log('new_msg_received:', message);
        });
        socket.on('load_msg', (message) => {
            setChatMsg(message)
            setMessages(message)
        });
    }, [])

    useEffect(()=> {
        if(userInfo?.user?._id) {
            getMessages(userInfo?.user?._id)
        }
    },[userInfo?.user?._id])


    return (
        <div className={''}>
            <div className={'w-full md:w-2/3 p-3 bg-white rounded-lg mx-auto h-[90vh] md:h-[85vh] grid content-between'}>
                <div className={'flex justify-between mb-2'}>
                    <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider flex gap-2 items-center">
                        <BiMessageRoundedDots size={20} className={'mb-[3px]'}/>
                        Send Message to User
                    </h1>
                    <Button className={'text-gray-500'} onClick={async() => await back()}>Back</Button>
                </div>

                {/*image*/}
                <div className={'flex items-center justify-between border-b-2 pb-2 border-gray-100'}>
                    <div className={'flex items-center gap-3'}>
                        <img src={userInfo?.user?.image} alt="rider-image" className={'w-14 h-14 rounded-full p-1 ring'} />
                        <p className={'text-gray-700 font-semibold tracking-wider capitalize'}>{userInfo?.user?.name}</p>
                    </div>

                    <div onClick={handleCommunication} title={'Call to the rider'} className={'w-10 h-10 cursor-pointer rounded-full p-2 ring ring-teal-400 hover:ring-cyan-500 flex items-center justify-center'}>
                        <FiPhoneCall size={20} className={'text-amber-500'} />
                    </div>
                </div>

                {/*messages*/}
                <div className={'h-[60vh] overflow-y-scroll chatting_scrollbar'} ref={ref}>
                    {
                        (chatMsg || chatMsgAPI)?.map((data, i) => {
                            return <div key={data?._id}>
                                {
                                    (userInfo?.driver?._id !== data?.from?._id) ?
                                        <div className="chat chat-start">
                                            <div className="chat-bubble">{data?.message}</div>
                                        </div>
                                        :
                                        <div className="chat chat-end">
                                            <div className="chat-bubble">{data?.message}</div>
                                        </div>
                                }
                            </div>
                        })
                    }
                </div>

                {/*message input*/}
                <div className={'border-t-2 pt-2.5 border-gray-100'}>
                    <Form
                        form={form}
                        onFinish={async values => {
                            const data = {
                                "to": userInfo?.user?._id,
                                "message": values?.message
                            }
                            const res = await sendTripMessage(data);
                            form.resetFields();
                        }}
                    >
                        <div className={'flex gap-3'}>
                            <FormInput className={'w-full'} name={'message'} placeholder={'Send message...'} />
                            <div className={'w-[20%]'}>
                                <button className={'border p-2 h-9 w-9 flex items-center justify-center rounded cursor-pointer ring ring-teal-50 hover:ring-teal-100'}>
                                    <CiLocationArrow1 size={20} className={'text-teal-500'} />
                                </button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

UserMessage.layout = DriverLayout;
export default UserMessage;