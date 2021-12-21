import Multer from "multer";

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
})

export default multer;