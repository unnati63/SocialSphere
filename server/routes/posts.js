const router=require("express").Router();
const Post=require("../models/Post");
const temp=require("../models/temp")

// create a post
router.post("/",async (req,res)=>{
    
    try{
        const newPost=new Post(req.body);
        const savedPost=await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(err){
        return res.status(500).json(err);
    }
})


// update a post
router.put("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json("Post has been updated");
        }
        else{
            res.status(403).json("You can update only your post");
        }
    }
    catch(err){
        return res.status(500).json(err);
    }
})


// delete a post
router.delete("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.deleteOne();
            res.status(200).json("Post has been deleted");
        }
        else{
            res.status(403).json("You can delete only your post");
        }
    }
    catch(err){
        return res.status(500).json(err);
    }
})


// like a post
router.put("/:id/like",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("Post has been liked");
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("Post has been disliked");
        }

    }
    catch(err){
        return res.status(500).json(err);
    }
})


// get a post
router.get("/:id", async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch(err){
        return res.status(500).json(err);
    }
})


// get timeline posts
router.get("/timeline/:userId",async (req,res)=>{
    try{
        // let postArray=[];
        const currentUser=await temp.findById(req.params.userId);
        const userPosts=await Post.find({userId:currentUser._id});
        const friendPosts=await Promise.all(
            currentUser.following.map((friendId)=>{
               return Post.find({userId: friendId});
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    }
    catch(err){
        return res.status(500).json(err);
    }
})

// get user's all posts
router.get("/profile/:username",async (req,res)=>{
    try{
        // let postArray=[];
        const user=await temp.findOne({username:req.params.username})
        const posts=await Post.find({userId:user._id});
        res.status(200).json(posts);
    }
    catch(err){
        return res.status(500).json(err);
    }
})
module.exports=router;