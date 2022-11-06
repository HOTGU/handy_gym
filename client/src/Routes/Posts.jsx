import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useRecoilCallback, useRecoilValue } from "recoil";

import PostCard from "../Componenets/PostCard";
import PostsHead from "../Componenets/PostsHead";
import {
    fetchPostsIsFetch,
    fetchPostsIsLoading,
    fetchPostsLoadLimit,
    fetchPostsLoadNumber,
    postsState,
} from "../atoms/postsAtom";
import { fetchPostsApi, searchApi } from "../api";
import ReadMoreBtn from "../Componenets/ReadMoreBtn";
import Loader from "../Componenets/Loader";
import Refresh from "../Componenets/Images/Refresh";
import toast from "react-hot-toast";

const PostContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 5px;
`;
const RefreshBtn = styled.div`
    position: fixed;
    bottom: 30px;
    right: 30px;
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
`;

function Posts() {
    const [loading, setLoading] = useState(false);
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const categoryParams = query.get("category");
    const locationParams = query.get("location");
    const posts = useRecoilValue(postsState);
    const number = useRecoilValue(fetchPostsLoadNumber);
    const isLoading = useRecoilValue(fetchPostsIsLoading);
    const limit = useRecoilValue(fetchPostsLoadLimit);
    const isFetch = useRecoilValue(fetchPostsIsFetch);

    const fetchPosts = useRecoilCallback(({ set }) => async () => {
        let res;
        set(fetchPostsIsLoading, true);
        try {
            const next = number + 1;

            if (categoryParams || locationParams) {
                res = await searchApi(categoryParams, locationParams, next, limit);
            } else {
                res = await fetchPostsApi(next, limit);
            }
            set(fetchPostsIsFetch, true);
            if (res.data.length < limit) {
                set(fetchPostsIsFetch, false);
            }
            set(postsState, (prev) => [...prev, ...res.data]);
            set(fetchPostsLoadNumber, next);
        } catch (error) {
            toast.error(error.response.data.message);
        }
        set(fetchPostsIsLoading, false);
    });

    const handleRefresh = useRecoilCallback(({ set }) => async () => {
        let res;
        setLoading(true);
        try {
            if (categoryParams || locationParams) {
                res = await searchApi(categoryParams, locationParams, 1, limit);
            } else {
                res = await fetchPostsApi(1, limit);
            }
            set(fetchPostsIsFetch, true);
            if (res.data.length < limit) {
                set(fetchPostsIsFetch, false);
            }
            set(postsState, () => [...res.data]);
            set(fetchPostsLoadNumber, 1);
        } catch (error) {
            toast.error(error.response.data.message);
        }
        setLoading(false);
    });

    useEffect(() => {
        if (number === 0) {
            handleRefresh();
        }
    }, [categoryParams, locationParams, handleRefresh, number]);

    if (loading) return <Loader width="50px" height="50px" />;

    return (
        <>
            <PostsHead />
            {(categoryParams || locationParams) && (
                <div>{`운동: ${categoryParams ? categoryParams : "전체"} ▪ 동네: ${
                    locationParams ? locationParams : "전체"
                } (으)로 검색한 결과`}</div>
            )}

            <PostContainer>
                {posts.map((post, index) => (
                    <PostCard key={index} post={post} />
                ))}
            </PostContainer>

            <ReadMoreBtn
                isLoading={isLoading}
                isFetch={isFetch}
                handleClick={fetchPosts}
            />
            <RefreshBtn onClick={handleRefresh}>
                <Refresh />
            </RefreshBtn>
        </>
    );
}

export default Posts;
