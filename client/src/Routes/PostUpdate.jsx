import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthAtom } from "../atoms/isAuthAtom";

import PostFormWrapper from "../Routes/PostFormWrapper";

function PostUpdate() {
    const { user } = useRecoilValue(isAuthAtom);
    const { state } = useLocation();
    let history = useHistory();
    console.log(state);

    useEffect(() => {
        if (!state || user._id !== state?.post?.creator._id) {
            history.push("/");
        }
    }, [user._id, history, state]);

    return <PostFormWrapper post={state?.post} isUpdate={true} title="글 수정하기" />;
}

export default PostUpdate;
