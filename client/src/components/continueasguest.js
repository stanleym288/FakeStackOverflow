import { useEffect } from "react";

const ContinueAsGuestContent = ({ setShowContinueAsGuest, setHomePageVisible }) => {
    useEffect(() => {
        setShowContinueAsGuest(false);
        setHomePageVisible(true);
    }, [setShowContinueAsGuest, setHomePageVisible]);
    return null;
};

export default ContinueAsGuestContent;