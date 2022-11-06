import React, { useState } from "react";
import NoImg from "../Images/photo.svg";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "@styled-icons/fa-solid";

function Carousel({ images }) {
    const [index, setIndex] = useState(0);
    const handlePrev = () => {
        const nextIndex = index - 1;

        if (nextIndex < 0) {
            setIndex(images.length - 1);
        } else {
            setIndex(nextIndex);
        }
    };

    const handleNext = () => {
        const nextIndex = index + 1;
        if (nextIndex >= images.length) {
            setIndex(0);
        } else {
            setIndex(nextIndex);
        }
    };

    if (images.length === 0) return <NoImage src={NoImg} />;

    return (
        <>
            {
                <Image
                    src={
                        typeof images[index] === "string"
                            ? images[index]
                            : URL.createObjectURL(images[index])
                    }
                >
                    <Btn func="prev" onClick={handlePrev}>
                        <ChevronLeft width="20px" />
                    </Btn>
                    <Btn func="next" onClick={handleNext}>
                        <ChevronRight width="20px" />
                    </Btn>
                </Image>
            }
        </>
    );
}

const Btn = styled.div`
    position: absolute;
    display: inline-block;
    bottom: 50%;
    transform: translateY(50%);
    z-index: 12;
    border-radius: 50%;
    cursor: pointer;
    color: ${(props) => props.theme.accentColor};
    left: ${(props) => props.func === "prev" && "5px"};
    right: ${(props) => props.func === "next" && "5px"};
`;

const Image = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 3/4;
    border-radius: 10px;
    background-image: url(${(props) => props.src});
    background-size: cover;
    background-position: center;
`;

const NoImage = styled.div`
    background-image: url(${(props) => props.src});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: 100%;
    aspect-ratio: 3/4;
    border-radius: 10px;
`;

export default Carousel;
