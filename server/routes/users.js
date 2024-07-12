const router=require("express").Router();
const temp=require("../models/temp");
const bcrypt=require("bcryptjs");

// update user
router.put("/:id",async (req,res)=>{
    try{
        if(req.body.userId === req.params.id || req.body.isAdmin){
            if(req.body.password){
                try{
                    const salt=await bcrypt.genSalt(10);
                    req.body.password=await bcrypt.hash(req.body.password,salt);
                }
                catch(err){
                    return res.status(500).json(err);
                }
            }
            try{
                const user=await temp.findByIdAndUpdate(req.params.id,{$set:req.body});
                res.status(200).json("Account has been updated");
            }
            catch(err){
                return res.status(500).json(err);
            }
        }
        else{
            return res.status(403).json("you can update only your account");
        }
    }
    catch{
        return res.status(500).json(err);
    }
})
// delete user
router.delete("/:id",async (req,res)=>{
    try{
        if(req.body.userId === req.params.id || req.body.isAdmin){
            try{
                const user=await temp.findByIdAndDelete({_id: req.params.id});
                res.status(200).json("Account has been deleted ");
            }
            catch(err){
                return res.status(500).json(err);
            }
        }
        else{
            return res.status(403).json("you can delete only your account");
        }
    }
    catch{
        return res.status(500).json(err);
    }
})
// get a user
router.get("/",async (req,res)=>{
    const userId=req.query.userId;
    const username=req.query.username;
    try{
        const user=userId?await temp.findById(userId):await temp.findOne({username:username});
        const {password,updatedAt,...other} =user._doc;
        res.status(200).json(other);
    }
    catch(err){
        return res.status(500).json(err);
    }
})


// get friends
// router.get("/friends/:userId", async(req,res)=>{
//     try{
//         const user=await temp.findById(req.params.userId);
//         console.log('user id is',user);
//         const friends=await Promise.all(
//             user.following.map(friendId=>{
//                 return temp.findById(friendId);
//             })
//         )
//         let friendList=[];
//         friends.map(friend=>{
//             const {_id,username,profilePicture}=friend
//             friendList.push({_id,username,profilePicture});
//         })
//         res.status(200).json(friendList)
//     }
//     catch(err){
//         res.status(500).json(err);
//     }
// })



// get friends
router.get("/friends/:userId", async(req,res)=>{
    try{
        const user=await temp.findById(req.params.userId);
        console.log('user id is',user);
        // const friends=await Promise.all(
        //     user.following.map(friendId=>{
        //         return temp.findById(new Mongoose.Types.ObjectId(friendId));
        //     })
        // )
        let friendList=[];
        console.log("following" , user.following)

        try {
            console.log("inside the try block" , user.following , user?.following.length);
            let friends = [];
            if(user?.following.length > 0){
                console.log('inside if block')
                for(const friendId of user.following){
                    const foundUser = await temp.findById(friendId);
                    if(foundUser){
                        friends.push(foundUser);
                    }
                    else{
                        console.log("not found user" , friendId)
                    }
                    console.log('the friends : ' , friends)
                }
                friends.map(friend=>{
                    const {_id,username,profilePicture}=friend
                    friendList.push({_id,username,profilePicture});
                })
                console.log("hte friends are : " , friendList)
            }
            console.log("the response " , friendList)
            return res.status(200).json({
                msg : "all friends" , 
                data : friendList
            })
        } catch (error) {
            return res.status(200).json({
                msg : "all friends" , 
                data : [], 
                error
            })
        }
    }
    catch(err){
        res.status(500).json(err);
    }
})



// follow a user
router.put("/:id/follow",async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user=await temp.findById(req.params.id);
            const currentUser=await temp.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{following:req.params.id}});
                res.status(200).json("User has been followed");
            }
            else{
                res.status(403).json("you already follow this user");
            }

        }
        catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("you can not follow yourself");
    }
})
// unfollow a user
router.put("/:id/unfollow",async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user=await temp.findById(req.params.id);
            const currentUser=await temp.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{following:req.params.id}});
                res.status(200).json("User has been unfollowed");
            }
            else{
                res.status(403).json("you do not follow this user");
            }

        }
        catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("you can not unfollow yourself");
    }
})


// for searchbar
router.get('/search', async (req, res) => {
    try {
      const { query } = req.query;
      const users = await temp.find({ username: { $regex: query, $options: 'i' } });
      res.json(users);
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports=router