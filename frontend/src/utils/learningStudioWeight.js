export const calculateActiveContentWeight = (
    content = []
) => {

    return content
        .filter(
            (item) =>
                item.status === "ACTIVE"
        )
        .reduce(
            (total, item) =>
                total +
                Number(
                    item.completionWeight || 0
                ),
            0
        );

};


export const calculateActiveActivityWeight = (
    activities = []
) => {

    return activities
        .filter(
            (activity) =>
                activity.status === "ACTIVE"
        )
        .reduce(
            (total, activity) =>
                total +
                Number(
                    activity.completionWeight || 0
                ),
            0
        );

};


export const calculateTotalActiveWeight = (
    content = [],
    activities = []
) => {

    const contentWeight =
        calculateActiveContentWeight(
            content
        );


    const activityWeight =
        calculateActiveActivityWeight(
            activities
        );


    return (
        contentWeight +
        activityWeight
    );

};


export const calculateRemainingWeight = (
    content = [],
    activities = []
) => {

    const totalActiveWeight =
        calculateTotalActiveWeight(
            content,
            activities
        );


    return Math.max(
        0,
        100 - totalActiveWeight
    );

};


export const calculateEditAvailableWeight = ({
    content = [],
    activities = [],
    currentWeight = 0,
    currentStatus = "INACTIVE",
}) => {

    const totalActiveWeight =
        calculateTotalActiveWeight(
            content,
            activities
        );


    const currentItemWeight =
        currentStatus === "ACTIVE"
            ? Number(
                currentWeight || 0
            )
            : 0;


    return Math.max(
        0,
        100 -
        (
            totalActiveWeight -
            currentItemWeight
        )
    );

};