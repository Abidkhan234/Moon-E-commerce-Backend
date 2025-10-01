import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        const date = Date.now();
        cb(null, `${date}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

export default upload;