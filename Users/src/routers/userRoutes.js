const express = require('express')
const {signup,
       signin,
      changepassword,
      update, 
      uploader, 
      search,
      forgotpassword,
      passwordReset,
      resendOtp,
      getUser,
      createStripCustomer,
      createStripeToken,
      createCharge,
      otpVerification
       
    } = require('../controller/usersfunctions')
const verifyToken = require('../middlewares/verifyToken')
// const {signinn } = require('../middlewares/verifyToken')
const router = express.Router()
const upload = require('../utilis/upload')
const deleteToken = require('../middlewares/deleteToken')

router.get('/user', getUser )
router.get('/search', search )
router.post('/resendOtp', resendOtp)
router.post('/stripe',createStripCustomer )
router.post('/token',createStripeToken )
router.post('/charge/:tokenId',createCharge)
router.post('/verifyOtp', otpVerification)
router.post('/signin', signin)
router.post('/signup', signup)
router.post('/changepassword/:personId', changepassword)
router.post('/update/:personId', update)
router.post('/forgotpassword', forgotpassword)  
router.post('/resetPassword/:Userid/:token',passwordReset)   
router.post('/upload', verifyToken, upload.single('profile'), uploader)


module.exports = router