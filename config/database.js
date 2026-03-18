const mongoose = require('mongoose');
module.exports.connect = async () => {
   try{
    await mongoose.connect(process.env.database)
    console.log("Ket noi thanh cong")
   }
   catch(error){
    console.log("Ket noi that bai")
   }
}