const mongoose = require('mongoose');

const dbConnect=async()=>{
    mongoose.connect(process.env.MONGO_URI);
}

module.exports=dbConnect;