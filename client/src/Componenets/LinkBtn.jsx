import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SButton = styled(Link)`
    padding: ${(props) => props.padding || "10px 15px"};
    background-color: ${(props) => props.theme.accentColor};
    color: ${(props) => props.theme.colors.white};
    font-size: ${(props) => props.fontSize || "20px"};
    font-weight: 700;
    border-radius: 5px;
    display: flex;
    align-items: center;
`;

function LinkBtn({ children, ...props }) {
    return <SButton {...props}>{children}</SButton>;
}

export default LinkBtn;
