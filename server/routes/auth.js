const router=require("express").Router();
const temp=require("../models/temp");
const bcrypt=require("bcryptjs");


// register
router.post("/register",async (req,res)=>{
    try{
        // generate newpassword 
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        // create new user
        const newUser=new temp({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        });
        // save user and return response
        const user=await newUser.save();
        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            err:"error while registering",
        })
    }
});



//LOGIN
// router.post("/login",async (req,res)=>{
//     try{
//         const user=await temp.findOne({email:req.body.email});
//         !user && res.status(404).send("user not found")

//         // const validPassword=await bcrypt.compare(req.body.password,user.password)
//         // !validPassword && res.status(400).json("Wrong password")

//         // res.status(200).json(user);

//     const validPassword = await bcrypt.compare(req.body.password, user.password);
//         if (!validPassword) {
//         res.status(400).json("Wrong password");
//     } else {
//         res.status(200).json(user);
//     }

//     }
//     catch(err){
//         res.status(500).json(err);
//     }
    
// })


router.post("/login", async (req, res) => {
    try {
        console.log("Login request received:", req.body);
        const user = await temp.findOne({ email: req.body.email });

        if (!user) {
            console.log("User not found");
            return res.status(404).send("User not found");
        }

        console.log("User found:", user);

        if (user.password === undefined) {
            console.log("Password not found for user:", user);
            return res.status(500).send("Password not found for user");
        }

        console.log("Password found for user:", user.password);

        const passwordFromBody = req.body.password;
        console.log("Password from request body:", passwordFromBody);

        const validPassword = await bcrypt.compare(passwordFromBody, user.password);
        if (!validPassword) {
            console.log("Invalid password");
            return res.status(400).json("Wrong password");
        }

        console.log("Login successful:", user);
        res.status(200).json(user);
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json(err);
    }
});


module.exports=router;