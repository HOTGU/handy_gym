import React, { useState } from "react";
import EasyCropper from "react-easy-crop";
import styled from "styled-components";

const CrapWrapper = styled.div`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100vh;
    background-color: #c98a8a;
    z-index: 99;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const CrapContainer = styled.div`
    position: relative;
    width: 500px;
    height: 500px;
`;

function Cropper({ src }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    return (
        <>
            {src && (
                <CrapWrapper>
                    <CrapContainer>
                        <EasyCropper
                            image={src}
                            crop={crop}
                            zoom={zoom}
                            aspect={3 / 4}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </CrapContainer>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.05}
                        onChange={(e) => {
                            setZoom(e.target.value);
                        }}
                    />
                </CrapWrapper>
            )}
        </>
    );
}

export default Cropper;
