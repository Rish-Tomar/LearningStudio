import asyncHandler from "../utils/asyncHandler.js";
import { createTopic as createTopicService, 
         getAllTopics as getAllTopicsService, 
         getTopicById as getTopicByIdService,
         updateTopicStatus as updateTopicStatusService } from "../services/topicService.js";
 
export const createTopic = asyncHandler(async (req, res) => {

    const { module, name, code, description,sequence } = req.body;

    const topic = await createTopicService({
        module,
        name,
        code,
        description,
        sequence
    });

    res.status(201).json({
        success: true,
        message: "Topic created successfully",
        data: topic
    });
});

export const getAllTopics = asyncHandler(async (req, res) => {

    const topics = await getAllTopicsService();

    res.status(200).json({
        success: true,
        message: "Topics fetched successfully",
        data: topics
    });
});

export const getTopicById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const topic = await getTopicByIdService(id);

    res.status(200).json({
        success: true,
        message: "Topic fetched successfully",
        data: topic
    });
});

export const updateTopicStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const topic = await updateTopicStatusService(id, status);

    res.status(200).json({
        success: true,
        message: "Topic status updated successfully",
        data: topic
    });
});