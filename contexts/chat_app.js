import {createContext, useContext, useEffect, useState} from "react";
import {Manager} from "socket.io-client";
import {ObjectID} from 'bson'
import moment from "moment";

const ChatApp = createContext({})
export const useChatApp = () => useContext(ChatApp)

export const initChatApp = ({socketPath}) => {
    const [socket, setSocket] = useState(undefined)
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState({})
    const [typing, setTyping] = useState({})
    const [key, setKey] = useState(0)
    const [unseen, setUnseen] = useState({})

    const initChatApp = (token, user) => {
        if (!!token && !socket) {
            const manager = new Manager(socketPath, {
                reconnectionDelayMax: 10000,
            });
            let socket = manager.socket("/messages", {
                auth: {
                    token: token
                }
            });
            socket.on('users', data => {
                setUsers(data)
            })
            socket.on('load_message', data => {
                addMessages(data, socket)
                setTyping(typing => {
                    delete typing[data.user]
                    return typing
                })
            })
            socket.on('typing', data => {
                setTyping(typing => ({...typing, [data.user]: moment().add(3, 'seconds')}))
            })
            socket.on('delivered', data => {
                setMessages(messages => {
                    let find = messages[data.user]?.find(d => data?.delivered?.includes(d._id))
                    if (find) {
                        find.delivered = true
                    }
                    return messages
                })
            })
            socket.on('seen', data => {
                setMessages(messages => {
                    messages[data.user].forEach(message => {
                        if (data?.seen?.includes(message._id)) {
                            message.seen = true
                        }
                    })
                    return messages
                })
            })
            setSocket(socket)
        }
    }

    const addMessages = (data, socket) => {
        setMessages(messages => {
            let msgs = Object.values([...(messages[data.user] || []), ...data.messages]?.reduce((acc, d) => ({
                ...acc,
                [d._id]: {
                    ...d,
                    sending: false
                }
            }), {}))?.sort((a, b) => {
                if (moment(a.createdAt).isAfter(b.createdAt)) {
                    return -1
                }
                if (moment(a.createdAt).isBefore(b.createdAt)) {
                    return 1
                }
                return 0
            })
            let findIndex = msgs?.findIndex((d, index) => d.to !== data.user)
            msgs.forEach((d, index) => {
                d.status_visible = (index < findIndex) || findIndex === -1
            })
            let unseen = msgs.filter(message => message.seen === false && message.from === data.user)?.map(d => d._id)
            setUnseen(value => ({
                ...value,
                [data.user]: unseen
            }))
            if (!!socket) {
                let delivered = msgs?.filter(d => {
                    return d.from === data.user && d.delivered === false
                })?.map(d => d._id)
                if (delivered.length > 0) {
                    socket.emit('delivered', {
                        user: data.user,
                        delivered
                    })
                }
            }
            setUsers(users => {
                let user = users.find(d => d._id === data.user)
                if(!!user && msgs?.length > 0) {
                    user.last_message = {
                        createdAt: msgs[0].createdAt,
                        message: msgs[0].message
                    }
                }
                return users?.sort((a, b) => {
                    if (!!a.last_message && !!b.last_message) {
                        if (moment(a.last_message.createdAt).isAfter(b.last_message.createdAt)) {
                            return -1
                        }
                        if (moment(a.last_message.createdAt).isBefore(b.last_message.createdAt)) {
                            return 1
                        }
                    }
                    return 0
                })
            })
            return {
                ...messages,
                [data.user]: msgs
            }
        })
    }


    useEffect(() => {
        window.setInterval(function () {
            setKey(key => key + 1)
        }, 3000);
    }, [])

    useEffect(() => {
        setTyping(value => {
            Object.keys(value).forEach(key => {
                if (moment().isSameOrBefore(value[key])) {
                    delete value[key]
                }
            })
            return value
        })
    }, [key])

    const sendMessage = (from, user, message) => {
        if (!!socket) {
            let _id = new ObjectID()
            addMessages({
                user,
                messages: [{
                    _id,
                    from: from,
                    to: user,
                    message,
                    sending: true
                }]
            })
            socket.emit("send", {
                _id,
                user,
                message
            });
        }
    }

    const loadMessage = user => {
        if (!!socket) {
            socket.emit("load_message", {
                user,
            });
        }
    }


    const seenMessages = _id => {
        if (unseen[_id]?.length > 0) {
            socket.emit('seen', {
                user: _id,
                seen: unseen[_id]
            })
            delete unseen[_id]
        }
    }

    const onTyping = (user, value) => {
        if (!!socket) {
            socket.emit("typing", {
                user: user
            });
        }
    }

    return {initChatApp, onTyping, sendMessage, loadMessage, seenMessages, messages, typing, users}
}
export default ChatApp