import React from "react";
import styled from "styled-components";
import { UserCircle } from "@styled-icons/fa-solid";

const NoUserAvatar = styled(UserCircle)`
    width: ${(props) => props.width || "100px"};
    height: ${(props) => props.height || "100px"};
    cursor: ${(props) => (props.click ? "pointer" : "default")};
`;

const SAvatar = styled.img`
    width: ${(props) => props.width || "100px"};
    height: ${(props) => props.height || "100px"};
    border-radius: 50%;
    object-fit: cover;
    background-color: ${(props) => props.theme.colors.white};
    cursor: ${(props) => (props.click ? "pointer" : "default")};
`;

function Avatar({ ...props }) {
    if (!props.src) return <NoUserAvatar {...props} />;

    return (
        <SAvatar
            {...props}
            src={
                typeof props.src === "string" ? props.src : URL.createObjectURL(props.src)
            }
        ></SAvatar>
    );
}

export default Avatar;
