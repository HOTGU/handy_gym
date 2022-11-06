import React from "react";
import toast from "react-hot-toast";
import { Redirect, useLocation } from "react-router-dom";

function ProtectRoute({ isAllowed, children }) {
    let location = useLocation();

    if (!isAllowed) {
        console.log("실행");
        toast.error("로그인해야 이용가능합니다");
        return <Redirect to={{ pathname: "/auth", state: { from: location } }} />;
    }

    return children;
}

export default ProtectRoute;
