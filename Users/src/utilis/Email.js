// const nodemailer = require('nodemailer')
// const nodemailergun = require('nodemailer-mailgun-transport')

// const Email = async (email, subject, text) =>{

//     const auth = {
//         auth:{
//             api_key :'83f30c4d45544588cbce47ff54ec51ed-69210cfc-8cedfce7',
//             Domail :'sandbox80845c8f4de74886bcd9d84a82534a5c.mailgun.org'
//         }
//     }

//     let transporter = nodemailer.createTransport(nodemailergun(auth))


// const mailOptions = {
//     from:'tony',
//     to:email,
//     subject:subject,
//     text:text
// }

// await transporter.sendMail(mailOptions, function(err, data){
//     if(err){
//         console.log( 'ERR', err)
//         console.log(data)
//     } else{
//         console.log('email sent')
//     }
// })
// }              

// const api_key = '83f30c4d45544588cbce47ff54ec51ed-69210cfc-8cedfce7'
// const Domain = 'sandbox80845c8f4de74886bcd9d84a82534a5c.mailgun.org'
// const formdata = require('formdata')
// const mailgun = require('mailgun.js')({apiKey:api_key, domain:Domain})
// const Data ={
//     from:'ton',
//     to:'',
//     subject:'hello',
//     text:'ff'
// }

// mailgun.messages().send(Data, function (error, body) {
//     if (error){
//         console.log(error)
//     }else{
//         console.log(body)
//     }
// })
//module.exports = Email