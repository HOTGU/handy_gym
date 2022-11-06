import React from "react";
import styled from "styled-components";
import Loader from "./Loader";

const ReadMore = styled.div`
    margin-top: 20px;
    border-radius: 10px;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.inputColor};
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    &: hover {
        background-color: ${(props) => props.theme.hoverColor};
    }
    & span {
        font-size: 20px;
    }
`;
function ReadMoreBtn({ isLoading, isFetch, handleClick }) {
    return (
        <div>
            {isLoading ? (
                <ReadMore onClick={() => handleClick()}>
                    <span>
                        <Loader isCenter={false} width="30px" height="30px" />
                    </span>
                </ReadMore>
            ) : isFetch ? (
                <ReadMore onClick={() => handleClick()}>
                    <span>더보기</span>
                </ReadMore>
            ) : (
                ""
            )}
        </div>
    );
}

export default ReadMoreBtn;
