import React, { useContext } from 'react'
import "./sidebar.css";
import { RssFeed ,Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,} from '@mui/icons-material';
import { Users } from '../../dummyData';  
import CloseFriend from '../closeFriend/CloseFriend';
import { Link,useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Sidebar() {

  const navigate = useNavigate();
  const {user}=useContext(AuthContext);
  const handleLogout = () => {
    // Clear user authentication data from storage (replace 'authToken' with your actual storage key)
    localStorage.removeItem('user');

    // Redirect the user to the login page
    navigate('/login');
  };

  return (
    <div className='sidebar'>
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
          <Link to="/" style={{textDecoration:"none", color:"black"}}>
          <RssFeed className='sidebarIcon'/>
              <span className="sidebarListItemText">Feed</span>
            </Link>
              
          </li>
          <li className="sidebarListItem">
          <Link to="/messenger" style={{textDecoration:"none",color:"black"}}>
          <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
                </Link>
            
          </li>
          
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          
          
          <li className="sidebarListItem" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Log Out</span>
          </li>
          
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className='sidebarHr'/>
        
      </div>
    </div>
  )
}
