import React from "react";
import { ReactComponent as Flower } from "../../Images/flower.svg";
import styled from "styled-components";

const Svg = styled(Flower)`
    fill: ${(props) => props.theme.svgColor};
    /* fill: ${(props) => props.theme.textColor}; */
    width: ${(props) => props.width || "30px"};
    height: ${(props) => props.height || "30px"};
`;

function SvgFlower({ ...props }) {
    return <Svg {...props} />;
}
export default SvgFlower;
