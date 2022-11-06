import { useLocation } from "react-router-dom";

function useBlockPath() {
    const { pathname } = useLocation();

    const res =
        pathname.includes("register") ||
        pathname.includes("upload") ||
        pathname.includes("update");

    return res;
}

export default useBlockPath;
