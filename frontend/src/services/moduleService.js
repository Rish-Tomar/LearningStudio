import api from "../api/axios";

const getModules = async () => {

    const response = await api.get(
        "/modules"
    );

    return response.data;
};

const getModuleById = async (id) => {

    const response = await api.get(
        `/modules/${id}`
    );

    return response.data;
};

const createModule = async (moduleData) => {

    const response = await api.post(
        "/modules",
        moduleData
    );

    return response.data;
};

const updateModuleStatus = async (id, status) => {

    const response = await api.patch(
        `/modules/${id}/status`,
        { status }
    );

    return response.data;
};

const moduleService = {

    getModules,
    getModuleById,
    createModule,
    updateModuleStatus

};

export default moduleService;