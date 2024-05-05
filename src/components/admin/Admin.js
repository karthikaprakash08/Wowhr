import React, { useContext, useEffect, useState } from 'react'
import  './Admin.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, Outlet } from 'react-router-dom';
import AdminLogin from './Pages/AdminLogin';
import AuthContext from '../Context/AuthContext';

function Admin() {

  let authContext  = useContext(AuthContext);

  return (
    <>
    {!authContext.isAdminLoggedin && <AdminLogin></AdminLogin>}
    {authContext.isAdminLoggedin && 
    <div class="admin-container">
      <div className='smallnav' id='smallnav'>
      <FontAwesomeIcon onClick={(e)=>{
        e.preventDefault()
        if(document.getElementById("nav").style.display=="none"){
          document.getElementById("nav").style.display="flex";
        }
        else{
          document.getElementById("nav").style.display="none";
        }
      }} style={{fontSize:"30px"}} className='menubtn' icon={faBars} />
      <img src="images/logo.png" alt="logo" height="60px" ></img>
      </div>
        <nav id='nav'>
          <ul>
            <li>
                <img src="images/logo.png" alt="logo" height="60px" ></img>
            </li>
            <br></br>
            <li><Link to="../admin">
                <FontAwesomeIcon icon={faChartColumn} />
                <span class="nav-item">Dashboard</span>
              </Link></li>
            <li><Link to="./Employee">
              <FontAwesomeIcon icon={faUsers} />
              <span class="nav-item">Employee</span>
            </Link></li>
            <li><Link to="./Students">
              <FontAwesomeIcon icon={faGraduationCap} />
              <span class="nav-item">Students</span>
            </Link></li>
            <li><Link to="../admin" onClick={(e)=>{
              e.preventDefault();
              authContext.setIsAdminLoggedin(false)
            }} className='logout'>
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span class="nav-item">Log out</span>
            </Link></li>
          </ul>
        </nav>
        
    
        <section class="main">
          <Outlet></Outlet>
        </section>
      </div>}
      </>
  )
}

export default Admin