import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.29.245:5000/api",
    // baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});


/*
 * Attach JWT token to every authenticated request.
 */
api.interceptors.request.use(
    (config) => {

        const storedAuth =
            localStorage.getItem("auth");

        if (storedAuth) {

            try {

                const auth =
                    JSON.parse(storedAuth);

                const token =
                    auth?.token;

                if (token) {

                    config.headers.Authorization =
                        `Bearer ${token}`;

                }

            } catch (error) {

                console.error(
                    "Failed to parse authentication data:",
                    error
                );

            }

        }

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }
);


export default api;