import React, { useEffect, useState } from "react";
import { Prompt, useHistory } from "react-router-dom";
import Confirm from "./Confirm";

function RouteGuard({ shouldGuard, title }) {
    const [confirm, setConfirm] = useState(false);
    const [isLeave, setIsLeave] = useState(false);
    const [location, setLocation] = useState();
    const history = useHistory();

    const handlePrompt = (location, action) => {
        if (!isLeave && shouldGuard) {
            if (action === "POP") {
                setLocation(-1);
            } else {
                setLocation(location.pathname);
            }
            setConfirm(true);
            return false;
        }
        return true;
    };

    const handleConfirm = () => {
        setIsLeave(true);
    };

    useEffect(() => {
        if (isLeave) {
            if (location === -1) {
                history.goBack();
            } else {
                history.push(location);
            }
            setConfirm(false);
        }
    }, [isLeave, history, location]);

    return (
        <>
            <Prompt when={shouldGuard} message={handlePrompt} />
            {confirm && (
                <Confirm setShow={setConfirm} title={title} onConfirm={handleConfirm} />
            )}
        </>
    );
}

export default RouteGuard;
