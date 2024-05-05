import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

function AdminLogin() {

  let [username, setusername] = useState("");
  let [password, setpassword] = useState("");
  const [errors, setErrors] = useState({});

  let authContext = useContext(AuthContext);

  function handleAdminLogin(){
    const validationErrors = {};
    if(username.trim()==""){
      validationErrors.username = 'Username is required';
    }
    if(password.trim()==""){
      validationErrors.password = 'Password is required';
    }
    if (Object.keys(validationErrors).length === 0) {
      if(username=="Admin" && password=="Admin"){
        authContext.setIsAdminLoggedin(true)
      }
    }
    else {
      setErrors(validationErrors);
      toast.error('Please check the form for errors!');
  }
  }

  return (
    <>
    <ToastContainer></ToastContainer>
    <div  className='adminlogin'>
      <form onSubmit={(e)=>{
        e.preventDefault();
        handleAdminLogin()}}>
        <h3>Admin Login</h3>
        <div data-mdb-input-init className="form-outline mb-3">
          <label>USERNAME:</label>
          <input
              className='url-style1'
              type="text"
              name="website"
              placeholder="Username"
              autoComplete="off"
              onChange={(e) => setusername(e.target.value)}
          />
          {errors.username && <span className="error">{errors.username}</span>}
          </div>
          <div data-mdb-input-init className="form-outline mb-3">
          <label>PASSWORD:</label>
          <input
              className='url-style1'
              type="text"
              name="website"
              placeholder="Password"
              autoComplete="off"
              onChange={(e) => setpassword(e.target.value)}
          />
          {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div style={{width:"100%",display:"flex", justifyContent:"center"}}>
              <button className='submit' type="submit">Login</button>
          </div>
          <p style={{ marginTop: '20px', marginBottom: '20px' }}>
                  If you don't have a Admin Account, please <Link to='../'>Click here</Link>.
              </p>
      </form>
    </div>
    </>
  )
}

export default AdminLogin