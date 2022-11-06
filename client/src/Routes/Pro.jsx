import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import ProDetail from "../Componenets/ProDetail";

const Wrapper = styled.div`
    margin: 20px 0;
`;

function Pro() {
    const location = useLocation();

    return (
        <Wrapper>
            <ProDetail data={location?.state?.data} />
        </Wrapper>
    );
}

export default Pro;
