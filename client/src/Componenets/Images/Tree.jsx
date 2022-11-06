import React from "react";
import { ReactComponent as Tree } from "../../Images/tree.svg";
import styled from "styled-components";

const Svg = styled(Tree)`
    fill: ${(props) => props.theme.svgColor};
    width: ${(props) => props.width || "30px"};
    height: ${(props) => props.height || "30px"};
`;

function SvgTree({ ...props }) {
    return <Svg {...props} />;
}
export default SvgTree;
