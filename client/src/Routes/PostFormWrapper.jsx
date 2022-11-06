import React from "react";
import styled from "styled-components";

import Img from "../Images/uploadImg.svg";
import PostForm from "../Componenets/Form/PostForm";

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 100px;
    @media screen and (max-width: 1024px) {
        flex-direction: column;
        margin-top: 20px;
    }
`;
const Item = styled.div`
    width: 40%;
    flex-basis: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media screen and (max-width: 1024px) {
        width: 100%;
        margin-bottom: 20px;
        padding: 0;
    }
`;
const ItemImg = styled.img`
    width: 100%;
    max-width: 550px;
    height: auto;
`;
const Title = styled.div`
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 20px;
`;

function PostFormWrapper({ isUpdate, post, title }) {
    return (
        <Container>
            <Item>
                <ItemImg src={Img} />
            </Item>
            <Item>
                <Title>{title}</Title>
                <PostForm isUpdate={isUpdate} post={post} />
            </Item>
        </Container>
    );
}

export default PostFormWrapper;
