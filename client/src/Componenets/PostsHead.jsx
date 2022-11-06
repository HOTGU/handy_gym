import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ChevronCircleUp } from "@styled-icons/fa-solid";
import { useForm } from "react-hook-form";

import Leaf from "./Images/Leaf";
import CategorySelect from "./CategorySelect";
import LocationSelect from "./LocationSelect";
import Button from "./Button";
import { useRecoilCallback } from "recoil";
import { fetchPostsLoadNumber } from "../atoms/postsAtom";
import LinkBtn from "./LinkBtn";

const HeadContainer = styled.div`
    position: sticky;
    width: 100%;
    height: auto;
    top: 0;
    background-color: ${(props) => props.theme.bgColor};
    padding: 15px 0;
    z-index: 10;
`;
const ItemContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const ItemWrapper = styled.div`
    display: flex;
    align-items: center;
`;
const ItemText = styled.div`
    font-size: 16px;
    font-weight: 700;
`;
const SearchBtn = styled.div`
    padding: 10px 15px;
    border-radius: 5px;
    color: ${(props) => props.theme.textColor};
    border: 1px solid ${(props) => props.theme.borderColor};
    margin-right: 5px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
    }
`;

const ArrowUpImoji = styled(ChevronCircleUp)`
    position: absolute;
    bottom: -16px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: 32px;
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
        transform: scale(1.05);
    }
`;

const Form = styled.form`
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
    & .active {
        border-bottom: 1px dashed ${(props) => props.theme.textColor};
        padding: 10px 0 30px 0;
        margin-bottom: 15px;
        max-height: 250px;
    }
    & .noActive {
        max-height: 0;
    }
`;
const FormWrapper = styled.div`
    position: relative;
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
    transition: all 0.5s ease-in-out;
    & button {
        margin-top: 10px;
    }
`;

const Flex = styled.div`
    display: flex;
    gap: 10px;
`;

function PostsHead() {
    const [isSearch, setIsSearch] = useState(false);
    const history = useHistory();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const categoryParams = query.get("category");
    const locationParams = query.get("location");
    const { handleSubmit, register, setValue, watch } = useForm();

    const categoryRef = useRef();
    const locationRef = useRef();

    const category = watch("category");
    const location = watch("location");

    const resetPosts = useRecoilCallback(({ set }) => async () => {
        set(fetchPostsLoadNumber, 0);
    });

    const blockEnter = (e) => {
        if (e.keyCode === 13 && e.target.type !== "textarea") {
            e.preventDefault();
            return false;
        }
    };

    useEffect(() => {
        if (categoryParams) setValue("category", categoryParams);
        if (locationParams) setValue("location", locationParams);
        setIsSearch(false);
        window.addEventListener("keydown", blockEnter);
        return () => {
            window.removeEventListener("keydown", blockEnter);
        };
    }, [categoryParams, locationParams, setValue]);

    const onValid = (data) => {
        if (!data.category && !data.location) {
            return toast.error("동네와 운동 둘 중 하나를 선택해주세요");
        }
        resetPosts();
        history.push(`/posts?category=${category}&location=${location}`);
    };

    return (
        <HeadContainer>
            <ItemContainer>
                <ItemWrapper>
                    <Leaf width="40px" height="40px" />
                    <Link to="/posts">
                        <ItemText>프로를 찾습니다</ItemText>
                    </Link>
                </ItemWrapper>
                <ItemWrapper>
                    <SearchBtn onClick={() => setIsSearch(!isSearch)}>
                        {isSearch ? "❌" : "🔎"}
                    </SearchBtn>
                    <LinkBtn to="/posts/upload">
                        <ItemText>📝글쓰기</ItemText>
                    </LinkBtn>
                </ItemWrapper>
            </ItemContainer>

            <Form onSubmit={handleSubmit(onValid)}>
                <FormWrapper className={isSearch ? "active" : "noActive"}>
                    <Flex>
                        <CategorySelect category={category} setValue={setValue} />
                        <LocationSelect location={location} setValue={setValue} />
                    </Flex>
                    <input
                        ref={categoryRef}
                        {...register("category")}
                        readOnly={true}
                        hidden={true}
                    />
                    <input
                        ref={locationRef}
                        {...register("location")}
                        readOnly={true}
                        hidden={true}
                    />
                    <Button
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                return false;
                            }
                        }}
                    >
                        검색
                    </Button>
                    <ArrowUpImoji onClick={() => setIsSearch(!isSearch)} />
                </FormWrapper>
            </Form>
        </HeadContainer>
    );
}

export default PostsHead;
