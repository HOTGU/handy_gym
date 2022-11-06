import styled, { keyframes } from "styled-components";

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Wrapper = styled.div`
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SLoader = styled.div`
    animation: ${rotate360} 0.6s ease-in-out infinite;
    border: 3px solid ${(props) => props.theme.hoverColor};
    border-top: 3px solid ${(props) => props.theme.accentColor};
    background: transparent;
    width: ${(props) => props.width || "20px"};
    height: ${(props) => props.height || "20px"};
    border-radius: 50%;
`;

const Loader = ({ isCenter = true, ...props }) => {
    if (!isCenter) return <SLoader {...props} />;

    return (
        <Wrapper>
            <SLoader {...props} />
        </Wrapper>
    );
};

export default Loader;
