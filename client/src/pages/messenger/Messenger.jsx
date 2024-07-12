import React, { useEffect, useRef } from 'react';
import "./messenger.css"
import Topbar from "../../components/topbar/Topbar"
import Conversation from '../../components/conversations/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react';
import { useState } from 'react';
import axios from "axios";
import {io} from "socket.io-client";
import {Link} from "react-router-dom"

export default function Messenger() {
    const [conversations,setConversations]=useState([]);
    const [currentChat,setCurrentChat]=useState(null);
    const [messages,setMessages]=useState([]);
    const [newMessage,setNewMessage]=useState("");
    const [arrivalMessage,setArrivalMessage]=useState(null);
    const [onlineUsers,setOnlineUsers]=useState([]);
    const [matchingUsers, setMatchingUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);


    const socket=useRef(io("ws://localhost:8900"))
    const {user }=useContext(AuthContext);
    const scrollRef=useRef();

    useEffect(()=>{
        socket.current=io("ws://localhost:8900");
        socket.current.on("getMessage",data=>{
                setArrivalMessage({
                    sender:data.senderId,
                    text:data.text,
                    createdAt:Date.now(),
                })
        })
    },[])

    useEffect(()=>{
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev)=>[...prev,arrivalMessage])
    },[arrivalMessage,currentChat])


    // console.log(user);
    useEffect(()=>{
        const getConversations=async ()=>{
            try{
                const res=await axios.get(`http://localhost:8800/conversations/${user._id}`);
                setConversations(res.data);
            }catch(err){
                console.log(err);
            }
            
        };
        getConversations();
    },[user._id]);
    

    useEffect(()=>{
        const getMessages=async ()=>{
            try{
                const res=await axios.get(`http://localhost:8800/messages/${currentChat?._id}`);
                setMessages(res.data);
            }catch(err){
                console.log(err);
            }
           

        };
        getMessages();

    },[currentChat]);
    
const handleSubmit=async (e)=>{
    e.preventDefault();
    const message={
        sender:user._id,
        text:newMessage,
        conversationId:currentChat._id,
    };

    const receiverId=currentChat.members.find((member)=>member!== user._id)

    socket.current.emit("sendMessage",{
        senderId:user._id,
        receiverId,
        text: newMessage,
    })

    try{
        const res=await axios.post("http://localhost:8800/messages",message);
        setMessages([...messages,res.data]);
        setNewMessage("");
    }catch(err){
        console.log(err);
    }   
};

useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"});
},[messages])


useEffect(()=>{
    socket.current.emit("addUser",user._id);
    socket.current.on("getUsers",users=>{
        setOnlineUsers(user.following.filter((f)=>users.some((u)=>u.userId=== f)));
    })
},[user])


const handleSearch = async (query) => {
    setSearchQuery(query);
    if(query.trim()!==''){
      try {
        const response = await axios.get(`http://localhost:8800/users/search?query=${query}`);

        setMatchingUsers(response.data);
        // setShowDropdown(true);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    }
    else{
        setMatchingUsers([]);
        // setShowDropdown(false);
    }
    
  };

  const handleBlur = () => {
    setShowDropdown(false);
};

const handleUserClick = async (userId) => {
    try {
        const res = await axios.get(`http://localhost:8800/conversations/find/${user._id}/${userId}`);
        if (res.data) {
            setCurrentChat(res.data);
        } else {
            const newConversation = await axios.post('http://localhost:8800/conversations', {
                senderId: user._id,
                receiverId: userId,
            });
            setCurrentChat(newConversation.data);
        }
    } catch (err) {
        console.log(err);
    }
    setMatchingUsers([]);
    setSearchQuery('');
};



  return (
    <>
    <Topbar/>
        <div className='messenger'>
        <div className="chatMenu">
            <div className="chatMenuWrapper">
                <input type='text' placeholder='Search for Friends' className='chatMenuInput' 
                    value={searchQuery}
                 onChange={(e)=>handleSearch(e.target.value)}   
                 onBlur={handleBlur}
                />
                { matchingUsers.length > 0 && (
        <div className="dropdown-container">
          <ul className="dropdown-menu">
            {matchingUsers.map((user) => (
                <li key={user.id} className="dropdown-item"
                    onClick={() => handleUserClick(user._id)}>
                    {user.username}
                </li>
            ))}
          </ul>
        </div>
      )}
                {conversations.map((c)=>(
                    <div key={c._id} onClick={()=>setCurrentChat(c)}>
                    <Conversation key={c._id} conversation={c} currentUser={user}/>
                    </div>
                    
                ))}
                
        
            </div>
        </div>
        <div className="chatBox">
            <div className="chatBoxWrapper">
            {
                currentChat?(
            <>
                <div className="chatBoxTop">
                {messages.map((m,index)=>(
                    <div key={index} ref={scrollRef}>
                    <Message key={m._id} message={m} own={m.sender=== user?._id}/>
                    </div>
                ))}
                    
                    
                </div>
                <div className="chatBoxBottom">
                    <textarea className='chatMessageInput' placeholder='Write Something...' onChange={(e)=>setNewMessage(e.target.value)}
                        value={newMessage}
                    ></textarea>
                    <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                </div> </> ): (<span className='noConversationText'>Open a Conversation to start a chat.</span> )}
            </div>
        </div>
        <div className="chatOnline">
            <div className="chatOnlineWrapper">
                <ChatOnline onlineUsers={onlineUsers} currentId={user?._id} setCurrentChat={setCurrentChat}/>
            </div>
        </div>
    </div>
    </>
  )
}
