import multer from "multer";

const storage = multer.memoryStorage(); // keep file in memory buffer

const allowedFileTypes = {
    "application/pdf": true,
    "image/jpeg": true,
    "image/jpg": true,
    "image/png": true,
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        if (allowedFileTypes[file.mimetype]) {
            cb(null, true);
        } else {
            cb(
                new Error("Only PDF and image files (JPEG, PNG) are allowed!"),
                false
            );
        }
    },
});

export default upload;
