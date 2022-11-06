import React from "react";
import { ReactComponent as Welcome } from "../../Images/welcome.svg";
import styled from "styled-components";

const Svg = styled(Welcome)`
    fill: ${(props) => props.theme.svgColor};
    width: ${(props) => props.width || "30px"};
    height: ${(props) => props.height || "30px"};
`;

function SvgWelcome({ ...props }) {
    return <Svg {...props} />;
}
export default SvgWelcome;
