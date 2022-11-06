import React, { useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { AngleRight } from "@styled-icons/fa-solid";

const Select = styled.div`
    position: relative;
    display: inline-block;
    width: 30%;
    font-size: 16px;
    background-color: ${(props) => props.theme.inputColor};

    color: ${(props) => props.theme.textColor};
    cursor: pointer;
    border: 1px solid
        ${(props) => (props.error ? props.theme.colors.red : props.theme.borderColor)};
    padding: 15px 10px;
    border-radius: 5px;
    font-weight: 400;
    & span {
        color: gray;
    }
`;
const SelectItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CategoryContainer = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
    max-width: 250px;
`;
const SCategory = styled.div`
    display: inline-block;
    padding: 12px 16px;
    font-size: 16px;
    border: 1px solid ${(props) => props.theme.textColor};
    background-color: ${(props) => props.theme.inputColor};
    border-radius: 10px;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
    }
`;
const AngleIcon = styled(AngleRight)`
    width: 18px;
    height: 18px;
`;

const categoryArr = [
    "헬스",
    "요가",
    "필라테스",
    "수영",
    "테니스",
    "골프",
    "클라이밍",
    "기타",
];

function CategorySelect({ error, category, setValue }) {
    const [show, setShow] = useState(false);

    return (
        <>
            <Select onClick={() => setShow(!show)} error={error}>
                <SelectItem>
                    {category ? category : <span>운동</span>}
                    <AngleIcon />
                </SelectItem>
            </Select>
            <Modal show={show} setShow={setShow} title="운동">
                <CategoryContainer>
                    {categoryArr.map((c) => (
                        <SCategory
                            key={c}
                            onClick={() => {
                                setValue("category", c);
                                setShow(!show);
                            }}
                        >
                            {c}
                        </SCategory>
                    ))}
                </CategoryContainer>
            </Modal>
        </>
    );
}

export default CategorySelect;
