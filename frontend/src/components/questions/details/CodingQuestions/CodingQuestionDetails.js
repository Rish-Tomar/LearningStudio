import CodingConstraints
    from "./CodingConstraints";

import CodingInputOutput
    from "./CodingInputOutput";

import CodingConfiguration
    from "./CodingConfiguration";


const CodingQuestionDetails = ({
    question,
}) => {

    return (

        <>

            <CodingConstraints
                constraints={
                    question.constraints
                }
            />


            <CodingInputOutput
                inputFormat={
                    question.inputFormat
                }
                outputFormat={
                    question.outputFormat
                }
            />


            <CodingConfiguration
                allowedLanguages={
                    question.allowedLanguages
                }
                executionTimeLimit={
                    question.executionTimeLimit
                }
                memoryLimit={
                    question.memoryLimit
                }
            />

        </>

    );

};


export default CodingQuestionDetails;