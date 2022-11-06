import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function OnlyProRoute({ children }) {
    const { loggedIn } = useRecoilValue(isAuthAtom);

    let location = useLocation();

    useEffect(() => {
        if (!loggedIn) toast("로그인해야 이용가능합니다", { icon: "🚀" });
    }, [loggedIn]);

    if (!loggedIn) return <Redirect to="/auth" state={{ from: location }} />;

    return children;
}

export default OnlyProRoute;
