import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRecoilState, useResetRecoilState } from "recoil";
import styled from "styled-components";

import { sendEmailApi, signinApi, signupApi } from "../api";
import { isAuthAtom } from "../atoms/isAuthAtom";
// import { loginHandler } from "../utils/auth";
import { useLocation } from "react-router";
import { verifyEmailAtom } from "../atoms/sendEmail";
import SvgWelcome from "../Componenets/Images/Welcome";
import Loader from "../Componenets/Loader";
import Button from "../Componenets/Button";

const AuthContainer = styled.div`
    max-width: 320px;
    margin: 0 auto;
`;
const ImgWrapper = styled.div`
    width: 200px;
    margin: 40px auto;
`;
const VerifyWrapper = styled.div`
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
`;
const VerifyInput = styled.input`
    width: 70%;
    margin-left: 5px;
    border: 1px solid ${(props) => props.theme.textColor};
    border-radius: 5px;
    padding: 10px;
    background-color: ${(props) =>
        props.isVerify ? props.theme.hoverColor : props.theme.bgColor};
    cursor: ${(props) => (props.isVerify ? "not-allowed" : "auto")};
    color: ${(props) => (props.isVerify ? props.theme.svgColor : props.theme.textColor)};
`;
const VerifyBtn = styled.div`
    width: 30%;
    padding: 10px;
    background-color: ${(props) =>
        props.isVerify ? props.theme.hoverColor : props.theme.bgColor};
    color: ${(props) => (props.isVerify ? props.theme.svgColor : props.theme.textColor)};
    border: 1px solid ${(props) => props.theme.textColor};
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    cursor: ${(props) => (props.isVerify ? "not-allowed" : "cursor")};
    align-items: center;
`;
const EmailWrapper = styled.div`
    position: relative;
`;
const ChangeBtn = styled.span`
    position: absolute;
    right: 10px;
    text-decoration: underline;
    cursor: pointer;
    bottom: 50%;
    margin: auto 0;
`;
const SInput = styled.input.attrs({ autoComplete: "off" })`
    width: 100%;
    font-size: 16px;
    background-color: ${(props) =>
        props.isVerify ? props.theme.hoverColor : props.theme.inputColor};
    color: ${(props) => (props.isVerify ? props.theme.svgColor : props.theme.textColor)};
    border: 1px solid
        ${(props) => (props.errors ? props.theme.colors.red : props.theme.textColor)};
    padding: 15px 10px;
    margin-bottom: ${(props) => (props.errors ? "5px" : "10px")};
    border-radius: 5px;
    cursor: ${(props) => (props.isVerify ? "not-allowed" : "auto")};
`;
const ErrorText = styled.div`
    color: ${(props) => props.theme.colors.red};
    margin-bottom: 10px;
`;
const SText = styled.span`
    display: block;
    text-align: right;
    margin-top: 10px;
    & span {
        cursor: pointer;
        margin-left: 10px;
        font-size: 16px;
        color: ${(props) => props.theme.accentColor};
    }
`;

function Auth() {
    const location = useLocation();
    const [isSignup, setIsSignup] = useState(false);
    const [{ user, loading }, setIsAuth] = useRecoilState(isAuthAtom);
    const [inputNumber, setInputNumber] = useState();
    const [verify, setVerify] = useRecoilState(verifyEmailAtom);
    const resetVerifyEmail = useResetRecoilState(verifyEmailAtom);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm();

    const from = location.state && location.state.from;

    if (user) {
        return <Redirect to={from || "/"} />;
    }

    const handleVerifyEmail = async () => {
        const email = watch("email");
        if (verify.success) {
            toast("?????? ??????????????????", { icon: "????" });
            return;
        }
        setVerify({ ...verify, loading: true });
        try {
            const res = await sendEmailApi({ email });
            setVerify({
                ...verify,
                loading: false,
                number: res.data,
                email,
            });
        } catch (error) {
            toast.error(error.response.data.message);
            resetVerifyEmail();
        }
    };

    const handleInput = (e) => {
        if (e.target.value.length > 6 || verify.success) {
            return e.preventDefault();
        }
        if (parseInt(e.target.value) === verify.number) {
            toast.success("????????? ?????? ??????");
            setVerify({ ...verify, success: true });
        }
        setInputNumber(e.target.value);
    };

    const onValid = async (data) => {
        setIsAuth({ user: null, loading: true });
        if (isSignup) {
            if (!verify.success) {
                toast.error("????????? ????????? ????????????");
                return;
            }
            try {
                await signupApi(data);
                setIsAuth({ loading: false, user: null });
                toast.success("???????????? ??????");
                setIsSignup(false);
                resetVerifyEmail();
            } catch (error) {
                setIsAuth({ loading: false, user: null });
                toast.error("????????? ???????????????");
            }
        }
        if (!isSignup) {
            try {
                const response = await signinApi(data);
                setIsAuth({ loading: false, user: response.data.user });
                // loginHandler(response.data);
                toast.success("???????????? ?????? ??? ???????????????");
            } catch (error) {
                setIsAuth({ loading: false, user: null });
                toast.error("????????? ???????????????");
                console.log(error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onValid)}>
            <AuthContainer>
                <ImgWrapper>
                    <SvgWelcome width="100%" height="auto" />
                </ImgWrapper>
                <EmailWrapper>
                    <SInput
                        {...register("email", {
                            required: "???????????? ?????????????????????.",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "?????????????????? ????????????.",
                            },
                            onChange: () => {
                                if (verify.email) {
                                    setValue("email", verify.email);
                                }
                            },
                        })}
                        placeholder="?????????"
                        errors={errors.email}
                        isVerify={verify.email}
                    />
                    {isSignup && verify.email && (
                        <ChangeBtn
                            onClick={() => {
                                resetVerifyEmail();
                                setInputNumber();
                            }}
                        >
                            ??????
                        </ChangeBtn>
                    )}
                </EmailWrapper>
                {isSignup && (
                    <VerifyWrapper>
                        <VerifyBtn
                            onClick={verify.loading ? () => {} : handleVerifyEmail}
                            isVerify={verify.success}
                        >
                            {verify.loading ? (
                                <Loader isCenter={false} height="14px" width="14px" />
                            ) : verify.number ? (
                                verify.success ? (
                                    "????????????"
                                ) : (
                                    "?????? ?????????"
                                )
                            ) : verify.success ? (
                                "????????????"
                            ) : (
                                "????????? ??????"
                            )}
                        </VerifyBtn>
                        {verify.number && (
                            <VerifyInput
                                value={inputNumber}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                onChange={handleInput}
                                placeholder="???????????? ex)123456"
                                isVerify={verify.success}
                            />
                        )}
                    </VerifyWrapper>
                )}
                {errors.email && errors.email.message && (
                    <ErrorText>{errors.email.message}</ErrorText>
                )}
                {isSignup && (
                    <>
                        <SInput
                            {...register("nickname", {
                                required: "???????????? ?????????????????????",
                                minLength: {
                                    value: 2,
                                    message: "?????? 2?????????????????? ?????????.",
                                },
                                maxLength: { value: 12, message: "?????? 12????????????." },
                            })}
                            placeholder="?????????"
                            errors={errors.nickname}
                        />
                        {errors.nickname && errors.nickname.message && (
                            <ErrorText>{errors.nickname.message}</ErrorText>
                        )}
                    </>
                )}

                <SInput
                    {...register("password", {
                        required: "??????????????? ?????????????????????.",
                        minLength: { value: 6, message: "?????? 6?????????????????? ?????????." },
                    })}
                    type="password"
                    placeholder="????????????"
                    errors={errors.password}
                />
                {errors.password && errors.password.message && (
                    <ErrorText>{errors.password.message}</ErrorText>
                )}
                {isSignup && (
                    <>
                        <SInput
                            {...register("password1", {
                                required: "???????????? ????????? ?????????????????????.",
                                validate: (value) =>
                                    value === watch("password") || "??????????????? ????????????.",
                            })}
                            type="password"
                            placeholder="???????????? ??????"
                            errors={errors.password1}
                        />
                        {errors.password1 && errors.password1.message && (
                            <ErrorText>{errors.password1.message}</ErrorText>
                        )}
                    </>
                )}

                <Button disabled={loading}>
                    {loading ? (
                        <Loader isCenter={false} height="24px" width="24px" />
                    ) : isSignup ? (
                        "????????????"
                    ) : (
                        "?????????"
                    )}
                </Button>
                <SText>
                    {isSignup ? (
                        <>
                            ???????????? ????????????????
                            <span onClick={() => setIsSignup((prev) => !prev)}>
                                ???????????????
                            </span>
                        </>
                    ) : (
                        <>
                            ???????????? ????????????????
                            <span onClick={() => setIsSignup((prev) => !prev)}>
                                ??????????????????
                            </span>
                        </>
                    )}
                </SText>
            </AuthContainer>
        </form>
    );
}

export default Auth;
