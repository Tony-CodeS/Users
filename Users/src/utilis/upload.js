const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: './assets/profile-pics',
    filename: (req, file, cb) => {
        cb(null, `${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
    }
})


const filefilter = (req, file, cb)=>{
if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
    cb(null, true)
} else {
    cb(new Error (`file formats not valid`), false)
}
}


const upload = multer({
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    filefilter:filefilter
})

module.exports = upload