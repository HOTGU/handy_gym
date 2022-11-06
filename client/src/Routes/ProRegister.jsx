import React from "react";
import { Redirect } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { isAuthAtom } from "../atoms/isAuthAtom";
import ProForm from "../Componenets/Form/ProForm";

function ProRegister() {
    const { user } = useRecoilValue(isAuthAtom);

    if (user.isPro) return <Redirect to={`/pro/${user.isPro}/update`} />;

    return (
        <>
            <ProForm isUpdate={false} />
        </>
    );
}

export default ProRegister;
