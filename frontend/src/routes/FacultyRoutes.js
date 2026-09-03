import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import FacultyDashboard from "../pages/faculty/FacultyDashboard";

import CourseList from "../pages/faculty/courses/CourseList";
import CourseStudents from "../pages/faculty/courses/CourseStudents";

import ModuleList from "../pages/faculty/modules/ModuleList";
import CreateModule from "../components/modules/CreateModule";
import ModuleTopicList from "../pages/faculty/modules/ModuleTopicList";
import CreateModuleTopic from "../pages/faculty/modules/CreateModuleTopic";

import TopicList from "../pages/faculty/topics/TopicList";
import CreateTopic from "../pages/faculty/topics/CreateTopic";
import EditTopic from "../pages/faculty/topics/EditTopic";
import TopicQuestionList from "../pages/faculty/topics/TopicQuestionList";

import QuestionList from "../pages/faculty/questions/QuestionList";
import QuestionDetails from "../pages/faculty/questions/QuestionDetails";
import CreateQuestion from "../pages/faculty/questions/CreateQuestion";

import TopicLearningStudio from "../pages/faculty/learningStudio/TopicLearningStudio";
import CreateLearningContent from "../pages/faculty/learningStudio/CreateLearningContent";
import EditLearningContent from "../pages/faculty/learningStudio/EditLearningContent";
import EditLearningActivity from "../pages/faculty/learningStudio/EditLearningActivity";
import AssessmentList from "../pages/faculty/assessments/AssessmentList";
import CreateAssessment from "../pages/faculty/assessments/CreateAssessment";
import AssessmentPreview from "../pages/faculty/assessments/AssessmentPreview";
import EditAssessment from "../pages/faculty/assessments/EditAssessment";

const FacultyRoutes = () => {

    return (

        <Routes>

            <Route
                path="/"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <FacultyDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/courses"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <CourseList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/courses/:courseId/students"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <CourseStudents />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/courses/:courseId/modules"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <ModuleList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/courses/:courseId/modules/create"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <CreateModule />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/modules/:moduleId/topics"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <ModuleTopicList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/modules/:moduleId/topics/create"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <CreateModuleTopic />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/topics"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <TopicList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/topics/create"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <CreateTopic />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/topics/:id/edit"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <EditTopic />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/topics/:topicId/questions"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <TopicQuestionList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/questions"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <QuestionList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/questions/create"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <CreateQuestion />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/questions/:id"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <QuestionDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/topics/:topicId/learning-studio"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <TopicLearningStudio />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/topics/:topicId/learning-studio/content/create"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <CreateLearningContent />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/topics/:topicId/learning-studio/content/:contentId/edit"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <EditLearningContent />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/topics/:topicId/learning-studio/activity/:activityId/edit"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <EditLearningActivity />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/assessments"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <AssessmentList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/assessments/create"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <CreateAssessment />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/assessments/:id"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <AssessmentPreview />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/assessments/:id/edit"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <EditAssessment />
                    </ProtectedRoute>
                }
            />

        </Routes>

    );

};

export default FacultyRoutes;