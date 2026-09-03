import api from "../api/axios";

const getAssessments = async () => {
  const response = await api.get("/assessments");
  return response.data;
};

const getAssessmentById = async (id) => {
  const response = await api.get(`/assessments/${id}`);
  return response.data;
};

const createAssessment = async (assessmentData) => {
  const response = await api.post("/assessments", assessmentData);
  return response.data;
};

const updateAssessment = async (id, assessmentData) => {
  const response = await api.patch(
    `/assessments/${id}`,
    assessmentData
  );

  return response.data;
};

const publishAssessment = async (id) => {
  const response = await api.patch(`/assessments/${id}/publish`);
  return response.data;
};

const closeAssessment = async (id) => {
  const response = await api.patch(`/assessments/${id}/close`);
  return response.data;
};

const createAssessmentSection = async (sectionData) => {
  const response = await api.post(
    "/assessment-sections",
    sectionData
  );

  return response.data;
};

const createAssessmentQuestion = async (questionData) => {
  const response = await api.post(
    "/assessment-questions",
    questionData
  );

  return response.data;
};

const assessmentService = {
  getAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  publishAssessment,
  closeAssessment,
  createAssessmentSection,
  createAssessmentQuestion,
};

export default assessmentService;