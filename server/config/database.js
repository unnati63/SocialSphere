const mongoose=require("mongoose");

require("dotenv").config();

const dbConnect=()=>{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>console.log("db connected sucessfully"))
    .catch((err)=>{
        console.log("db facing connection issue");
        console.error(err.message);
        process.exit(1);
    })
};

module.exports=dbConnect;