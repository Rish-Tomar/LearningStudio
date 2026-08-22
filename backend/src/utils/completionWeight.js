import LearningContent from "../models/LearningContent.js";
import LearningActivity from "../models/LearningActivity.js";


export const getActiveCompletionWeightTotal = async (
    topicId
) => {

    /*
     * Fetch active Learning Content
     */

    const learningContents =
        await LearningContent.find({ topic: topicId, status: "ACTIVE" })
        .select("completionWeight");


    /*
     * Fetch active Learning Activities
     */

    const learningActivities =
        await LearningActivity.find({  topic: topicId,  status: "ACTIVE" })
        .select("completionWeight");


    /*
     * Calculate total weight
     */

    const contentWeight =
        learningContents.reduce((total, item) => total + item.completionWeight, 0);


    const activityWeight =
        learningActivities.reduce(
            (total, item) =>
                total + item.completionWeight,
            0
        );


    return contentWeight + activityWeight;

};