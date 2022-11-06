import React, { useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Times } from "@styled-icons/fa-solid";

import useOutsideClick from "../hooks/useOutsideClick";
const modalAni = keyframes`
    0% {
    opacity: 0;
    transform: translateY(600px)
  }
  100% {
    opacity: 1;
    transform: translateY(0)
  }
`;
const CancelEmoji = styled(Times)`
    width: 28px;
    height: 28px;
    position: absolute;
    top: 5px;
    right: 5px;
    color: ${(props) => props.theme.textColor};
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
        opacity: 0.7;
    }
`;

const ModalWrapper = styled.div`
    position: fixed;
    background-color: ${(props) => props.theme.modalColor};
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
`;
const ModalTitle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
`;
const ModalItem = styled.div`
    position: relative;
    width: fit-content;
    height: auto;
    padding: 30px 20px;
    border-radius: 10px;
    z-index: 99;
    margin: 0 10px;
    box-shadow: ${(props) => props.theme.boxShadow};
    background-color: ${(props) => props.theme.bgColor};
    animation: ${modalAni} 0.3s ease-in;
`;

function Modal({ show, setShow, children, title }) {
    const modalRef = useRef();

    useOutsideClick(modalRef, () => {
        if (show) setShow(false);
    });

    return (
        <>
            {show && (
                <ModalWrapper>
                    <ModalItem ref={modalRef}>
                        <CancelEmoji onClick={() => setShow(false)} />
                        <ModalTitle>{title}</ModalTitle>
                        {children}
                    </ModalItem>
                </ModalWrapper>
            )}
        </>
    );
}

export default Modal;
