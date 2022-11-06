import React, { useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";

import { isAuthAtom } from "../atoms/isAuthAtom";

function OnlyUserRoute({ children }) {
    const { user } = useRecoilValue(isAuthAtom);

    let location = useLocation();

    useEffect(() => {
        if (!user) toast("로그인해야 이용가능합니다", { icon: "🚀" });
    }, [user]);

    if (!user) return <Redirect to={{ pathname: "/auth", state: { from: location } }} />;

    return children;
}

export default OnlyUserRoute;
