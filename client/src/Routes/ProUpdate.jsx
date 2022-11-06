import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";

import { isAuthAtom } from "../atoms/isAuthAtom";
import { myProDataSelector } from "../atoms/isProAtom";
import ProForm from "../Componenets/Form/ProForm";
import Loader from "../Componenets/Loader";

function ProUpdate() {
    const { user } = useRecoilValue(isAuthAtom);
    const myProData = useRecoilValueLoadable(myProDataSelector);
    const location = useLocation();
    const checkMe = location.pathname.split("/")[2] === user.isPro;

    if (!checkMe || !user.isPro) {
        return <Redirect to="/" />;
    }

    if (myProData?.state === "loading") return <Loader />;

    return (
        <>
            <ProForm isUpdate={checkMe} proData={myProData?.contents} />
        </>
    );
}

export default ProUpdate;
