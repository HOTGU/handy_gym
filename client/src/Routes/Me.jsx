import React, { useEffect, useState } from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

import Modal from "../Componenets/Modal";
import Avatar from "../Componenets/Avatar";
import { isAuthAtom } from "../atoms/isAuthAtom";
import UpdateMeForm from "../Componenets/Form/UpdateMeForm";
import { getMePosts } from "../api";
import { mePostsLoading, mePostsState } from "../atoms/mePostsAtom";
import Loader from "../Componenets/Loader";
import PostCard from "../Componenets/PostCard";
import toast from "react-hot-toast";

const UserWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;
const UserProfile = styled.div`
    width: 200px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    align-items: center;
    justify-content: center;
`;
const PostContainer = styled.div`
    width: 100%;
    overflow: hidden;
    & .active {
        margin-bottom: 15px;
        max-height: 3000px;
    }
    & .noActive {
        max-height: 0;
    }
`;
const PostWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    transition: all 0.5s ease-in-out;
`;
const Nickname = styled.div`
    font-size: 20px;
    margin: 20px 0;
`;
const Btn = styled.div`
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    background-color: ${(props) => props.theme.inputColor};
    border: 1px solid ${(props) => props.theme.borderColor};
    &:last-child {
        margin-top: 15px;
    }
`;

function Profile() {
    const { user } = useRecoilValue(isAuthAtom);
    const [posts, setPosts] = useRecoilState(mePostsState);
    const [isEdit, setIsEdit] = useState(false);
    const loading = useRecoilValue(mePostsLoading);
    const [show, setShow] = useState(false);

    const handleShowPosts = useRecoilCallback(({ set }) => async () => {
        set(mePostsLoading, true);
        try {
            const { data } = await getMePosts();
            set(mePostsState, data);
            setIsEdit(true);
        } catch (error) {
            toast.error(error.response.data.message);
        }
        set(mePostsLoading, false);
    });

    useEffect(() => {
        setPosts([]);
    }, [setPosts]);

    return (
        <UserWrapper>
            <UserProfile>
                <Avatar src={user.avatar} />
                <Nickname>{user.nickname}</Nickname>
                <Btn onClick={() => setShow(!show)}>프로필 수정 🔏</Btn>
                <Btn onClick={isEdit ? () => setIsEdit(false) : handleShowPosts}>
                    {loading ? (
                        <Loader isCenter={false} />
                    ) : isEdit ? (
                        "편집 취소 ❌"
                    ) : (
                        "작성글 편집 🔨"
                    )}
                </Btn>
            </UserProfile>
            <Modal show={show} setShow={setShow} title="프로필 수정">
                <UpdateMeForm show={show} setShow={setShow} />
            </Modal>
            <PostContainer>
                <PostWrapper className={isEdit ? "active" : "noActive"}>
                    {posts.map((post, index) => (
                        <PostCard post={post} key={index} isEdit={isEdit} />
                    ))}
                </PostWrapper>
            </PostContainer>
        </UserWrapper>
    );
}

export default Profile;
