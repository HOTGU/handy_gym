import React, { useState } from "react";
import styled from "styled-components";
import { Search } from "@styled-icons/fa-solid";
import { getAddressByTerm } from "../api";
import Spinner from "./Loader";

const SearchContainer = styled.div`
    position: relative;
    width: 100%;
`;

const CategoryContainer = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    width: 300px;
`;
const SearchBar = styled.div`
    position: relative;
    width: 100%;
    height: 50px;
    border: 1px solid ${(props) => props.theme.textColor};
    background-color: ${(props) => props.theme.inputColor};
    padding: 0 10px;
`;
const SInput = styled.input.attrs({ autoComplete: "off", autoFocus: true })`
    height: 100%;
    width: 100%;
    font-weight: 700;
    z-index: -1;
    outline: none;
    color: ${(props) => props.theme.textColor};
    border: none;
    font-size: 16px;
`;
const IconWrapper = styled.div`
    position: absolute;
    display: inline-flex;
    right: 0;
    top: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
    width: 50px;
`;
const SearchIcon = styled(Search)`
    height: 20px;
    width: 20px;
    color: ${(props) => props.theme.textColor};
`;
const Result = styled.ul`
    width: 100%;
    border-right: 1px solid ${(props) => props.theme.textColor};
    border-left: 1px solid ${(props) => props.theme.textColor};
    border-bottom: 1px solid ${(props) => props.theme.textColor};
    background-color: ${(props) => props.theme.inputColor};
    max-height: 300px;
    overflow: auto;
    li {
        font-size: 16px;
        cursor: pointer;
        padding: 15px 10px;
        &:hover {
            background-color: ${(props) => props.theme.hoverColor};
        }
    }
`;
const NoData = styled.div`
    padding: 15px 5px;
    font-size: 16px;
    color: ${(props) => props.theme.colors.red};
`;

const initResult = {
    address: [],
    noData: false,
};

function AddressSearch({ setValue, show, setShow }) {
    const [term, setTerm] = useState("");
    const [result, setResult] = useState(initResult);
    const [isLoading, setIsLoading] = useState(false);

    const searchLocation = async () => {
        if (term.length) {
            setIsLoading(true);
            const { data } = await getAddressByTerm(term);
            setResult({
                address: data,
                noData: data?.length === 0,
            });
            setIsLoading(false);
        }
    };

    return (
        <CategoryContainer>
            <SearchContainer>
                <SearchBar>
                    <SInput
                        type="text"
                        name="term"
                        value={term}
                        placeholder="읍면동으로 검색하세요"
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setResult(initResult);
                            }
                            setTerm(e.target.value);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                searchLocation();
                            }
                        }}
                    />
                    <IconWrapper>
                        {isLoading ? <Spinner isCenter={false} /> : <SearchIcon />}
                    </IconWrapper>
                </SearchBar>
                {result?.address?.length > 0 ? (
                    <Result>
                        {result.address.map((a) => (
                            <li
                                key={a._id}
                                onClick={() => {
                                    setValue("location", a.fulladd);
                                    setShow(!show);
                                }}
                            >
                                {a.fulladd}
                            </li>
                        ))}
                    </Result>
                ) : (
                    result?.noData && <NoData>검색결과가 없습니다</NoData>
                )}
            </SearchContainer>
        </CategoryContainer>
    );
}

export default AddressSearch;
