import React, { useEffect, useRef } from "react";
import styled from "styled-components";

function Message({ message, own }) {
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [scrollRef]);

    return (
        <Wrapper ref={scrollRef}>
            <div className={own ? "message own" : "message"}>
                <div className="message__top">
                    <div className="message__text">{message.text}</div>
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin-top: 20px;
    .message {
        display: flex;
        flex-direction: column;
        .message__top {
            display: flex;
        }
    }
    .message__text {
        padding: 15px 20px;
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
        border-bottom-right-radius: 20px;
        box-shadow: ${(props) => props.theme.boxShadow};

        background-color: ${(props) => props.theme.colors.blue};
        color: ${(props) => props.theme.colors.white};
        max-width: 400px;
    }
    .own {
        align-items: flex-end;
        .message__text {
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 0;
            background-color: ${(props) => props.theme.messageColor};
            color: ${(props) => props.theme.textColor};
        }
    }
`;

export default Message;
