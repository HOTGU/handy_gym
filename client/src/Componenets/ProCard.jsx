import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { isAuthAtom } from "../atoms/isAuthAtom";
import useBlockPath from "../hooks/useBlockPath";
import Avatar from "./Avatar";

function ProCard({ data }) {
    const { user } = useRecoilValue(isAuthAtom);
    const isWritePath = useBlockPath();

    return (
        <Card>
            {user.isPro === data._id && !isWritePath && (
                <Link to={`/pro/${user.isPro}/update`}>
                    <EmojiWrapper>🔨</EmojiWrapper>
                </Link>
            )}
            <Profile>
                <Avatar src={data?.avatar} width="120px" height="120px" />
                <ProfileItem>
                    <Name>{data.name}</Name>
                    <Category>
                        <span>{data.category}</span>
                        {data.career && <span>▪</span>}
                        {data.career && <span>{data.career}년</span>}
                    </Category>
                </ProfileItem>
            </Profile>
            {data.title && <Title>{data.title}</Title>}
            <Info>
                {data.time && <InfoItem>🕒 {data.time}분 / 1회</InfoItem>}
                {data.price && <InfoItem>💰 {data.price}원 / 1회</InfoItem>}

                {isWritePath
                    ? data.isFreePT === "yes" && <InfoItem>🔥 1회 무료강습 가능</InfoItem>
                    : data.isFreePT && <InfoItem>🔥 1회 무료강습 가능</InfoItem>}
                {data?.material?.length > 0 && (
                    <InfoItem>
                        ✍ 준비물:
                        {data.material.map((m, i) => (
                            <span>
                                {i === 0 ? "" : ","} {m}
                            </span>
                        ))}
                    </InfoItem>
                )}
                {isWritePath
                    ? data.isLocation === "yes" && (
                          <InfoItem className="info__location">
                              🏡 {data.location}
                          </InfoItem>
                      )
                    : data.isLocation && (
                          <InfoItem className="info__location">
                              🏡 {data.location}
                          </InfoItem>
                      )}
            </Info>
            {!isWritePath && (
                <CenterContainer>
                    <SLink to={{ pathname: `/pro/${data._id}`, state: { data } }}>
                        자세히 보기
                    </SLink>
                </CenterContainer>
            )}
        </Card>
    );
}

const Card = styled.div`
    position: relative;
    padding: 20px;
    width: 100%;
    max-width: 400px;
    background-color: ${(props) => props.theme.inputColor};
    border-radius: 5px;
`;

const EmojiWrapper = styled.div`
    position: absolute;
    top: 5px;
    right: 5px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${(props) => props.theme.textColor};
    border-radius: 50%;
    cursor: pointer;
`;

const Profile = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
`;
const ProfileItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;
const Title = styled.div`
    width: 100%;
    word-break: keep-all;
    font-size: 16px;
    margin: 20px 0;
    line-height: 1.5rem;
`;
const Name = styled.div`
    font-size: 28px;
    font-weight: 700;
`;
const Category = styled.div`
    font-size: 18px;
    & span {
        margin-right: 3px;
    }
`;

const Info = styled.div`
    display: flex;
    flex-wrap: wrap;
    & .info__location {
        width: 100%;
    }
`;
const InfoItem = styled.div`
    width: auto;
    padding: 5px 10px;
    font-weight: 100;
    &:last-child() {
        width: 100%;
    }
`;
const CenterContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    width: 100%;
    gap: 4px;
`;
const SLink = styled(Link)`
    background-color: ${(props) => props.theme.accentColor};
    color: ${(props) => props.theme.colors.white};
    padding: 10px 15px;
    border-radius: 30px;
    text-align: center;
`;

export default ProCard;
