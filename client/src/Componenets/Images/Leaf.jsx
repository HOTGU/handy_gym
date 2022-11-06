import React from "react";
import { ReactComponent as Leaf } from "../../Images/leaf.svg";
import styled from "styled-components";

const Svg = styled(Leaf)`
    fill: ${(props) => props.theme.svgColor};
    width: ${(props) => props.width || "30px"};
    height: ${(props) => props.height || "30px"};
`;

function SvgLeaf({ ...props }) {
    return <Svg {...props} />;
}

export default SvgLeaf;
