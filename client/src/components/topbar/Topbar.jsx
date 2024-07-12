import React, { useContext ,useState, useHistory} from 'react';
import "./topbar.css";
import { Search ,Person,Chat,Notifications} from '@mui/icons-material';
import {Link} from "react-router-dom"
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";


function Topbar() {
    const {user}=useContext(AuthContext)
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;

    const [searchQuery, setSearchQuery] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  // const history = useHistory();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPerson, setPerson] = useState(false);
  

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

const handleUserClick = (username) => {    
    setMatchingUsers([]);
    setSearchQuery('');   
};

const handleNotificationsClick = () => {
  setShowNotifications(!showNotifications);
};

const notifications = [
  "Dora Hawks posted a new photo",
  "Someone liked your post.",
  "New comment on your photo."
];

const handlePersonClick = () => {
  setPerson(!showPerson);
};

const person = [
  "Travis Bennet started following you",
  "2 person viewed your profile",
  
];


  return (
    <div className='topbarContainer'>
        <div className='topbarLeft'>
            <Link to="/" style={{textDecoration:"none"}}>
            <span className="logo">SocialSphere</span>
            </Link>
            
        </div>
        <div className='topbarCenter'>
            <div className="searchbar">
                <Search className='searchIcon'/>
                <input type="text"
                 placeholder='Search for friend ,post or video'
                  className="searchInput" 
                 value={searchQuery}
                 onChange={(e)=>handleSearch(e.target.value)}   
                 onBlur={handleBlur}
                  />
                  { matchingUsers.length > 0 && (
        <div className="dropdown-container">
          <ul className="dropdown-menu">
            {matchingUsers.map((user) => (
              <li key={user.id} className="dropdown-item"
              >
              <Link to={`/profile/${user.username}` }
              onClick={() => handleUserClick(user.username)}>

              {user.username}

              </Link>
                
              </li>
            ))}
          </ul>
        </div>
      )}
      {matchingUsers.length === 0 && searchQuery && (
        <div className="no-results">No matching users found</div>
      )}
                 
            </div>
        </div>
        <div className='topbarRight'>
            <div className="topbarLinks">
            <Link to="/" style={{textDecoration:"none", color:"white"}}>
                <span className="topbarLink">Homepage</span>
                </Link>
                <Link to={`/profile/${user.username}`} style={{textDecoration:"none", color:"white"}}>    
                <span className="topbarLink">Timeline</span>
                </Link>
            </div>
            <div className="topbarIcons">
                <div className="topbarIconItem" onClick={handlePersonClick}>
                    <Person/>
                    <span className="topbarIconBadge">1</span>
                    {showPerson && (
                            <div className="notificationsDropdown">
                                <ul>
                                    {person.map((person, ind) => (
                                        <li key={ind}>{person}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                </div>
                <div className="topbarIconItem">
                <Link to="/messenger" style={{color:"white"}}>
                    <Chat/>
                </Link>
                    
                    <span className="topbarIconBadge">2</span>
                </div>
                <div className="topbarIconItem" onClick={handleNotificationsClick}>
                    <Notifications/>
                    <span className="topbarIconBadge">1</span>
                    {showNotifications && (
                            <div className="notificationsDropdown">
                                <ul>
                                    {notifications.map((notification, index) => (
                                        <li key={index}>{notification}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                </div>
            </div>
            <Link to={`/profile/${user.username}`}>
            <img src={user.profilePicture ? PF+user.profilePicture: PF+"person/noAvatar.png"} alt="" className="topbarImg" />
            </Link>
            
        </div>
        
    </div>
  )
}

export default Topbar