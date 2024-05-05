import React, { useContext, useState } from 'react';
import './loginlindein.css';
import AuthContext from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './Assets/logo.png';
import { child, get, getDatabase, push, ref, set } from 'firebase/database';
import app from '../../Firebase'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 

function LinkedinLogin() {
    const database = getDatabase(app);
    var newuserid = "";
    var olduserid = "";
    const currDate = new Date();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [emailError, setEmailError] = useState('');
    
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // With country select 
    const [number, setNumber] = useState('in');

    // Handle email change
    const handleEmailChange = (e) => {
        const { value } = e.target;

        if (value.trim() === '') {
            setEmailError('Email is required');
        } else if (!validateEmail(value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
            authContext.setemail(value); // Update email in AuthContext
        }
    };

    // Handle form submission
    async function handleSubmit(apiKeyIndex) {

        // Form validation
        const validationErrors = {};
        if (!authContext.email.trim()) {
            validationErrors.email = 'Email is required';
        }
        if (!authContext.Linkedin.trim()) {
            validationErrors.linkedin = 'LinkedIn URL is required';
        }
        if (document.getElementById("profession").value=="0") {
            validationErrors.profession = 'profession is required';
        }
        if (!authContext.phone.trim()) {
            validationErrors.phone = 'Phone is required';
        }
        if (document.getElementById("gender").value=="0") {
            validationErrors.gender = 'Gender is required';
        }

        if (Object.keys(validationErrors).length === 0) {

            const apiKeys = [
                "330e744001mshfa39ba35c13b477p1bd019jsnbb0f2ffa23af",
                "d76e658a11mshd6c269f5a381918p174e9bjsn0f7de04b570d",
                "cf6edef85bmshc580a1192f3c722p17ddaajsn2f6a0d7753f0",
                "068c967727msh781cf0890e2c976p141edajsnbaef46c467d3",
                "d3e1864eddmshf29731ae68cda9ap112587jsn9cc3247c543c",
                "bc7bb835b8msh4998bc7fc7c13afp116fa7jsn54910e3a0fef",
                "1b035e86d7msh793f7fdae8c75a0p15d6e0jsne93d7980042d",
                "e7f861ce3emshc756a74c6f16a9ep17c98ejsn86255ac2f58a",
                "91c6c5d5b0msh6d699df9be69317p1f91eajsn92a6d509a7ed",
            ];

            const url = "https://linkedin-profiles-and-company-data.p.rapidapi.com/profile-details";
            
            const profileId = authContext.Linkedin.match(/(?<=linkedin\.com\/in\/)[\w-]+/)[0];

            const headers = {
                "content-type": "application/json",
                "X-RapidAPI-Key": apiKeys[apiKeyIndex],
                "X-RapidAPI-Host": "linkedin-profiles-and-company-data.p.rapidapi.com"
            };

            try {
                const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    "profile_id": profileId,
                    "profile_type": "personal",
                    "contact_info": false,
                    "recommendations": false,
                    "related_profiles": false
                })
            });

                if (!response.ok) {
                    if ((response.status === 429 && apiKeyIndex < apiKeys.length - 1) || (response.status === 403  && apiKeyIndex < apiKeys.length - 1)) {
                        console.log("Switching to next API key...");
                        handleSubmit(apiKeyIndex + 1);
                    } else {
                        throw new Error('Failed to fetch profile data');
                    }
                }
                else{
                    toast.success('Fetching data...');
                const data = await response.json();
                console.log(data)
                const { first_name, last_name, headline, position_groups, profile_picture, education } = data;
                const firstTitle = position_groups && position_groups.length > 0 ? position_groups[0].profile_positions[0].title : '';
                const fieldofstudy = education  && education.length > 0 ? education[0].degree_name+" "+education[0].field_of_study : '';
                const schoolName = education  && education.length > 0 ? education[0].school.name : '';
                const endyear = education  && education.length > 0 ? education[0].date.end.year : '';
                const firstTitlecompany = position_groups && position_groups.length > 0 ? position_groups[0].profile_positions[0].company : '';

                authContext.setName(`${first_name} ${last_name}`);
                authContext.setdesignation(firstTitle);
                authContext.setcompanyname(firstTitlecompany);
                authContext.setdp(profile_picture);
                authContext.setdegree(fieldofstudy);
                authContext.setyop(endyear);
                authContext.setcollegename(schoolName);


                if(document.getElementById('profession').value=="student"){
                    console.log("student")
                    get(child(ref(database), `users/students/`)).then((snapshot) => {
                        if (snapshot.exists()) {
                            snapshot.forEach((user)=>{
                                newuserid = user.key;
                                if(user.val().Email == authContext.email){
                                  olduserid = user.key;
                                }
                            })
                            if(olduserid!=""){
                                set(ref(database, 'users/students/' + olduserid), {
                                    Email: authContext.email,
                                    Name: `${first_name} ${last_name}`,
                                    Degree:fieldofstudy,
                                    Yop:endyear,
                                    College:schoolName,
                                    DP: profile_picture,
                                    Linkedin: authContext.Linkedin,
                                    Phone: authContext.phone,
                                    Gender:authContext.gender,
                                    Date:Date.now()
                                  });
                            }
                            else{
                                newuserid = Number(newuserid)+1;
                                set(ref(database, 'users/students/' + newuserid), {
                                    Email: authContext.email,
                                    Name: `${first_name} ${last_name}`,
                                    Degree:fieldofstudy,
                                    Yop:endyear,
                                    College:schoolName,
                                    DP: profile_picture,
                                    Linkedin: authContext.Linkedin,
                                    Phone: authContext.phone,
                                    Gender:authContext.gender,
                                    Date:Date.now()
                                  });
                            }
                        } else {
                          set(ref(database, 'users/students/' + "1"), {
                            Email: authContext.email,
                                    Name: `${first_name} ${last_name}`,
                                    Degree:fieldofstudy,
                                    Yop:endyear,
                                    College:schoolName,
                                    DP: profile_picture,
                                    Linkedin: authContext.Linkedin,
                                    Phone: authContext.phone,
                                    Gender:authContext.gender,
                                    Date:Date.now()
                          });
                        }
                      }).catch((error) => {
                      });
    
                    
                    setTimeout(function(){
                        navigate('/ProudMemberCard');
                    },5000)
                }
                else
                {
                get(child(ref(database), `users/employee/`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        snapshot.forEach((user)=>{
                            newuserid = user.key;
                            if(user.val().Email == authContext.email){
                              olduserid = user.key;
                            }
                        })
                        if(olduserid!=""){
                            set(ref(database, 'users/employee/' + olduserid), {
                                Email: authContext.email,
                                Name: `${first_name} ${last_name}`,
                                Designation: firstTitle,
                                Company: firstTitlecompany,
                                DP: profile_picture,
                                Linkedin: authContext.Linkedin,
                                Phone: authContext.phone,
                                Gender:authContext.gender,
                                Date:Date.now()
                              });
                        }
                        else{
                            newuserid = Number(newuserid)+1;
                            set(ref(database, 'users/employee/' + newuserid), {
                                Email: authContext.email,
                                Name: `${first_name} ${last_name}`,
                                Designation: firstTitle,
                                Company: firstTitlecompany,
                                DP: profile_picture,
                                Linkedin: authContext.Linkedin,
                                Phone: authContext.phone,
                                Gender:authContext.gender,
                                Date:Date.now()
                              });
                        }
                    } else {
                      set(ref(database, 'users/employee/' + "1"), {
                        Email: authContext.email,
                                Name: `${first_name} ${last_name}`,
                                Designation: firstTitle,
                                Company: firstTitlecompany,
                                DP: profile_picture,
                                Linkedin: authContext.Linkedin,
                                Phone: authContext.phone,
                                Gender:authContext.gender,
                                Date:Date.now()
                      });
                    }
                  }).catch((error) => {
                  });

                
                setTimeout(function(){
                    navigate('/ProudMemberCard');
                },5000)
            }
                }
            } catch (error) {
                toast.error('Failed to fetch data. Please try again later.');
            }
        } else {
            setErrors(validationErrors);
            toast.error('Please check the form for errors!');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className='loginformcontainer1 container-fluid '>
                <div className='row'>
                    <div className='col-lg-6 col-md-4'>
                        <img src={logo} alt='Logo' className='logo_img col-6 col-md-12 col-lg-4' />
                    </div>

                    <div className='col-lg-5 col-md-10'>
                        <form className='card_design container' onSubmit={(e) =>{
                            e.preventDefault();
                            handleSubmit(0);
                            }} style={{ borderRadius: '10px' }}>
                                <h3 className='h1login'>Get Started with WoW HR</h3>
                            <div data-mdb-input-init className="form-outline mb-3">
                                <label>LINKEDIN URL:</label>
                                <input
                                    className='url-style1'
                                    type="text"
                                    name="website"
                                    placeholder="LinkedIn URL"
                                    autoComplete="off"
                                    onChange={(e) => authContext.setLinkedin(e.target.value)}
                                />
                                {errors.linkedin && <span className="error">{errors.linkedin}</span>}
                                <span style={{marginTop : '5px',color:'#0080ff'}}>Sample : https://www.linkedin.com/in/sutheesh-s-7b9169130/</span>
                            </div>

                            <div data-mdb-input-init className="form-outline mb-3">
                                    <label>Profession:</label>
                                    <div className="input-group">
                                        <select
                                            className="form-select form-control"
                                            id="profession"
                                            name="profession"
                                            onChange={(e) => authContext.setprofession(e.target.value)}
                                        >
                                            <option value="0">Select Profession</option>
                                            <option value="employee">Employee</option>
                                            <option value="student">Student</option>
                                        </select>
                                    </div>
                                    {errors.profession && <span className="error">{errors.profession}</span>}
                                </div>

                            <div data-mdb-input-init className="form-outline mb-3">
                                <label>Email:</label>
                                <input
                                    className='email-style1'
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    onChange={handleEmailChange}
                                />
                                {errors.email && <span className="error">{errors.email}</span>}
                            </div>

                            <div data-mdb-input-init className="form-outline mb-3 width_style">
                                <label>Phone Number:</label>
                                <PhoneInput
                                    country={number}
                                    placeholder="Enter phone number"
                                    onChange={(value) => { authContext.setphone(value); }}
                                    countryCodeEditable={false}
                                    inputProps={{ className: 'phone-input-input' }}
                                    dropdownClass="phone-input-country-select"
                                />
                                {errors.phone && <span className="error">{errors.phone}</span>}
                            </div>

                            <div data-mdb-input-init className="form-outline mb-3">
                                    <label>Gender:</label>
                                    <div className="input-group">
                                        <select
                                            className="form-select form-control"
                                            id="gender"
                                            name="gender"
                                            onChange={(e) => authContext.setgender  (e.target.value)}
                                            required
                                        >
                                            <option value="0">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Others</option>
                                        </select>
                                    </div>
                                    {errors.gender && <span className="error">{errors.gender}</span>}
                                </div>

                            <div>
                                <button className='submit' type="submit">Get Started</button>
                                <p style={{ marginTop: '10px'}}>
                                    If you don't have a LinkedIn account, please <Link to='/login'>Click here</Link>.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LinkedinLogin;