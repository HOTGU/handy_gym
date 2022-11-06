import React from "react";
import styled from "styled-components";

const SButton = styled.button`
    background-color: ${(props) =>
        props.disabled ? props.theme.inputColor : props.theme.accentColor};
    color: ${(props) =>
        props.disabled ? props.theme.textColor : props.theme.colors.white};
    width: 100%;
    font-family: "GMarket";
    border: 2px solid ${(props) => props.theme.accentColor};
    font-size: 18px;
    padding: ${(props) => (props.padding ? props.padding : "10px 15px")};
    border-radius: 5px;
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
    display: flex;
    justify-content: center;
    align-items: center;
`;

function Button({ children, ...props }) {
    return <SButton {...props}>{children}</SButton>;
}

export default Button;
