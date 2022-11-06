import React from "react";
import { useSetRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";

import { Times } from "@styled-icons/fa-solid";
import { isLogoutAtom } from "../atoms/isLogout";
import useBlockPath from "../hooks/useBlockPath";

const modalAni = keyframes`
    0% {
    opacity: 0;
  }
  100% {
    opacity: 1;

  }
  
`;

const CancelEmoji = styled(Times)`
    width: 28px;
    height: 28px;
    position: absolute;
    top: 16px;
    right: 16px;
    color: ${(props) => props.theme.textColor};
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
        opacity: 0.7;
    }
`;

const ConfirmWrapper = styled.div`
    position: fixed;
    background-color: ${(props) => props.theme.modalColor};
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 99;
    padding: 20px;
`;
const ConfirmItem = styled.div`
    animation: ${modalAni} 0.2s ease-in;
    position: relative;
    width: 100%;
    max-width: 600px;
    height: 140px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 10px;
    z-index: 99;
    box-shadow: ${(props) => props.theme.boxShadow};
    background-color: ${(props) => props.theme.inputColor};
    margin-top: 100px;
`;
const ConfirmTitle = styled.div`
    font-size: 18px;
    width: 70%;
`;
const ConfirmInfo = styled.div`
    font-size: 14px;
    margin-top: 5px;
    color: ${(props) => props.theme.colors.red};
`;

const BtnContainer = styled.div`
    margin-top: auto;
    margin-left: auto;
    display: flex;
    gap: 10px;
`;
const Btn = styled.div`
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    background-color: ${(props) => props.theme.colors.red};
    &:last-child {
        background-color: ${(props) => props.theme.accentColor};
    }
`;

function Confirm({ setShow, title, info, onConfirm }) {
    const setIsLogout = useSetRecoilState(isLogoutAtom);

    const isBlockPath = useBlockPath();

    const handleNoClick = () => {
        setShow(false);
        setIsLogout(false);
    };

    return (
        <>
            <ConfirmWrapper>
                <ConfirmItem>
                    <CancelEmoji onClick={handleNoClick} />
                    <ConfirmTitle>{title}</ConfirmTitle>
                    <ConfirmInfo>
                        {/* {(currentProRegister || currentPostUpload) &&
                            "💡 작성중인 글은 저장되지 않습니다"} */}
                        {isBlockPath && "💡 작성중인 글은 저장되지 않습니다"}
                    </ConfirmInfo>
                    <BtnContainer>
                        <Btn onClick={handleNoClick}>아니요</Btn>
                        <Btn onClick={onConfirm}>네</Btn>
                    </BtnContainer>
                </ConfirmItem>
            </ConfirmWrapper>
        </>
    );
}

export default Confirm;
