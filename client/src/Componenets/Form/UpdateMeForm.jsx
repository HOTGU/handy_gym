import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { Camera } from "@styled-icons/fa-solid";
import toast from "react-hot-toast";

import Button from "../Button";
import { isAuthAtom } from "../../atoms/isAuthAtom";
import Avatar from "../Avatar";
import { updateMe } from "../../api";
import { setCookie } from "../../utils/cookie";
import Loader from "../Loader";

const SForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const AvatarWrapper = styled.div`
    position: relative;
`;
const CameraEmoji = styled(Camera)`
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 99;
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => props.theme.accentColor};
    padding: 3px;
    border-radius: 50%;
    width: 24px;
    border: 1px solid ${(props) => props.theme.textColor};
`;
const SInput = styled.input.attrs({ autoComplete: "off" })`
    width: 100%;
    font-size: 16px;
    background-color: ${(props) => props.theme.inputColor};
    transition: background-color 0.2s ease-in-out;

    color: ${(props) => props.theme.textColor};
    border: 1px solid
        ${(props) => (props.errors ? props.theme.colors.red : props.theme.textColor)};
    padding: 15px 10px;
    margin-bottom: ${(props) => (props.errors ? "5px" : "10px")};
    margin-top: 15px;
    border-radius: 5px;
`;

const ErrorText = styled.div`
    color: ${(props) => props.theme.colors.red};
    margin-bottom: 10px;
`;

function UpdateMeForm({ show, setShow }) {
    const [isAuth, setIsAuth] = useRecoilState(isAuthAtom);
    const imgRef = useRef();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
        reset,
    } = useForm();

    register("avatar");

    const file = watch("avatar");

    useEffect(() => {
        reset({ nickname: isAuth.user?.nickname, avatar: "" });
    }, [isAuth?.user, reset]);

    const onValid = async (data) => {
        const formData = new FormData();
        formData.append("avatar", data.avatar);
        formData.append("nickname", data.nickname);
        setIsAuth({ loading: true, user: { ...isAuth.user } });
        try {
            const response = await updateMe(formData);
            setIsAuth({ loading: false, user: { ...response.data } });
            toast.success("프로필 수정 완료");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            setIsAuth({ loading: false, user: { ...isAuth.user } });
        }
        setShow(!show);
    };

    return (
        <>
            <SForm onSubmit={handleSubmit(onValid)}>
                <AvatarWrapper>
                    {file ? (
                        <Avatar
                            src={URL.createObjectURL(file)}
                            onClick={() => imgRef.current.click()}
                            click={true}
                        />
                    ) : (
                        <Avatar
                            onClick={() => imgRef.current.click()}
                            click={true}
                            src={isAuth?.user?.avatar}
                        />
                    )}
                    <CameraEmoji />
                </AvatarWrapper>
                <SInput
                    type="file"
                    name="avatar"
                    onChange={(e) => setValue("avatar", e.target?.files[0])}
                    ref={imgRef}
                    hidden={true}
                />
                <SInput
                    {...register("nickname", {
                        required: "닉네임은 필수항목입니다",
                        minLength: {
                            value: 2,
                            message: "최소 2자이상이여야 합니다.",
                        },
                        maxLength: { value: 12, message: "최대 12자입니다." },
                    })}
                    placeholder="닉네임"
                    errors={errors.nickname}
                />
                {errors.nickname && errors.nickname.message && (
                    <ErrorText>{errors.nickname.message}</ErrorText>
                )}
                <Button disabled={isAuth.loading}>
                    {isAuth.loading ? <Loader isCenter={false} /> : "수정완료"}
                </Button>
            </SForm>
        </>
    );
}

export default UpdateMeForm;
