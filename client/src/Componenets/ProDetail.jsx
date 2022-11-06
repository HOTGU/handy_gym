import React from "react";
import styled from "styled-components";
import useBlockPath from "../hooks/useBlockPath";

import Avatar from "./Avatar";
import Carousel from "./Carousel";
import Map from "./Map";

function ProDetail({ data, photos }) {
    const isWritePath = useBlockPath();

    return (
        <Container>
            <Item>
                <Profile>
                    <Avatar width="140px" height="140px" src={data?.avatar} />
                    <Name>{data.name}</Name>
                    <Category>
                        <span>{data.category}</span>
                        {data.career && <span>▪</span>}
                        {data.career && <span>{data.career}년</span>}
                    </Category>
                </Profile>
            </Item>
            <Item>
                <Title>{data.title && `" ${data.title} "`}</Title>
                <Page>
                    <ContentTitle>자기소개</ContentTitle>
                    <Introduction>{data.selfIntroduction}</Introduction>
                    <Line></Line>
                    <ContentTitle>프로그램</ContentTitle>
                    <ProgramWrapper>
                        <ProgramItem>
                            <ProgramInfoWrapper>
                                {data.time && <div>🕒 {data.time}분 / 1회</div>}
                                {data.price && <div>💰 {data.price}원 / 1회</div>}
                                {isWritePath
                                    ? data.isFreePT === "yes" && (
                                          <div>🔥 1회 무료강습 가능</div>
                                      )
                                    : data.isFreePT && <div>🔥 1회 무료강습 가능</div>}
                                {data?.material?.length > 0 && (
                                    <div>
                                        ✍ 준비물:
                                        {data.material.map((m) => (
                                            <span> {m}</span>
                                        ))}
                                    </div>
                                )}
                            </ProgramInfoWrapper>
                            <Introduction>{data.selfIntroduction}</Introduction>
                        </ProgramItem>
                        <ProgramItem>
                            <Carousel images={isWritePath ? photos : data.photos} />
                        </ProgramItem>
                    </ProgramWrapper>

                    {data.location && (
                        <>
                            <Line></Line>
                            <ContentTitle>장소</ContentTitle>
                            <Location>주소: {data.location}</Location>
                            <Map location={data.location} />
                        </>
                    )}
                </Page>
            </Item>
        </Container>
    );
}

const Container = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    height: 100%;
    max-width: 1480px;
`;
const ContentTitle = styled.div`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
`;
const Item = styled.div`
    &:first-child {
        width: 20%;
    }
    &:last-child {
        width: 78%;
    }
`;
const Profile = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.inputColor};
    box-shadow: ${(props) => props.theme.boxShadow};
    padding: 30px 10px;
    border-radius: 10px;
`;
const Page = styled.div`
    box-shadow: ${(props) => props.theme.boxShadow};
    background-color: ${(props) => props.theme.inputColor};
    border-radius: 10px;
    padding: 20px;
`;
const Title = styled.div`
    width: 100%;
    word-break: keep-all;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.5rem;
    text-align: center;
    margin-bottom: 15px;
    color: ${(props) => props.theme.accentColor};
    background-color: ${(props) => props.theme.inputColor};
    box-shadow: ${(props) => props.theme.boxShadow};
    border-radius: 10px;
    padding: 30px 10px;
`;
const Name = styled.div`
    font-size: 24px;
    margin-bottom: 5px;
    margin-top: 50px;
    font-weight: 400;
`;
const Category = styled.div`
    font-size: 14px;
    font-weight: 300;
    & span {
        margin-right: 3px;
    }
`;
const Introduction = styled.div`
    white-space: pre-wrap;
    line-height: 1.3rem;
    font-size: 16px;
    font-weight: 300;
`;
const ProgramWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
`;
const ProgramItem = styled.div`
    &:first-child {
        width: 50%;
    }
    &:last-child {
        width: 40%;
    }
`;
const ProgramInfoWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 15px 10px;
    border: 1px solid ${(props) => props.theme.accentColor};
    border-radius: 5px;
    margin-bottom: 20px;
    /* justify-content: space-around; */
    div {
        width: 50%;
        padding: 10px;
    }
`;
const Line = styled.div`
    border-bottom: 1px solid ${(props) => props.theme.hoverColor};
    padding-top: 30px;
    margin-bottom: 30px;
`;
const Location = styled.div`
    margin-bottom: 10px;
`;

export default ProDetail;
