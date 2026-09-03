const generateJoinCode = () => {

    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {

        const index = Math.floor(
            Math.random() * characters.length
        );

        code += characters[index];

    }

    return code;
};

export default generateJoinCode;

// I've deliberately excluded visually confusing characters such as:
// I
// O
// 0
// 1