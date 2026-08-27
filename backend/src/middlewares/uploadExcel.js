import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    const allowedExtensions = [
        ".xlsx",
        ".xls"
    ];

    const fileExtension =
        file.originalname
            .toLowerCase()
            .slice(
                file.originalname.lastIndexOf(".")
            );

    if (
        !allowedExtensions.includes(
            fileExtension
        )
    ) {

        return cb(
            new Error(
                "Only Excel files (.xlsx, .xls) are allowed"
            )
        );

    }

    cb(null, true);
};

const uploadExcel = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});

export default uploadExcel;