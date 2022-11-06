import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useReadPath = ({ pathname }) => {
    const location = useLocation();

    if (location.pathname === pathname) {
        return true;
    }
    return false;
};

export default useReadPath;
