const io=require("socket.io")({
    cors:{
        // "http://localhost:3000":true,
        // "http://localhost:8800":true,

        origin: ["http://localhost:3000", "http://localhost:8800"],
    }
});
io.listen(8900);

let users=[];
const addUser=(userId,socketId)=>{
    !users.some((user)=>user.userId===userId) && 
    users.push({userId,socketId});
}

const removeUser=(socketId)=>{
    users = users.filter((user)=>user.socketId !== socketId);
}

const getUser = (userId)=>{
    return users.find((user)=> user.userId === userId)
}

io.on("connection",(socket)=>{
    // when connect
    console.log("a user connected")
    
    // take user id and socket id from user
    socket.on("addUser",userId=>{
        addUser(userId,socket.id);
        io.emit("getUsers",users);
    });

    // send and get message
    socket.on("sendMessage",({
        senderId,receiverId,text
    })=>{
        const user=getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        } else {
            console.log(`User with ID ${receiverId} not found`);
        }
    })


    // when disconnect
    socket.on("disconnect",()=>{
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers",users);
    })
})

