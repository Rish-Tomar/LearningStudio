import MCQOptions
    from "./MCQOptions";

import MCQAnswer
    from "./MCQAnswer";


const MCQQuestionDetails = ({
    question,
}) => {

    return (

        <>

            <MCQOptions
                options={
                    question.options
                }
            />


            <MCQAnswer
                correctAnswer={
                    question.correctAnswer
                }
                explanation={
                    question.explanation
                }
            />

        </>

    );

};


export default MCQQuestionDetails;