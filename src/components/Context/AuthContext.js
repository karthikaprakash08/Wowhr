// import React, { createContext, useState } from 'react'

// const AuthContext = createContext({Name:"", designation:"", Linkedin:"", dp:"", setName:undefined, setdesignation:undefined, setlinkedin:undefined, setdp:undefined})

// export function AuthContextProvider(props) {

//     let [Name , setName] = useState("");
//     let [designation , setdesignation] = useState("");
//     let [Linkedin , setlinkedin] = useState("");
//     const [dp , setdp] = useState();

//   return (
//     <AuthContext.Provider value={{Name:Name, designation:designation, Linkedin:Linkedin, dp:dp, setName:setName, setdesignation:setdesignation, setlinkedin:setlinkedin, setdp:setdp}}>
//         {props.children}
//     </AuthContext.Provider>
//   )
// }

// export default AuthContext



import React, { createContext, useState } from 'react';

const AuthContext = createContext({
  email:"",
  phone:"",
  Name: "",
  designation: "",
  companyname:"",
  Linkedin: "",
  dp: "",
  profession:"",
  degree:"",
  yop:"",
  collegename:"",
  gender:"",
  isAdminLoggedin:false,
  setemail:undefined,
  setphone:undefined,
  setName: undefined,
  setdesignation: undefined,
  setcompanyname:undefined,
  setLinkedin: undefined, // <-- Updated name to setLinkedin
  setdp: undefined,
  setprofession:undefined,
  setdegree:undefined,
  setyop:undefined,
  setcollegename:undefined,
  setgender:undefined,
  setIsAdminLoggedin:undefined
});

export function AuthContextProvider(props) {
  const [Name, setName] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [designation, setdesignation] = useState("");
  const [companyname, setcompanyname] = useState("");
  const [Linkedin, setLinkedin] = useState(""); // <-- Updated name to setLinkedin
  const [dp, setdp] = useState();
  const [profession, setprofession] = useState();
  const [degree, setdegree] = useState();
  const [yop, setyop] = useState();
  const [collegename, setcollegename] = useState();
  const [gender, setgender] = useState();
  const [isAdminLoggedin, setIsAdminLoggedin] = useState(false);

  return (
    <AuthContext.Provider value={{
      email:email,
      phone:phone,
      Name: Name,
      designation: designation,
      companyname:companyname,
      Linkedin: Linkedin,
      dp: dp,
      profession:profession,
      degree:degree,
      yop:yop,
      collegename:collegename,
      gender:gender,
      isAdminLoggedin:isAdminLoggedin,
      setemail:setemail,
      setphone,setphone,
      setName: setName,
      setdesignation: setdesignation,
      setcompanyname:setcompanyname,
      setLinkedin: setLinkedin, // <-- Updated name to setLinkedin
      setdp: setdp,
      setprofession:setprofession,
      setdegree:setdegree,
      setyop:setyop,
      setcollegename:setcollegename,
      setgender:setgender,
      setIsAdminLoggedin:setIsAdminLoggedin,
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
