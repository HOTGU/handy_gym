import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { EllipsisV } from "@styled-icons/fa-solid";
import Moment from "react-moment";
import "moment/locale/ko";

import Avatar from "./Avatar";
import { useRecoilState, useRecoilValue } from "recoil";
import { isAuthAtom } from "../atoms/isAuthAtom";
import useOutsideClick from "../hooks/useOutsideClick";
import Confirm from "./Confirm";
import { deletePostApi } from "../api";
import toast from "react-hot-toast";
import { mePostsState } from "../atoms/mePostsAtom";

const CardWrapper = styled.div`
    height: 200px;
    padding: 20px;
    border-radius: 10px;
    background-color: ${(props) => props.theme.inputColor};
    position: relative;
`;

const Card = styled(Link)`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const TagWrapper = styled.div`
    display: flex;
    margin: 0;
`;
const Tag = styled.div`
    font-size: 14px;
    font-weight: 400;
    margin-right: 5px;
    color: ${(props) => props.theme.accentColor};
`;
const Title = styled.h4`
    margin: 20px 0;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.5rem;
`;
const Creator = styled.div`
    display: flex;
    align-items: center;
    margin-top: auto;
`;
const CreatorInfo = styled.div`
    margin-left: 10px;
`;
const Imoji = styled(EllipsisV)`
    position: absolute;
    width: 30px;
    height: 20px;
    right: 0px;
    top: 10px;
    z-index: 5;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
        color: ${(props) => props.theme.accentColor};
    }
`;
const Created = styled.div`
    margin-top: 5px;
    font-weight: 100;
    opacity: 0.87;
`;
const PostModal = styled.div`
    position: absolute;
    right: 0;
    width: 100px;
    height: auto;
    border-radius: 10px;
    z-index: 99;
    top: 0;
    border: 1px dashed ${(props) => props.theme.textColor};
    padding: 5px 0;
    background-color: ${(props) => props.theme.inputColor};
`;
const ModalBtn = styled.div`
    padding: 10px 15px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.1s ease-in-out;
    text-align: center;
    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
    }
`;

function PostCard({ post, isEdit }) {
    const { user } = useRecoilValue(isAuthAtom);
    const [modal, setModal] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [currentId, setCurrentId] = useState("");
    const [mePosts, setMePosts] = useRecoilState(mePostsState);

    const ref = useRef();

    useOutsideClick(ref, () => {
        if (modal) setModal(false);
    });

    const handleDelete = async (id) => {
        const deletePromise = deletePostApi(id)
            .catch((err) => {})
            .then((res) => {
                if (res.status === 200) {
                    setMePosts(deleted);
                }
            });
        setConfirm(false);
        toast.promise(deletePromise, {
            loading: "삭제 중...",
            success: "삭제 성공",
            error: "삭제 실패",
        });
        const deleted = mePosts.filter((post) => post._id !== id);
    };

    return (
        <CardWrapper>
            {post.creator._id === user._id && isEdit && (
                <Imoji onClick={() => setModal(!modal)} />
            )}
            {modal && isEdit && (
                <PostModal ref={ref}>
                    <Link to={{ pathname: `/posts/${post._id}/update`, state: { post } }}>
                        <ModalBtn>수정하기</ModalBtn>
                    </Link>
                    <ModalBtn
                        onClick={() => {
                            setCurrentId(post._id);
                            setConfirm(true);
                            setModal(false);
                        }}
                    >
                        삭제하기
                    </ModalBtn>
                    <ModalBtn onClick={() => setModal(!modal)}>닫기</ModalBtn>
                </PostModal>
            )}

            {confirm && isEdit && (
                <Confirm
                    setShow={setConfirm}
                    onConfirm={() => handleDelete(currentId)}
                    title="정말 글을 삭제하겠습니까?"
                />
            )}

            <Card to={{ pathname: `/posts/${post._id}`, state: { post } }}>
                <TagWrapper>
                    <Tag>{post.location}</Tag>
                    <Tag>▪</Tag>
                    <Tag>{post.category}</Tag>
                </TagWrapper>
                <Title>{post.title}</Title>
                <Creator>
                    <Avatar src={post?.creator?.avatar} width="40px" height="40px" />
                    <CreatorInfo>
                        <div>{post.creator?.nickname}</div>
                        <Created>
                            <Moment fromNow>{post?.created}</Moment>
                        </Created>
                    </CreatorInfo>
                </Creator>
            </Card>
        </CardWrapper>
    );
}

export default PostCard;
