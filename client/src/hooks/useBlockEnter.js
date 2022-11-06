import { useEffect } from "react";

const useBlockEnter = () => {
    const handleUnload = (e) => {
        e.preventDefault();
        e.returnValue = "Some browsers display this to the use";
    };

    const blockEnter = (e) => {
        if (e.keyCode === 13 && e.target.type !== "textarea") {
            e.preventDefault();
            return false;
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", blockEnter);
        window.addEventListener("beforeunload", handleUnload);
        return () => {
            window.removeEventListener("keydown", blockEnter);
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, []);
};

export default useBlockEnter;
