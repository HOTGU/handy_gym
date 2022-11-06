import React from "react";
import { ReactComponent as Profile } from "../../Images/profile.svg";
import styled from "styled-components";

const Svg = styled(Profile)`
    fill: ${(props) => props.theme.svgColor};
    width: ${(props) => props.width || "60px"};
    height: ${(props) => props.height || "30px"};
`;

function SvgProfile({ ...props }) {
    return <Svg {...props} />;
}
export default SvgProfile;
