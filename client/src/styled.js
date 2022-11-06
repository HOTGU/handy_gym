import { createGlobalStyle } from "styled-components";
import Gmarket from "./font/GmarketSans.ttf";
import reset from "styled-reset";

export const GlobalStyles = createGlobalStyle` 
    ${reset}
    @font-face {
        font-family: "Gmarket";
        src: url(${Gmarket});
    }
    a{
        text-decoration: none;
        color: inherit;
    }
    *{
        box-sizing: border-box;
    }
    input,button {
        outline: none;
        border: none;
        
    }
    input[type='number'] {
    -moz-appearance:textfield;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    body {
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 14px;
        background-color: ${(props) => props.theme.bgColor};
        color: ${(props) => props.theme.textColor};
        width: 100%;
        max-width: 1480px;
        margin: 0 auto;
        padding: 0px 10px;
    }
`;

export const darkTheme = {
    textColor: "#dcdde1",
    svgColor: "#d2dae2",
    bgColor: "rgba(47, 54, 64, 1.0)", // British
    inputColor: "#1e272e",
    hoverColor: "black",
    accentColor: "#10ac84", // Canadian "DARK MOUNTAIN MEADOW"
    borderColor: "#7f8c8d",
    boxShadow: "rgba(50, 50, 50, 0.48) 0px 3px 8px",
    modalColor: "rgba(3, 5, 4, 0.9)",
    navbarHeight: "60px",
    messageColor: "rgba(0, 0, 0, 0.24)",
    colors: {
        white: "white", // British "LYNX WHITE"
        red: "#e84118", // British "NASTURICIAN FLOWER"
        gray: "#dfe4ea",
        yellow: "rgba(255, 168, 1,1.0)",
        blue: "#3498db",
        black: "#1e272e",
    },
};

export const lightTheme = {
    textColor: "#2f3640",
    svgColor: "#485460",
    bgColor: "#ededed", // British
    inputColor: "#ffffff",
    hoverColor: "#bdbdbd",
    accentColor: "#10ac84", // Canadian "DARK MOUNTAIN MEADOW"
    borderColor: "#7f8c8d",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    modalColor: "rgba(47, 54, 64, 0.8)",
    navbarHeight: "60px",
    messageColor: "rgba(180, 180, 180, 0.24)",
    colors: {
        white: "white",
        red: "#e84118",
        gray: "#dfe4ea",
        yellow: "rgba(255, 168, 1,1.0)",
        blue: "#3498db",
        black: "#1e272e",
    },
};
