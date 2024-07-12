import React, { useContext, useEffect, useState } from 'react'
import "./rightbar.css";
import { Users } from '../../dummyData';
import Online from '../online/Online2';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Add, Remove } from '@mui/icons-material';


export default function Rightbar( {user} ) {
  const PF=process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends,setFriends]=useState([])
  const {user:currentUser,dispatch}=useContext(AuthContext)
  const [followed,setFollowed]=useState(currentUser.following.includes(user?._id));
  console.log('right bar rendeered')


  useEffect(() => {
    setFollowed(currentUser.following.includes(user?._id))
  },[currentUser,user]);

  useEffect(()=>{
  
    
    const getFriends=async ()=>{
      try{
        console.log("user id is " , user , user?._id)
        const friendList=await axios.get(`http://localhost:8800/users/friends/${user._id}`);
        console.log("friend list " , friendList);
        setFriends(friendList?.data?.data);
      }
      catch(err){
        console.log("Error fetching user's friends:",err);
        
      }
    }
    getFriends();
  },[user]);

  const handleClick=async()=>{
    console.log(user._id , currentUser._id)
    try{
      if(followed){
        await axios.put(`http://localhost:8800/users/${user._id}/unfollow`,{userId:currentUser._id,});
        dispatch({type:"UNFOLLOW",payload:user._id})
      }
      else{
        await axios.put(`http://localhost:8800/users/${user._id}/follow`,{userId:currentUser._id});
        dispatch({type:"FOLLOW",payload:user._id})
      }
      setFollowed(!followed)
    }
    catch(err){
      console.log(err);
    }
    
  }


  const HomeRightbar=()=>{
    return(
      <>
        <div className="birthdayContainer">
          <img className='birthdayImg' src="assets/gift.png" alt="" />
          <span className="birthdayText"><b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.</span>
        </div>
        <img src="assets/ad.png" alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u)=>(
            <Online key={u.id} user={u}/>
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar=()=>{

    return (
      <>
      {user.username !== currentUser.username && (
        <button className="rightbarFollowButton" onClick={handleClick}>
        {followed?"Unfollow":"Follow"}
        {followed?<Remove/>:<Add/>}
          
        </button>
      )}
        <h4 className='rightbarTitle'>User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user.relationship===1 ? "Single" : user.relationship===2 ? "Married" : "-"}</span>
          </div>
        </div>
        <h4 className='rightbarTitle'>User Friends</h4>
        <div className="rightbarFollowings">
        {friends?.map((friend,index)=>(
          <Link to={"/profile/" + friend.username} style={{textDecoration:"none"} } key={index}>
          <div className="rightbarFollowing">
            <img src={friend.profilePicture? PF+friend.profilePicture : PF+"person/noAvatar.png"} alt="" className="rightbarFollowingImg" />
            <span className="rightbarFollowingName">{friend.username}</span>
            
          </div>
          </Link>
                  
        ))}
        </div>
      </>
    )
  }
  return (
    <div className='rightbar'>
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar/> : <HomeRightbar/>}
      </div>
    </div>
  )
}
