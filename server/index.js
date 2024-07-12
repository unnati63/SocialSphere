const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const helmet=require("helmet");
const morgan=require("morgan");
const userRoute=require("./routes/users");
const authRoute=require("./routes/auth");
const postRoute=require("./routes/posts");
const multer=require("multer");
const path=require("path");
const conversationRoute=require("./routes/conversations");
const messageRoute=require("./routes/messages");
const commentRoute=require('./routes/comments');
const uploadRoute=require('./routes/upload');

const PORT= process.env.PORT || 8800;
var cors=require('cors');
app.use(cors(
    {
        origin:["https://social-spherefrontend-gnhg3pn45-unnati-shrivastavas-projects.vercel.app/"],
		credentials:true,

    }
));

dotenv.config();

// mongodb connection
const dbConnect=require("./config/database");
dbConnect();

app.use("/images",express.static(path.join(__dirname,"public/images")));

// middlewares

app.use(express.json()); 
app.use(helmet());
app.use(morgan("common"));


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images");
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.name);
    }
})
const upload=multer({storage:storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
        return res.status(200).json("file uploaded sucessfully");
    }
    catch(error){
        console.log("Server upload failed",error);
    }
})



app.use("/users",userRoute);
app.use("/auth",authRoute);
app.use("/posts",postRoute);
app.use("/conversations",conversationRoute);
app.use("/messages",messageRoute);
app.use("/comments",commentRoute);
app.use("/upload", uploadRoute);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});


app.use((req, res, next) => {
    res.status(404).send('Route not found');
});

app.listen(PORT,()=>{
    console.log("Backend server is running");
})