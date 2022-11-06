import React, { useMemo } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";

import ProMainImg from "../Images/pro.svg";
import ProMoneyImg from "../Images/money.svg";
import ProLocationImg from "../Images/location.svg";
import { myProDataSelector } from "../atoms/isProAtom";
import ProCard from "../Componenets/ProCard";
import { isAuthAtom } from "../atoms/isAuthAtom";
import { getFourPosts } from "../atoms/postsAtom";
import LinkBtn from "../Componenets/LinkBtn";
import PostCard from "../Componenets/PostCard";
import Loader from "../Componenets/Loader";

function GetPostCard() {
    const postsData = useRecoilValueLoadable(getFourPosts);

    const posts = useMemo(() => {
        return postsData?.state === "hasValue" ? postsData?.contents : [];
    }, [postsData]);

    if (postsData?.state === "loading")
        return (
            <PostContainer>
                <LoadingCard>
                    <Loader isCenter={false} />
                </LoadingCard>
            </PostContainer>
        );

    return (
        <PostContainer>
            {posts.map((post) => (
                <PostCard post={post} isEdit={false} />
            ))}
        </PostContainer>
    );
}

const PostContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 5px;
`;

const LoadingCard = styled.div`
    width: 100%;
    height: 200px;
    border-radius: 10px;
    background-color: ${(props) => props.theme.inputColor};
    display: flex;
    justify-content: center;
    align-items: center;
`;

function GetProCard() {
    const myProData = useRecoilValueLoadable(myProDataSelector);

    const data = useMemo(() => {
        return myProData?.state === "hasValue" ? myProData?.contents : null;
    }, [myProData]);

    if (myProData?.state === "loading")
        return (
            <LoadingProCard>
                <Loader isCenter={false} />
            </LoadingProCard>
        );

    return <>{data && <ProCard data={data} />}</>;
}

const LoadingProCard = styled.div`
    width: 400px;
    height: 240px;
    border-radius: 10px;
    background-color: ${(props) => props.theme.inputColor};
    display: flex;
    justify-content: center;
    align-items: center;
`;

function ProMain() {
    const { user } = useRecoilValue(isAuthAtom);
    const history = useHistory();

    const onClick = () => {
        if (!user.isPro) {
            toast.error("프로프로필이 있어야 이용가능합니다");
            history.push("/pro/register");
            return;
        }
        history.push("/posts");
    };

    return (
        <>
            {user.isPro ? (
                <>
                    <Column>
                        <ColumnText>나의 프로필카드</ColumnText>
                        <GetProCard />
                    </Column>
                    <Column>
                        <FlexBetween>
                            <ColumnText>프로를 찾습니다</ColumnText>
                            <Link to="/posts">더 보기</Link>
                        </FlexBetween>
                        <GetPostCard />
                    </Column>
                </>
            ) : (
                <>
                    <Main>
                        <MainItem>
                            <MainImg src={ProMainImg} />
                        </MainItem>

                        <MainItem>
                            <MainText>핸디짐에서 나만의 프로필을 만들어보세요</MainText>
                            <LinkBtn
                                to="/pro/register"
                                padding="20px 32px"
                                fontSize="24px"
                            >
                                프로필 만들기
                            </LinkBtn>
                        </MainItem>
                    </Main>
                    <ItemWrapper>
                        <Item>
                            <ItemImg src={ProMoneyImg} />
                            <span>추가 수입을 벌어보세요</span>
                        </Item>
                        <Item>
                            <ItemImg src={ProLocationImg} />
                            <span>자신의 지역에서 회원들을 만나보세요</span>
                        </Item>
                    </ItemWrapper>
                    <Btn onClick={onClick}>바로 회원 찾아보기</Btn>
                </>
            )}
        </>
    );
}

const Main = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${(props) => props.theme.inputColor};
    border-radius: 10px;
    padding: 60px 20px;
    margin: 30px 0;
`;

const MainImg = styled.img`
    width: 100%;
    @media screen and (max-width: 1024px) {
        width: 80%;
    }
    @media screen and (max-width: 768px) {
        width: 100%;
    }
`;
const MainItem = styled.div`
    width: 45%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const MainText = styled.span`
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 20px;
`;

const ItemWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    gap: 30px;
`;
const Item = styled.div`
    width: 50%;
    background-color: ${(props) => props.theme.inputColor};
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    border-radius: 10px;
    span {
        font-size: 16px;
    }
`;
const ItemImg = styled.img`
    width: 220px;
    height: 220px;
`;
const Btn = styled.div`
    width: 100%;
    background-color: ${(props) => props.theme.accentColor};
    color: ${(props) => props.theme.colors.white};
    margin: 30px 0;
    text-align: center;
    padding: 30px 15px;
    font-size: 28px;
    font-weight: 700;
    border-radius: 10px;
    cursor: pointer;
`;

const Column = styled.div`
    padding: 20px 0;
`;

const ColumnText = styled.div`
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: 700;
`;
const FlexBetween = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export default ProMain;
