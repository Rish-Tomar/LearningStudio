import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import redirectByRole from "../utils/redirectByRole";

const PublicRoute = ({ children }) => {

    const { auth } = useAuth();

    if (!auth) {
        return children;
    }

    return (
        <Navigate
            to={redirectByRole(auth.user.role)}
            replace
        />
    );

};

export default PublicRoute;