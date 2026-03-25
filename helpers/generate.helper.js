// module.exports.generateRandomNumber = (length) => {
//     const character = "0123456789"
//     let result =""
//     for(let i = 0;i<length;i++){
//         result +=character.charAt(Math.floor(Math.random()*character.length))
//     }
//     return result
// }
const crypto = require("crypto")

module.exports.generateOTP = function generateOTP() {
  return crypto.randomInt(100000, 1000000)
}