import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Camera, Plus, Search, TimesCircle } from "@styled-icons/fa-solid";
import { TrashAlt } from "@styled-icons/fa-regular";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import toast from "react-hot-toast";

import Avatar from "../../Componenets/Avatar";
import RouteGuard from "../../Componenets/RouteGuard";
import CategorySelect from "../../Componenets/CategorySelect";
import Modal from "../../Componenets/Modal";
import ProDetail from "../../Componenets/ProDetail";
import ProCard from "../../Componenets/ProCard";
import DaumPost from "../../Componenets/DaumPost";
import Img from "../../Images/proImg.svg";
import Img2 from "../../Images/proImg2.svg";
import Img3 from "../../Images/proImg3.svg";
import useBlockEnter from "../../hooks/useBlockEnter";
import { registerProApi, updateProApi } from "../../api";
import { isLogoutAtom } from "../../atoms/isLogout";
import { myProDataTrigger } from "../../atoms/isProAtom";

function ProForm({ isUpdate, proData }) {
    const history = useHistory();
    const imgRef = useRef();
    const photoRef = useRef();
    const categoryRef = useRef();
    const firstColumnRef = useRef();
    const secondColumnRef = useRef();
    const thirdColumnRef = useRef();
    const isLogout = useRecoilValue(isLogoutAtom);
    const setProDataTigger = useSetRecoilState(myProDataTrigger);
    const [materialText, setMaterialText] = useState("");
    const [materialArr, setMaterialArr] = useState(proData?.material || []);
    const [photos, setPhotos] = useState(proData?.photos || []);
    const [files, setFiles] = useState(proData?.photos || []);
    const [modal, setModal] = useState(false);
    const [preview, setPreview] = useState(false);
    const [isCardPreview, setIsCardPreview] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [submit, setSubmit] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
        watch,
        reset,
    } = useForm({
        defaultValues: useMemo(() => {
            if (isUpdate)
                return {
                    ...proData,
                    isLocation: proData.isLocation ? "yes" : "no",
                    isFreePT: proData.isFreePT ? "yes" : "no",
                };
        }, [isUpdate, proData]),
    });

    useBlockEnter();
    useEffect(() => {
        if (isUpdate) {
            reset({
                ...proData,
                isLocation: proData.isLocation ? "yes" : "no",
                isFreePT: proData.isFreePT ? "yes" : "no",
            });
        }
    }, [proData, isUpdate, reset]);

    const watchAll = watch();

    useEffect(() => {
        if (firstColumnRef) {
            firstColumnRef.current?.scrollIntoView();
        }
    }, [firstColumnRef]);

    useEffect(() => {
        if (watchAll.avatar) {
            clearErrors("avatar");
        }
    }, [watchAll.avatar, clearErrors]);

    useEffect(() => {
        if (watchAll.category) {
            clearErrors("category");
        }
    }, [watchAll.category, clearErrors]);

    useEffect(() => {
        if (watchAll.location) {
            clearErrors("location");
        }
    }, [watchAll.location, clearErrors]);

    useEffect(() => {
        if (files.length >= 4) {
            clearErrors("photos");
        }
        if (files.length >= 8) {
            toast.error("최대 8장입니다");
            return;
        }
    }, [files.length, clearErrors]);

    useEffect(() => {
        if (watchAll.isLocation === "no") {
            setModal(false);
            setValue("location", "");
        }
    }, [watchAll.isLocation, setValue]);

    const handlePhotoChange = (e) => {
        setPhotos((prev) => [...prev, URL.createObjectURL(e.target.files[0])]);
        setFiles((prev) => [...prev, e.target.files[0]]);
    };

    const handlePhotoDelete = (index) => {
        const filterdPhotos = photos.filter((__, i) => i !== index);
        setPhotos(filterdPhotos);
        const filterdFiles = files.filter((__, i) => i !== index);
        setFiles(filterdFiles);
    };

    const handleDaumComplete = (data) => {
        let fullAddr = data.address;
        let extraAddr = "";

        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddr += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddr +=
                    extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddr += extraAddr !== "" ? ` (${extraAddr})` : "";
        }
        setModal(false);
        setValue("location", fullAddr);
    };

    const onValid = async (data) => {
        setDisabled(true);
        const formData = new FormData();
        formData.append("avatar", data.avatar);
        for (let i = 0; i < files.length; i++) {
            formData.append("photos", files[i]);
        }
        formData.append("name", data.name);
        formData.append("category", data.category);
        formData.append("career", data.career);
        formData.append("title", data.title);
        formData.append("selfIntroduction", data.selfIntroduction);
        formData.append("programIntroduction", data.programIntroduction);
        formData.append("price", data.price);
        formData.append("time", data.time);
        formData.append("isFreePT", data.isFreePT);
        formData.append("isLocation", data.isLocation);
        formData.append("location", data.location);
        for (let i = 0; i < materialArr?.length; i++) {
            formData.append("material", materialArr[i]);
        }

        if (!watchAll.avatar) {
            setError("avatar", {
                message: "프로필 사진은 필수입니다",
            });
            toast.error("프로필 사진은 필수입니다");
            firstColumnRef.current.scrollIntoView();
            setDisabled(false);

            return;
        }
        if (files.length < 4) {
            setError("photos", {
                message: "프로그램 사진은 최소 4장입니다.",
            });
            toast.error("프로그램 사진은 최소 4장입니다");
            secondColumnRef.current.scrollIntoView();
            setDisabled(false);

            return;
        }
        if (watchAll.isLocation === "yes" && !watchAll.location) {
            setError("location", {
                message: "운동장소 주소를 설정해주세요",
            });
            toast.error("운동장소 주소를 설정해주세요");
            thirdColumnRef.current.scrollIntoView();
            setDisabled(false);

            return;
        }
        if (isUpdate) {
            const updatePro = updateProApi(formData);
            toast.promise(updatePro, {
                loading: "프로 프로필 수정 중...",
                success: "프로 프로필 수정 성공",
                error: "프로 프로필 수정 실패",
            });
            try {
                await updatePro;
                setProDataTigger(Date.now());
                setSubmit(false);
                setDisabled(false);
                history.push("/pro");
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            const registerPro = registerProApi(formData);
            toast.promise(registerPro, {
                loading: "프로 프로필 생성 중...",
                success: "프로 프로필 생성 성공",
                error: "프로 프로필 생성 실패",
            });
            try {
                await registerPro;
                setProDataTigger(Date.now());
                setSubmit(false);
                setDisabled(false);
                history.push("/pro");
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
    };

    return (
        <Wrapper>
            <SForm onSubmit={handleSubmit(onValid)} encType="multipart/form-data">
                <Header>
                    <Title>나의 프로프로필 등록</Title>
                    <HeaderItem>
                        <span onClick={() => setPreview(!preview)}>미리보기</span>
                        <input
                            onClick={() => setSubmit(true)}
                            type="submit"
                            value={isUpdate ? "수정" : "완성"}
                            disabled={disabled}
                        />
                    </HeaderItem>
                </Header>
                <Container ref={firstColumnRef}>
                    <Item>
                        <ItemImg src={Img3} />
                    </Item>
                    <Item>
                        <RouteGuard
                            shouldGuard={!(isLogout || submit)}
                            title="정말 나가시겠습니까?"
                        />
                        <ItemTitle>자기소개</ItemTitle>

                        <>
                            <Column>
                                <ItemText>
                                    본인의 얼굴이 나오는 프로필 사진과 본명을 적으세요
                                </ItemText>
                                <Profile>
                                    <AvatarWrapper>
                                        {watchAll?.avatar ? (
                                            <Avatar
                                                src={watchAll?.avatar}
                                                onClick={() => imgRef.current.click()}
                                                click={true}
                                            />
                                        ) : (
                                            <Avatar
                                                onClick={() => imgRef.current.click()}
                                                click={true}
                                            />
                                        )}
                                        <CameraEmoji />
                                    </AvatarWrapper>
                                    <input
                                        type="file"
                                        name="avatar"
                                        onChange={(e) =>
                                            setValue("avatar", e.target.files[0])
                                        }
                                        ref={imgRef}
                                        hidden={true}
                                    />
                                    <SInput
                                        {...register("name", {
                                            required: "본명은 필수항목입니다.",
                                            minLength: {
                                                value: 2,
                                                message: "최소 1자이상이여야 합니다.",
                                            },
                                            maxLength: {
                                                value: 6,
                                                message: "최대 6자입니다.",
                                            },
                                        })}
                                        placeholder="본명"
                                        error={errors.name}
                                    />
                                </Profile>
                                {errors.name && errors.name.message && (
                                    <ErrorText>{errors.name.message}</ErrorText>
                                )}
                                {errors.avatar && errors.avatar.message && (
                                    <ErrorText>{errors.avatar.message}</ErrorText>
                                )}
                            </Column>
                            <Column>
                                <ItemText>본인의 운동종목과 경력을 적으세요</ItemText>
                                <InputTextWrapper>
                                    <CategorySelect
                                        category={watchAll.category}
                                        setValue={setValue}
                                        error={errors.category}
                                    />
                                    <input
                                        ref={categoryRef}
                                        {...register("category", {
                                            required: "본인의 주요 운동은 필수입니다.",
                                        })}
                                        readOnly={true}
                                        hidden={true}
                                    />

                                    <SInput
                                        type="number"
                                        {...register("career", {
                                            required: "경력은 필수입니다.",
                                            max: {
                                                value: 50,
                                                message: "최대 경력은 50년입니다.",
                                            },
                                            min: {
                                                value: 1,
                                                message: "최소 경력이 있어야합니다.",
                                            },
                                        })}
                                        placeholder="경력"
                                        error={errors.career}
                                    />
                                    <span>년</span>
                                </InputTextWrapper>
                                {errors.career && errors.career.message && (
                                    <ErrorText>{errors.career.message}</ErrorText>
                                )}
                                {errors.category && errors.category.message && (
                                    <ErrorText>{errors.category.message}</ErrorText>
                                )}
                            </Column>
                            <Column>
                                <ItemText>본인을 한 줄로 표현하면 무엇인가요?</ItemText>
                                <SInput
                                    {...register("title", {
                                        required: "자기소개 요약글은 필수입니다",
                                        minLength: {
                                            value: "10",
                                            message: "최소 10자 이상입니다",
                                        },
                                        maxLength: {
                                            value: "40",
                                            message: "최대 40자입니다.",
                                        },
                                    })}
                                    placeholder="ex) 밝은 에너지와 열정으로 원하는 목표를 이룰 수 있도록 열심히 돕겠습니다"
                                    error={errors.title}
                                />
                                {watchAll?.title && (
                                    <Count>
                                        {watchAll.title?.length < 10
                                            ? `최소 ${
                                                  10 - watchAll?.title?.length
                                              }자를 더 입력하세요`
                                            : `${watchAll?.title?.length} / 40`}
                                    </Count>
                                )}
                                {errors.title && errors.title.message && (
                                    <ErrorText>{errors.title.message}</ErrorText>
                                )}
                            </Column>

                            <Column>
                                <ItemText>본인이 프로인 이유는 무엇인가요?</ItemText>
                                <TextArea
                                    {...register("selfIntroduction", {
                                        required: "자기소개글은 필수입니다",
                                        minLength: {
                                            value: "150",
                                            message: `최소 150자 이상입니다.`,
                                        },
                                        maxLength: {
                                            value: "850",
                                            message: "최대 850자입니다.",
                                        },
                                    })}
                                    placeholder="본인의 특별한 점, 성격, 이력 등을 자세하게 적으세요"
                                    error={errors.selfIntroduction}
                                />
                                {watchAll?.selfIntroduction && (
                                    <Count>
                                        {watchAll.selfIntroduction?.length < 150
                                            ? `최소 ${
                                                  150 - watchAll?.selfIntroduction?.length
                                              }자를 더 입력하세요`
                                            : `${watchAll?.selfIntroduction?.length} / 850`}
                                    </Count>
                                )}
                                {errors.selfIntroduction &&
                                    errors.selfIntroduction.message && (
                                        <ErrorText>
                                            {errors.selfIntroduction.message}
                                        </ErrorText>
                                    )}
                            </Column>
                        </>
                    </Item>
                </Container>
                <Container ref={secondColumnRef}>
                    <Item>
                        <ItemTitle>프로그램</ItemTitle>

                        <>
                            <Column>
                                <ItemText>프로그램을 나타내는 사진을 올리세요</ItemText>
                                <EmojiBtn
                                    onClick={() => {
                                        photoRef.current.click();
                                    }}
                                >
                                    <Camera width="15px" />
                                    <span>사진추가</span>
                                </EmojiBtn>
                                <input
                                    type="file"
                                    name="photos"
                                    onChange={handlePhotoChange}
                                    ref={photoRef}
                                    hidden={true}
                                />

                                {photos && (
                                    <>
                                        <PhotoContainer>
                                            {photos.map((photo, index) => (
                                                <PhotoWrapper key={index}>
                                                    <PhotoImg
                                                        id={index}
                                                        width="100px"
                                                        src={photo}
                                                    />
                                                    <EmojiWrapper
                                                        onClick={() =>
                                                            handlePhotoDelete(index)
                                                        }
                                                    >
                                                        <TrashAlt
                                                            width="14px"
                                                            color="black"
                                                        />
                                                    </EmojiWrapper>
                                                </PhotoWrapper>
                                            ))}
                                        </PhotoContainer>
                                        <Count>
                                            {photos.length < 4
                                                ? `최소 ${
                                                      4 - photos?.length
                                                  }장을 더 업로드하세요`
                                                : `최대 8장까지 가능합니다`}
                                        </Count>
                                        {errors.photos && errors.photos.message && (
                                            <ErrorText>{errors.photos.message}</ErrorText>
                                        )}
                                    </>
                                )}
                            </Column>
                            <Column>
                                <ItemText>
                                    본인의 프로그램이 특별한 이유는 무엇인가요?
                                </ItemText>
                                <TextArea
                                    {...register("programIntroduction", {
                                        required: "프로그램 소개글은 필수입니다",
                                        minLength: {
                                            value: "150",
                                            message: `최소 150자 이상입니다.`,
                                        },
                                        maxLength: {
                                            value: "850",
                                            message: "최대 850자입니다.",
                                        },
                                    })}
                                    placeholder="프로그램의 일정, 특별한 점 등을 자세하게 적으세요"
                                    error={errors.programIntroduction}
                                />
                                {watchAll?.programIntroduction && (
                                    <Count>
                                        {watchAll.programIntroduction?.length < 150
                                            ? `최소 ${
                                                  150 -
                                                  watchAll?.programIntroduction?.length
                                              }자를 더 입력하세요`
                                            : `${watchAll?.programIntroduction?.length} / 850`}
                                    </Count>
                                )}
                                {errors.programIntroduction &&
                                    errors.programIntroduction.message && (
                                        <ErrorText>
                                            {errors.programIntroduction.message}
                                        </ErrorText>
                                    )}
                            </Column>
                        </>
                    </Item>
                    <Item>
                        <ItemImg src={Img2} />
                    </Item>
                </Container>
                <Container ref={thirdColumnRef}>
                    <Item>
                        <ItemImg src={Img} />
                    </Item>
                    <Item>
                        <ItemTitle>질문</ItemTitle>
                        <Column>
                            <ItemText>
                                프로그램 1회당 가격과 소요시간은 어떻게 되나요?
                            </ItemText>
                            <RowContainer>
                                <InputTextWrapper>
                                    <SInput
                                        type="number"
                                        {...register("price", {
                                            required: "가격은 필수입니다.",
                                        })}
                                        placeholder="가격"
                                        error={errors.price}
                                    />
                                    <span>원</span>
                                </InputTextWrapper>
                                <InputTextWrapper>
                                    <SInput
                                        type="number"
                                        {...register("time", {
                                            required: "소요시간은 필수입니다.",
                                        })}
                                        placeholder="소요시간"
                                        error={errors.time}
                                    />
                                    <span>분</span>
                                </InputTextWrapper>
                            </RowContainer>
                            {errors.price && errors.price.message && (
                                <ErrorText>{errors.price.message}</ErrorText>
                            )}
                        </Column>
                        <Column>
                            <ItemText>프로그램 1회 무료강습이 가능한가요?</ItemText>
                            <RadioBtn>
                                <input
                                    type="radio"
                                    {...register("isFreePT", {
                                        required: "무료강습 가능여부를 체크해주세요",
                                    })}
                                    error={errors.isPreePT}
                                    value="yes"
                                />
                                <span>네</span>
                            </RadioBtn>
                            <RadioBtn>
                                <input
                                    type="radio"
                                    {...register("isFreePT", {
                                        required: "무료강습 가능여부를 체크해주세요",
                                    })}
                                    error={errors.isPreePT}
                                    value="no"
                                />
                                <span>아니오</span>
                            </RadioBtn>
                            {errors.isFreePT && errors.isFreePT.message && (
                                <ErrorText>{errors.isFreePT.message}</ErrorText>
                            )}
                        </Column>

                        <Column>
                            <ItemText>프로그램을 진행할 장소가 있나요?</ItemText>
                            <RadioBtn>
                                <input
                                    type="radio"
                                    {...register("isLocation", {
                                        required:
                                            "프로그램 진행할 장소 여부를 체크해주세요",
                                    })}
                                    error={errors.isLocation}
                                    checked={watchAll.isLocation === "yes"}
                                    value="yes"
                                />
                                <span>네</span>
                            </RadioBtn>
                            <RadioBtn>
                                <input
                                    type="radio"
                                    {...register("isLocation", {
                                        required:
                                            "프로그램 진행할 장소 여부를 체크해주세요",
                                    })}
                                    error={errors.isLocation}
                                    checked={watchAll.isLocation === "no"}
                                    value="no"
                                />
                                <span>아니오</span>
                            </RadioBtn>
                            {errors.isLocation && errors.isLocation.message && (
                                <ErrorText>{errors.isLocation.message}</ErrorText>
                            )}
                            <Modal show={modal} setShow={setModal} title="주소검색">
                                <DaumWrapper>
                                    <DaumPost handleComplete={handleDaumComplete} />
                                </DaumWrapper>
                            </Modal>
                        </Column>
                        <Column>
                            {watchAll.isLocation === "yes" && (
                                <>
                                    <LocationBox>
                                        <LocationBoxItem>
                                            <div>장소</div>
                                            <LocationText
                                                onClick={() => setModal(!modal)}
                                            >
                                                주소검색
                                                <Search height="14px" />
                                            </LocationText>
                                        </LocationBoxItem>
                                        {watchAll.location && (
                                            <LocationInput
                                                {...register("location")}
                                                readOnly={true}
                                            />
                                        )}
                                    </LocationBox>
                                    {errors.location && errors.location.message && (
                                        <ErrorText>{errors.location.message}</ErrorText>
                                    )}
                                </>
                            )}
                        </Column>
                        <Column>
                            <ItemText>
                                프로그램진행에 준비물이 필요하면 추가하세요(선택사항)
                            </ItemText>
                            <MaterialWrapper>
                                <input
                                    value={materialText}
                                    onChange={(e) => setMaterialText(e.target.value)}
                                    placeholder="ex) 운동화,샤워용품 등"
                                />
                                <Plus
                                    className="plus-btn"
                                    width="16px"
                                    onClick={() => {
                                        setMaterialText("");
                                        setMaterialArr((prev) => [...prev, materialText]);
                                    }}
                                />
                            </MaterialWrapper>
                            <MaterialContainer>
                                {materialArr?.map((m, index) => (
                                    <div key={index} id={index}>
                                        <span>{m}</span>
                                        <TimesCircle
                                            width="20px"
                                            className="times-btn"
                                            onClick={() => {
                                                const deleted = materialArr.filter(
                                                    (__, i) => i !== index
                                                );
                                                setMaterialArr(deleted);
                                            }}
                                        />
                                    </div>
                                ))}
                            </MaterialContainer>
                            {/* <input {...register("material")} hidden={true} /> */}
                        </Column>
                    </Item>
                </Container>
            </SForm>
            <Modal
                show={preview}
                setShow={setPreview}
                title={
                    <Button onClick={() => setIsCardPreview(!isCardPreview)}>
                        {isCardPreview ? "자세히 보기" : "간략히 보기"}
                    </Button>
                }
            >
                <Preview isCardPreview={isCardPreview}>
                    {isCardPreview ? (
                        <CardContainer>
                            <ProCard data={watchAll} />
                        </CardContainer>
                    ) : (
                        <ProDetail data={watchAll} photos={photos} />
                    )}
                </Preview>
            </Modal>
        </Wrapper>
    );
}

export default ProForm;

const Wrapper = styled.div`
    width: 100%;
`;
const Header = styled.div`
    position: sticky;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
    border-bottom: 1px dashed ${(props) => props.theme.svgColor};
    background-color: ${(props) => props.theme.bgColor};
    height: 80px;
    font-size: 18px;
    font-weight: 700;
    z-index: 10;
    width: 100%;

    & span {
        display: inline-block;
        margin-right: 20px;
        text-decoration: underline;
        cursor: pointer;
    }
    & input {
        font-size: 18px;
        font-weight: 700;
        padding: 10px 15px;
        background-color: ${(props) => props.theme.accentColor};
        color: ${(props) => props.theme.colors.white};
        cursor: pointer;
    }
`;
const HeaderItem = styled.div``;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 100px 0;
    border-bottom: 1px dashed ${(props) => props.theme.svgColor};
    @media screen and (max-width: 1024px) {
        flex-direction: column;
        margin-top: 20px;
        padding: 20px 0;
    }
    &:nth-child(3) {
        @media screen and (max-width: 1024px) {
            flex-direction: column-reverse;
        }
    }
`;
const Item = styled.div`
    width: 42%;
    flex-basis: auto;
    @media screen and (max-width: 1024px) {
        width: 100%;
        margin-bottom: 20px;
        padding: 0;
    }
`;
const ItemImg = styled.img`
    width: 100%;
    height: auto;
`;
const ItemTitle = styled.div`
    font-size: 28px;
    font-weight: 700;
`;
const ItemText = styled.div`
    font-size: 18px;
    margin-bottom: 10px;
`;
const Column = styled.div`
    margin-top: 15px;
`;
const SForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
`;
const Title = styled.div`
    font-size: 32px;
    font-weight: 700;
    margin: 10px 0;
`;
const SInput = styled.input.attrs({ autoComplete: "off" })`
    width: 100%;
    font-size: 16px;
    background-color: ${(props) => props.theme.inputColor};

    color: ${(props) => props.theme.textColor};
    border: 1px solid
        ${(props) => (props.error ? props.theme.colors.red : props.theme.borderColor)};
    padding: 15px 10px;
    border-radius: 5px;
`;

const Profile = styled.div`
    display: flex;
    align-items: center;
    & input {
        width: 150px;
        margin: 0;
    }
`;
const AvatarWrapper = styled.div`
    position: relative;
    margin-right: 15px;
`;
const RowContainer = styled.div`
    display: flex;
    gap: 20px;
`;
const InputTextWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 3px;
    & input {
        width: 110px;
        text-align: right;
    }
    & span {
        font-size: 18px;
    }
`;
const CameraEmoji = styled(Camera)`
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 1;
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => props.theme.accentColor};
    padding: 3px;
    border-radius: 50%;
    width: 24px;
    border: 1px solid ${(props) => props.theme.textColor};
`;
const PhotoContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`;
const PhotoWrapper = styled.div`
    position: relative;
    width: 160px;
    height: 200px;
`;
const PhotoImg = styled.img`
    width: inherit;
    height: inherit;
    object-fit: cover;
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
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    background-color: white;
    border-radius: 50%;
    cursor: pointer;
`;
const ErrorText = styled.div`
    color: ${(props) => props.theme.colors.red};
    margin-bottom: 2px;
`;
const TextArea = styled.textarea`
    resize: none;
    width: 100%;
    height: 240px;
    font-weight: 100;
    color: ${(props) => props.theme.textColor};
    border: 1px solid
        ${(props) => (props.error ? props.theme.colors.red : props.theme.borderColor)};
    background-color: ${(props) => props.theme.inputColor};
    padding: 10px;
    font-size: 16px;
    outline: none;
    border-radius: 5px;
`;
const Count = styled.div`
    color: ${(props) => props.theme.textColor};
    font-weight: 100;
`;
const EmojiBtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 45px;
    background-color: ${(props) => props.theme.accentColor};
    color: ${(props) => props.theme.colors.white};
    cursor: pointer;
    border-radius: 5px;
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 10px;
    & span {
        margin-left: 3px;
    }
`;
const RadioBtn = styled.label`
    & input {
        display: none;
    }
    & span {
        display: inline-block;
        padding: 0 24px;
        height: 45px;
        line-height: 43px;
        text-align: center;
        border: 1px solid ${(props) => props.theme.borderColor};
        background-color: ${(props) => props.theme.inputColor};
        margin-right: 20px;
        cursor: pointer;
        border-radius: 5px;
        font-size: 16px;
    }
    & input:checked + span {
        background-color: ${(props) => props.theme.accentColor};
        color: ${(props) => props.theme.colors.white};
        border: 1px solid ${(props) => props.theme.accentColor};
    }
`;
const DaumWrapper = styled.div`
    width: 420px;
`;
const LocationBox = styled.div`
    display: flex;
    width: fit-content;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    padding: 20px 0;
    border-top: 1px solid ${(props) => props.theme.borderColor};
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;
const LocationBoxItem = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 16px;
`;
const LocationText = styled.div`
    display: flex;
    gap: 3px;
    align-items: center;
    cursor: pointer;
    font-weight: 700;
    padding-bottom: 2px;
    border-bottom: 1px solid ${(props) => props.theme.textColor};
`;
const LocationInput = styled.input`
    background-color: ${(props) => props.theme.bgColor};
    padding-top: 15px;
    font-size: 14px;
    width: 100%;
    color: ${(props) => props.theme.borderColor};
    font-weight: 400;
`;
const MaterialWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: fit-content;
    height: 52px;
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 5px;
    background-color: ${(props) => props.theme.inputColor};

    & input {
        background-color: ${(props) => props.theme.inputColor};
        font-size: 16px;
        padding: 5px;
        width: 200px;
        color: ${(props) => props.theme.textColor};
    }
    & .plus-btn {
        height: 48px;
        width: 48px;
        padding: 14px;
        border-left: 1px solid ${(props) => props.theme.borderColor};
        color: ${(props) => props.theme.accentColor};
        cursor: pointer;
    }
`;

const MaterialContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    margin-top: 10px;
    & div {
        display: flex;
        align-items: center;
        padding: 8px 10px;
        gap: 8px;
        border-radius: 5px;
        font-size: 14px;
        border: 1px solid ${(props) => props.theme.borderColor};
        background-color: ${(props) => props.theme.colors.inputColor};
        font-weight: 400;
    }
    & .times-btn {
        cursor: pointer;
    }
`;

const Preview = styled.div`
    width: ${(props) => (props.isCardPreview ? "100%" : "90vw")};
    max-width: 1480px;
    max-height: 80vh;
    overflow-y: ${(props) => (props.isCardPreview ? "" : "scroll")};
    & h5 {
        font-size: 20px;
        font-weight: 700;
        margin: 20px 0;
    }
`;

const CardContainer = styled.div`
    width: 400px;
`;

const Button = styled.div`
    background-color: ${(props) => props.theme.inputColor};
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    border: 1px solid ${(props) => props.theme.borderColor};
`;
