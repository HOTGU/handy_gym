import React from "react";
import { ReactComponent as RefreshSvg } from "../../Images/refresh.svg";
import styled from "styled-components";

const Svg = styled(RefreshSvg)`
    fill: ${(props) => props.theme.svgColor};
    width: ${(props) => props.width || "40px"};
    height: ${(props) => props.height || "40px"};
`;

function Refresh({ ...props }) {
    return <Svg {...props} />;
}
export default Refresh;
