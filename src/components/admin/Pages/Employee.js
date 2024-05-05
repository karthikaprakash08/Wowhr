import React, { useEffect, useRef, useState } from 'react'
import { child, get, getDatabase, push, ref, set } from 'firebase/database';
import app from '../../../Firebase';
import { DownloadTableExcel } from 'react-export-table-to-excel';

function Employee() {

  const database = getDatabase(app);
    let [users, setusers] = useState([]);
    const tableRef = useRef(null);

    useEffect(()=>{
      fetch();
    }, [])

    function fetch(){
        get(child(ref(database), `users/employee`)).then((snapshot) => {
            if (snapshot.exists()) {
                let userlist = [];
                for(let key in snapshot.val())
                {
                    userlist.push({...snapshot.val()[key], id:key}) 
                }
                setusers(userlist)
            }
          }).catch((error) => {
            console.error(error);
          });
    }

  return (
    <div className='employee container'>
        <div className='containerHeader'>
        <div style={{display:"flex", gap:"10px"}}>
          <button className='button' onClick={(e)=>{
              e.preventDefault();
              fetch();
          }}>Refresh</button>
          <DownloadTableExcel
                    filename="userlist"
                    sheet="users"
                    currentTableRef={tableRef.current}
                >

                   <button className='button' style={{background:"orange"}}>Download</button>

                </DownloadTableExcel>
          </div>
        </div>
        <table >
                <thead>
                <th>Photo</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone No</th>
                <th>Designation</th>
                <th>Company</th>
                <th>Linkedin</th>
                </thead>
              <tbody>
              {users.map((user) => {
                return <tr key={user.id}>
                <td><img style={{height:"40px",borderRadius:"50px"}} className='photo' src={user.DP!=""?user.DP:"images/user.png"}></img></td>
                <td><p>{user.Name}</p></td>
                <td><p>{user.Gender}</p></td>
                <td><p>{user.Email}</p></td>
                <td><p>{user.Phone}</p></td>
                <td><p>{user.Designation}</p></td>
                <td><p>{user.Company}</p></td>
                <td><p>{user.Linkedin}</p></td>
                </tr>
                })} 
              </tbody>  
            </table>

            <table style={{display:"none"}} ref={tableRef}>
                <thead>
                <th>Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone No</th>
                <th>Designation</th>
                <th>Company</th>
                <th>Linkedin</th>
                </thead>
              <tbody>
              {users.map((user) => {
                return <tr key={user.id}>
                <td><p>{user.Name}</p></td>
                <td><p>{user.Gender}</p></td>
                <td><p>{user.Email}</p></td>
                <td><p>{user.Phone}</p></td>
                <td><p>{user.Designation}</p></td>
                <td><p>{user.Company}</p></td>
                <td><p>{user.Linkedin}</p></td>
                </tr>
                })} 
              </tbody>  
            </table>
    </div>
  )
}

export default Employee