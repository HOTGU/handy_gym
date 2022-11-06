import React from "react";
import HomeImg from "../Images/homeImg.svg";
import styled from "styled-components";
import LinkBtn from "../Componenets/LinkBtn";
import SvgLeaf from "../Componenets/Images/Leaf";
import SvgFlower from "../Componenets/Images/Flower";
import SvgTree from "../Componenets/Images/Tree";

const HomeContainer = styled.div`
    margin: 10px auto;
    max-width: 1400px;
`;

const MainWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 50px 0;
    @media screen and (max-width: 1024px) {
        flex-direction: column;
    }
`;

const MainItem = styled.div`
    width: 46%;
    flex-basis: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 1024px) {
        width: 100%;
        margin-bottom: 20px;
        padding: 0;
    }
`;

const MainImg = styled.img`
    width: 100%;
    height: auto;
    @media screen and (max-width: 1024px) {
        width: 80%;
    }
    @media screen and (max-width: 768px) {
        width: 100%;
    }
`;
const MainText = styled.div`
    margin-bottom: 30px;
    font-size: 32px;
    font-weight: 700;
    @media screen and (max-width: 1024px) {
        font-size: 24px;
    }
`;

const ItemWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 100px auto;
    @media screen and (max-width: 1024px) {
        flex-direction: column;
    }
`;
const Item = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: 1024px) {
        width: 100%;
        margin-bottom: 20px;
        flex-direction: row;
        justify-content: start;
    }
`;

const ItemText = styled.div`
    color: ${(props) => props.theme.textColor};
    font-size: 18px;
    margin-top: 20px;
`;

const ProWrapper = styled.div`
    width: 100%;
    background-color: ${(props) => props.theme.inputColor};
    border-radius: 10px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h4 {
        font-size: 40px;
        font-weight: 700;
        margin-bottom: 30px;
    }
`;

function Home() {
    return (
        <HomeContainer>
            <MainWrapper>
                <MainItem>
                    <MainImg src={HomeImg} />
                </MainItem>
                <MainItem>
                    <MainText>자신에게 맞는 운동프로를 찾아보세요</MainText>
                    <LinkBtn to="/posts" padding="20px 32px" fontSize="24px">
                        프로 찾기
                    </LinkBtn>
                </MainItem>
            </MainWrapper>
            <ItemWrapper>
                <div>
                    <Item>
                        <SvgLeaf width="100px" height="100px" />
                        <ItemText>운동프로를 원하는 글을 올립니다</ItemText>
                    </Item>
                </div>
                <div>
                    <Item>
                        <SvgFlower width="100px" height="100px" />
                        <ItemText>쪽지가 온 운동프로의 프로필을 봅니다</ItemText>
                    </Item>
                </div>
                <div>
                    <Item>
                        <SvgTree width="100px" height="100px" />
                        <ItemText>마음에 든 운동프로와 운동을 합니다</ItemText>
                    </Item>
                </div>
            </ItemWrapper>
            <ProWrapper>
                <h4>혹시 운동프로신가요?</h4>
                <LinkBtn to="/pro" padding="20px 32px" fontSize="24px">
                    프로 등록
                </LinkBtn>
            </ProWrapper>
        </HomeContainer>
    );
}

export default Home;
