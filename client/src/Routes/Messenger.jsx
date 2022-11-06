import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { io } from "socket.io-client";

import {
    addMessageApi,
    getConversationApi,
    getMessageApi,
    getProApi,
    getUserApi,
} from "../api";
import { isAuthAtom } from "../atoms/isAuthAtom";
import Conversation from "../Componenets/Conversation";
import Loader from "../Componenets/Loader";
import Message from "../Componenets/Message";
import Avatar from "../Componenets/Avatar";
import { useRef } from "react";

function ProConversations() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState("");
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();
    const [conversationLoading, setConversationLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [conversationUser, setConversationUser] = useState({
        isPro: false,
        data: null,
    });
    const { user } = useRecoilValue(isAuthAtom);

    useEffect(() => {
        socket.current = io("http://localhost:5000");
        socket.current.on("receiveMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.users.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", user._id);
    }, [user]);

    useEffect(() => {
        const fetchConversations = async () => {
            setConversationLoading(true);
            const res = await getConversationApi();
            setConversations(res.data);
            setConversationLoading(false);
        };
        fetchConversations();
    }, [user._id]);

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            const res = await getMessageApi(currentChat._id);
            setMessages(res.data);
            setLoading(false);
        };
        const getOtherUserInfo = async () => {
            setLoading(true);
            const otherUserId = currentChat.users.find((u) => u !== user._id);
            const proUser = currentChat.pro.userId;
            const proId = currentChat.pro.proId;
            if (otherUserId === proUser) {
                const res = await getProApi(proId);
                setConversationUser({
                    isPro: true,
                    data: res.data,
                });
            } else {
                const res = await getUserApi(otherUserId);
                setConversationUser({
                    isPro: false,
                    data: res.data,
                });
            }
            setLoading(false);
        };
        getMessages();
        if (currentChat) {
            getOtherUserInfo();
        }
    }, [currentChat, user._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            conversationId: currentChat._id,
            sender: user._id,
            text: newMessage,
        };
        const receiverId = currentChat.users.find((u) => u !== user._id);

        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        });

        try {
            const res = await addMessageApi(message);
            setMessages([...messages, res.data]);
        } catch (error) {
            console.log(error);
        }
        setNewMessage("");
    };

    useEffect(() => {}, []);

    return (
        <Container>
            <Item>
                {conversationLoading ? (
                    <div className="loading__wrapper">
                        <Loader isCenter={false} width="40px" height="40px" />
                    </div>
                ) : (
                    <>
                        {conversations?.map((c) => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversation
                                    conversation={c}
                                    currentUser={user}
                                    currentChat={currentChat}
                                />
                            </div>
                        ))}
                    </>
                )}
            </Item>
            <Item>
                {currentChat ? (
                    <>
                        {loading ? (
                            <div className="loading__wrapper">
                                <Loader isCenter={false} width="40px" height="40px" />
                            </div>
                        ) : (
                            <MessageWrapper>
                                <MessageTop>
                                    <Avatar
                                        src={conversationUser?.data?.avatar}
                                        width="80px"
                                        height="80px"
                                    />
                                    <span>
                                        {conversationUser?.isPro ? (
                                            <>
                                                {conversationUser?.data?.name}
                                                <div className="pro__btn">프로</div>
                                            </>
                                        ) : (
                                            <>{conversationUser?.data?.nickname}</>
                                        )}
                                    </span>
                                </MessageTop>
                                <MessageMiddle>
                                    {messages.map((m) => (
                                        <Message
                                            message={m}
                                            own={m.sender === user._id}
                                        />
                                    ))}
                                </MessageMiddle>
                                <MessageBottom>
                                    <textarea
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                    ></textarea>
                                    <button onClick={handleSubmit}>보내기</button>
                                </MessageBottom>
                            </MessageWrapper>
                        )}
                    </>
                ) : (
                    <div className="no-conversation__text">
                        쪽지를 보시려면 상대방을 선택해주세요
                    </div>
                )}
            </Item>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    width: 100%;
    max-width: 1100px;
    margin: 10px auto;
    height: calc(100vh - ${(props) => props.theme.navbarHeight} - 20px);
    border: 1px solid ${(props) => props.theme.borderColor};
`;
const Item = styled.div`
    overflow: hidden;
    height: 100%;
    background-color: ${(props) => props.theme.inputColor};
    .loading__wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }
    &:first-child {
        width: 25%;
        border-right: 1px solid ${(props) => props.theme.borderColor};
    }
    &:last-child {
        width: 75%;
        position: relative;
        .no-conversation__text {
            position: absolute;
            font-size: 40px;
            color: ${(props) => props.theme.hoverColor};
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            cursor: default;
            width: 100%;
            text-align: center;
        }
    }
`;

const MessageWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
`;

const MessageTop = styled.div`
    height: 140px;
    background-color: ${(props) => props.theme.inputColor};
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    span {
        margin-left: 15px;
        font-size: 24px;
        font-weight: 700;
        display: flex;
        align-items: center;
        .pro__btn {
            margin-left: 5px;
            padding: 2px 3px;
            border-radius: 5px;
            background-color: ${(props) => props.theme.accentColor};
            color: ${(props) => props.theme.colors.white};
            font-size: 12px;
        }
    }
`;

const MessageMiddle = styled.div`
    height: 100%;
    overflow-y: scroll;
    padding: 0 20px 20px 20px;
    &::-webkit-scrollbar {
        width: 16px;
        height: 13px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: ${(props) => props.theme.borderColor};
    }
`;

const MessageBottom = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    textarea {
        width: 50%;
        height: 60px;
        padding: 10px;
        resize: none;
        outline: none;
        background-color: ${(props) => props.theme.inputColor};
        color: ${(props) => props.theme.textColor};
        border: 1px solid ${(props) => props.theme.hoverColor};
    }
    button {
        height: 60px;
        cursor: pointer;
        margin-left: 10px;
        background-color: ${(props) => props.theme.inputColor};
        color: ${(props) => props.theme.textColor};
        border: 1px solid ${(props) => props.theme.hoverColor};
    }
`;

export default ProConversations;
