import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import redirectByRole from "../utils/redirectByRole";

const ProtectedRoute = ({ children, roles = [] }) => {

    const { auth } = useAuth();

    // User is not logged in
    if (!auth) {
        return <Navigate to="/" replace />;
    }

    // User is logged in but doesn't have permission
    if (
        roles.length > 0 &&
        !roles.includes(auth.user.role)
    ) {
        return (
            <Navigate
                to={redirectByRole(auth.user.role)}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;