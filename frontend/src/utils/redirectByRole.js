// const redirectByRole = (role) => {

//     switch (role) {

//         case "ADMIN":
//             return "/admin";

//         case "FACULTY":
//             return "/faculty";

//         case "STUDENT":
//             return "/student";

//         default:
//             return "/";
//     }

// };

export const ROLE_REDIRECTS = {
    ADMIN: "/admin",
    FACULTY: "/faculty",
    STUDENT: "/student",
};

const redirectByRole = (role) => ROLE_REDIRECTS[role] || "/";

export default redirectByRole;