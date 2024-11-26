// it will be used for certain memory uses
import multer from 'multer'

const storage = multer.memoryStorage()// temp storage

const upload = multer({
    storage : storage
})

export default upload