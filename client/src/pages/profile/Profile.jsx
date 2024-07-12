import React from 'react'
import "./profile.css";
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';


export default function Profile() {
  const PF=process.env.REACT_APP_PUBLIC_FOLDER;
  const [user,setUser]=useState({})
  const username=useParams().username;
  console.log('profile renderd')
 

  useEffect(()=>{
    const fetchUser=async()=> {
    try {
        const res = await axios.get(`http://localhost:8800/users?username=${username}`);
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchUser();
  },[username])
  return (
    <>
        <Topbar/>
        <div className="profile">
        <Sidebar/>
        <div className="profileRight">
        <div className="profileRightTop">
            <div className="profileCover">
                <img className='profileCoverImg' src={user.coverPicture ? PF+user.coverPicture : PF+"person/noCover.png"} alt="" />
                <img className='profileUserImg' src={user.profilePicture ? PF+user.profilePicture : PF+"person/noAvatar.png"} alt="" />
            </div>
            <div className="profileInfo">
                <h4 className='profileInfoName'>{user.username}</h4>
                <span className='profileInfoDesc'>{user.des}</span>
            </div>
            
        </div>
        <div className="profileRightBottom">
          <Feed username={username}/>
          <Rightbar user={user}/>
        </div>
        
        </div>
        
        </div>
        
    </>
  )
}
