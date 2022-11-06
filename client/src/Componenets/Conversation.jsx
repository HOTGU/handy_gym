import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Avatar from "../Componenets/Avatar";
import { getProApi, getUserApi } from "../api";

function LoadingUser() {
    return (
        <LoadingWrapper>
            <div className="loading__avatar"></div>
            <div className="loading__text"></div>
        </LoadingWrapper>
    );
}

const LoadingWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    & .loading__avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: ${(props) => props.theme.hoverColor};
    }
    & .loading__text {
        width: 100px;
        padding: 10px;
        border-radius: 3px;
        background-color: ${(props) => props.theme.hoverColor};
    }
`;

function User({ user, isPro }) {
    return (
        <UserWrapper>
            <Avatar src={user?.avatar} width="40px" height="40px" click={true} />
            <div>
                {isPro ? user?.name : user?.nickname}
                {isPro && <span className="pro-btn">프로</span>}
            </div>
        </UserWrapper>
    );
}

const UserWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    border-bottom: 1px dotted ${(props) => props.theme.borderColor};
    div {
        font-size: 18px;
        display: flex;
        align-items: flex-end;
    }
    .pro-btn {
        margin-left: 3px;
        font-size: 10px;
        padding: 2px 3px;
        background-color: ${(props) => props.theme.accentColor};
        color: ${(props) => props.theme.colors.white};
        border-radius: 5px;
    }
`;

function Conversation({ conversation, currentUser, currentChat }) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [isPro, setIsPro] = useState(false);
    useEffect(() => {
        setLoading(true);
        const otherUserId = conversation.users.find((user) => user !== currentUser._id);

        const proUser = conversation.pro.userId;
        const proId = conversation.pro.proId;

        const getPro = async () => {
            try {
                const res = await getProApi(proId);
                setUser(res.data);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
            setIsPro(true);
        };
        const getUser = async () => {
            try {
                const res = await getUserApi(otherUserId);
                setUser(res.data);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
            setIsPro(false);
        };

        if (otherUserId === proUser) {
            getPro();
        } else {
            getUser();
        }
    }, [conversation, currentUser]);

    return (
        <>
            {loading ? (
                <LoadingUser />
            ) : (
                <Wrapper
                    className={currentChat._id === conversation._id && "current__chat"}
                >
                    <User user={user} isPro={isPro} />
                </Wrapper>
            )}
        </>
    );
}

const Wrapper = styled.div`
    &.current__chat {
        background-color: ${(props) => props.theme.hoverColor};
        /* color: ${(props) => props.theme.colors.white}; */
        &:hover {
            cursor: default;
            /* background-color: ${(props) => props.theme.colors.blue};
            color: ${(props) => props.theme.colors.white}; */
        }
    }
    &:hover {
        cursor: pointer;
        background-color: ${(props) => props.theme.hoverColor};
    }
`;

export default Conversation;
