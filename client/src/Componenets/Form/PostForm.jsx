import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { InfoCircle } from "@styled-icons/fa-solid";
import { toast } from "react-hot-toast";
import { useHistory, useParams } from "react-router-dom";
import { useResetRecoilState } from "recoil";

import CategorySelect from "../CategorySelect";
import LocationSelect from "../LocationSelect";
import useBlockEnter from "../../hooks/useBlockEnter";
import Button from "../Button";
import { createPostApi, updatePostApi } from "../../api";
import { resetPostsSelector } from "../../atoms/postsAtom";
import Loader from "../Loader";

const SForm = styled.form`
    width: 100%;
    max-width: 600px;
    & .error {
        border: 1px solid ${(props) => props.theme.colors.red};
    }
`;
const SInput = styled.input.attrs({ autoComplete: "off" })`
    width: 100%;
    font-size: 16px;
    font-weight: 400;
    background-color: ${(props) => props.theme.inputColor};
    color: ${(props) => props.theme.textColor};
    border: 1px solid
        ${(props) => (props.errors ? props.theme.colors.red : props.theme.borderColor)};
    padding: 15px 10px;
    border-radius: 5px;
`;
const Flex = styled.div`
    display: flex;
    gap: 10px;
`;
const Column = styled.div`
    margin-bottom: 10px;
`;
const TextArea = styled.textarea`
    resize: none;
    width: 100%;
    height: 240px;
    font-weight: 100;

    color: ${(props) => props.theme.textColor};
    border: 1px solid
        ${(props) => (props.errors ? props.theme.colors.red : props.theme.borderColor)};
    background-color: ${(props) => props.theme.inputColor};
    padding: 10px;
    font-size: 16px;
    outline: none;
    border-radius: 5px;
`;
const ErrorText = styled.div`
    color: ${(props) => props.theme.colors.red};
    margin-bottom: 2px;
`;
const InfoWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    color: ${(props) => props.theme.svgColor};
`;
const InfoText = styled.div`
    font-size: 14px;
    font-weight: 100;
`;
const InfoEmoji = styled(InfoCircle)`
    height: 14px;
    margin-right: 3px;
`;

function PostForm({ isUpdate, post }) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const resetPosts = useResetRecoilState(resetPostsSelector);
    const history = useHistory();
    const { id } = useParams();

    const categoryRef = useRef();
    const locationRef = useRef();

    const category = watch("category");
    const location = watch("location");

    useBlockEnter();

    useEffect(() => {
        if (isUpdate) {
            setValue("title", post?.title);
            setValue("description", post?.description);
            setValue("category", post?.category);
            setValue("location", post?.location);
        }
    });

    const onValid = async (data) => {
        setLoading(true);
        if (isUpdate) {
            try {
                await updatePostApi(id, data);
                toast.success("수정 성공");
                resetPosts();
                history.push("/me");
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            try {
                await createPostApi(data);
                toast.success("업로드 성공");
                resetPosts();
                history.push("/posts");
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    return (
        <SForm onSubmit={handleSubmit(onValid)}>
            <Column>
                <InfoWrapper>
                    <InfoEmoji />
                    <InfoText>글의 주제를 한 문장으로 적어보세요</InfoText>
                </InfoWrapper>

                <SInput
                    {...register("title", {
                        required: "제목은 필수항목입니다",
                        minLength: {
                            value: 2,
                            message: "최소 2자이상이여야 합니다.",
                        },
                        maxLength: { value: 20, message: "최대 20자입니다." },
                    })}
                    placeholder="제목"
                    className={errors.title && "error"}
                />
                {errors.title && errors.title.message && (
                    <ErrorText>{errors.title.message}</ErrorText>
                )}
            </Column>
            <Column>
                <InfoWrapper>
                    <InfoEmoji />
                    <InfoText>자신이 원하는 운동과 동네를 선택해주세요</InfoText>
                </InfoWrapper>

                <Flex>
                    <CategorySelect
                        error={errors.category}
                        category={category}
                        setValue={setValue}
                    />
                    <LocationSelect
                        error={errors.location}
                        location={location}
                        setValue={setValue}
                    />
                </Flex>
                {errors.category && errors.category.message && (
                    <ErrorText>{errors.category.message}</ErrorText>
                )}
                {errors.location && errors.location.message && (
                    <ErrorText>{errors.location.message}</ErrorText>
                )}
            </Column>
            <Column>
                <InfoWrapper>
                    <InfoEmoji />
                    <InfoText>자신이 원하는 프로의 모습을 자세하게 적어주세요</InfoText>
                </InfoWrapper>
                <InfoWrapper>
                    <InfoEmoji />
                    <InfoText>인삿말을 빼놓지 말아주세요😀</InfoText>
                </InfoWrapper>

                <TextArea
                    {...register("description", {
                        required: "본문은 필수항목입니다",
                        minLength: {
                            value: 15,
                            message: "최소 15자이상이여야 합니다.",
                        },
                        maxLength: { value: 200, message: "최대 200자입니다." },
                    })}
                    placeholder="본문"
                    className={errors.description && "error"}
                />
                {errors.description && errors.description.message && (
                    <ErrorText>{errors.description.message}</ErrorText>
                )}
            </Column>

            <SInput
                ref={categoryRef}
                {...register("category", {
                    required: "희망운동은 필수항목입니다",
                })}
                readOnly={true}
                hidden={true}
            />
            <SInput
                ref={locationRef}
                {...register("location", {
                    required: "희망동네는 필수항목입니다",
                })}
                readOnly={true}
                hidden={true}
            />
            <Button disabled={loading}>
                {loading ? (
                    <Loader isCenter={false} />
                ) : (
                    <div>{isUpdate ? "수정하기" : "업로드"}</div>
                )}
            </Button>
        </SForm>
    );
}

export default PostForm;
