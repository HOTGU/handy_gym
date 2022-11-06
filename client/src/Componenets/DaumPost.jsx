import React from "react";
import DaumPostcode from "react-daum-postcode";

function DaumPost({ handleComplete }) {
    return <DaumPostcode onComplete={handleComplete} />;
}

export default DaumPost;
