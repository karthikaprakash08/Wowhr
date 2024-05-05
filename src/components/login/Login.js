import React, { useContext, useState } from 'react';
import './login.css';
import AuthContext from '../Context/AuthContext';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import logo from './Assets/logo.png';
import { child, get, getDatabase, push, ref, set } from 'firebase/database';
import { ref as sRef} from 'firebase/storage';
import app from '../../Firebase'
import { getDownloadURL, getStorage, uploadBytes, uploadBytesResumable } from 'firebase/storage';

function Login() {
    const storage = getStorage(app);
    const database = getDatabase(app);
    var newuserid = "";
    var olduserid = "";
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    let [image,setimage] = useState("");
    const [phoneNumber, setPhoneNumber] = useState('in');
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailInputChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        // Declare validationErrors here
        const validationErrors = {};

        if (!value.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!validateEmail(value)) {
            validationErrors.email = 'Please enter a valid email address';
        } else {
            setEmailError('');
            authContext.setemail(value);
        }

        // Set the errors state
        setErrors(validationErrors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!authContext.email || !authContext.Name.trim()) {
            validationErrors.email = 'Email is required';
        }
        if (!authContext.Name || !authContext.Name.trim()) {
            validationErrors.name = 'Name is required';
        }
        if (!authContext.designation || !authContext.designation.trim()) {
            validationErrors.designation = 'Designation is required';
        }
        if (!authContext.companyname || !authContext.companyname.trim()) {
            validationErrors.company = 'Company Name is required';
        }
        if (!authContext.profession) {
            validationErrors.profession = 'Profession is required';
        }
        if(authContext.profession=="student" && !authContext.degree){
            validationErrors.degree = 'Degree is required';
        }
        if(authContext.profession=="student" && !authContext.yop){
            validationErrors.yop = 'Year of Passing is required';
        }
        if(authContext.profession=="student" && !authContext.collegename){
            validationErrors.collegename = 'College Name is required';
        }
        if (!authContext.phone) {
            validationErrors.phone = 'Phone Number is required';
        }
        if (!authContext.gender || authContext.gender=="0") {
            validationErrors.gender = 'Gender is required';
        }
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please check the form for errors.');
        } else {
            const storageRef = sRef(storage, `images/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadBytes(storageRef, image).then((snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                fetchimageurl()
              },
              (error) => {
                  alert(error);
              });
            
    }
    };

    function fetchimageurl(){
        const storageRef = sRef(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            uploaddatatofirebase(downloadURL)
        });
    }

    function uploaddatatofirebase(url){
        if(document.getElementById('profession').value=="student"){
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
                            Name: authContext.Name,
                            Degree:authContext.degree,
                            Yop:authContext.yop,
                            Designation: authContext.designation,
                            Company: authContext.companyname,
                            Linkedin:"Linkedin not Available",
                            College:authContext.collegename,
                            DP: url,
                            Phone: authContext.phone,
                            Gender:authContext.gender,
                            Date:Date.now()
                          });
                    }
                    else{
                        newuserid = Number(newuserid)+1;
                        set(ref(database, 'users/students/' + newuserid), {
                            Email: authContext.email,
                            Name: authContext.Name,
                            Degree:authContext.degree,
                            Yop:authContext.yop,
                            Designation: authContext.designation,
                            Company: authContext.companyname,   
                            Linkedin:"Linkedin not Available",
                            College:authContext.collegename,
                            DP: url,
                            Phone: authContext.phone,
                            Gender:authContext.gender,
                            Date:Date.now()
                          });
                    }
                } else {
                  set(ref(database, 'users/students/' + "1"), {
                    Email: authContext.email,
                            Name: authContext.Name,
                            Degree:authContext.degree,
                            Yop:authContext.yop,
                            Designation: authContext.designation,
                            Company: authContext.companyname,
                            Linkedin:"Linkedin not Available",
                            College:authContext.collegename,
                            DP: url,
                            Phone: authContext.phone,
                            Gender:authContext.gender,
                            Date:Date.now()
                  });
                }
              }).catch((error) => {
              });

            toast.success('Form submitted successfully!');
            setTimeout(() => {
                navigate('/ProudMemberCard');
            }, 3000);
        }
        else{
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
                        Name: authContext.Name,
                        Designation: authContext.designation,
                        Company: authContext.companyname,
                        DP: url,
                        Linkedin:"Linkedin not Available",
                        Phone: authContext.phone,
                        Gender:authContext.gender,
                        Date:Date.now()
                      });
                }
                else{
                    newuserid = Number(newuserid)+1;
                    set(ref(database, 'users/employee/' + newuserid), {
                        Email: authContext.email,
                        Name: authContext.Name,
                        Designation: authContext.designation,
                        Company: authContext.companyname,
                        DP: url,
                        Linkedin:"Linkedin not Available",
                        Phone: authContext.phone,
                        Gender:authContext.gender,
                        Date:Date.now()
                      });
                }
            } else {
              set(ref(database, 'users/employee/' + "1"), {
                Email: authContext.email,
                Name: authContext.Name,
                Designation: authContext.designation,
                Company: authContext.companyname,
                DP: url,
                Linkedin:"Linkedin not Available",
                Phone: authContext.phone,
                Gender:authContext.gender,
                Date:Date.now()
              });
            }
          }).catch((error) => {
            console.log(error)
          });

        toast.success('Form submitted successfully!');
        setTimeout(() => {
            navigate('/ProudMemberCard');
        }, 3000);
    }
    }

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            authContext.setdp(imageUrl);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className='loginformcontainer1 container-fluid'>
                <div className='row'>
                    <div className='col-lg-6 col-md-4'>
                        <img src={logo} alt='Logo' className='logo_img col-6 col-md-12 col-lg-4' />
                    </div>
                    <div className='col-lg-5 col-md-10'>
                        <div className='card_design card_design_2 container'>
                            <form onSubmit={handleSubmit}>
                                <h3 className='h1login'>Get Started with WoW HR</h3>

                                <div data-mdb-input-init className="form-outline mb-2">
                                    <label>Email:</label>
                                    <input
                                        className='email-style1'
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        autoComplete="off"
                                        value={email}
                                        onChange={handleEmailInputChange}
                                    />
                                    {errors.email && <span className="error">{errors.email}</span>}
                                </div>

                                <div data-mdb-input-init className="form-outline mb-2">
                                    <label>Name:</label>
                                    <input
                                        className='name-style'
                                        type="text"
                                        name="name"
                                        placeholder="Enter your Name"
                                        autoComplete="off"
                                        onChange={(e) => authContext.setName(e.target.value)}
                                    />
                                    {errors.name && <span className="error">{errors.name}</span>}
                                </div>
                                <div data-mdb-input-init className="form-outline mb-2">
                                    <label>Profession:</label>
                                    <div className="input-group">
                                        <select
                                            className="form-select form-control"
                                            id="profession"
                                            name="profession"
                                            onChange={(e) => authContext.setprofession(e.target.value)}
                                        >
                                            <option value="">Select Profession</option>
                                            <option value="employee">Employee</option>
                                            <option value="student">Student</option>
                                        </select>
                                    </div>
                                    {errors.profession && <span className="error">{errors.profession}</span>}
                                </div>
                                
                                {/* Conditionally render the following fields based on profession */}
                                
                                    <div data-mdb-input-init className="form-outline mb-2">
                                    <label>Designation:</label>
                                    <input
                                        className='designation-style'
                                        type="text"
                                        name="designation"
                                        placeholder="Enter your Designation"
                                        autoComplete="off"
                                        onChange={(e) => authContext.setdesignation(e.target.value)}
                                    />
                                    {errors.designation && <span className="error">{errors.company}</span>}
                                </div>
                                    <div data-mdb-input-init className="form-outline mb-2">
                                        <label>Company Name:</label>
                                        <input
                                            className='designation-style'
                                            type="text"
                                            name="Company name"
                                            placeholder="Enter your Company Name"
                                            autoComplete="off"
                                            onChange={(e) => authContext.setcompanyname(e.target.value)}
                                        />
                                        {errors.company && <span className="error">{errors.company}</span>}
                                    </div>
                                
                                
                                {authContext.profession === "student" && (
                                    <>
                                        <div data-mdb-input-init className="form-outline mb-2">
                                            <label>Degree:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="degree"
                                                name="degree"
                                                placeholder="Enter your Degree"
                                                onChange={(e) => authContext.setdegree(e.target.value)}
                                            />
                                            {errors.degree && <span className="error">{errors.degree}</span>}
                                        </div>
                                        <div data-mdb-input-init className="form-outline mb-2">
                                            <label>Year of Passing:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="yearOfPassing"
                                                name="yearOfPassing"
                                                placeholder="Enter your Year of Passing"
                                                onChange={(e) => authContext.setyop(e.target.value)}
                                            />
                                            {errors.yop && <span className="error">{errors.yop}</span>}
                                        </div>
                                        <div data-mdb-input-init className="form-outline mb-2">
                                            <label>College Name:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="college"
                                                name="college"
                                                placeholder="Enter your Collge Name"
                                                onChange={(e) => authContext.setcollegename(e.target.value)}
                                            />
                                            {errors.collegename && <span className="error">{errors.collegename}</span>}
                                        </div>
                                    </>
                                )}

                                <div data-mdb-input-init className="form-outline mb-2 width_style">
                                    <label>Phone Number:</label>
                                    <PhoneInput
                                        className="phone-input"
                                        country={phoneNumber}
                                        placeholder="Enter phone number"
                                        onChange={(value) => authContext.setphone(value)}
                                        countryCodeEditable={false}
                                        inputProps={{ className: 'phone-input-input' }}
                                        dropdownClass="phone-input-country-select"
                                    />
                                    {errors.phone && <span className="error">{errors.phone}</span>}
                                </div>

                                <div data-mdb-input-init className="form-outline mb-2">
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

                                <div data-mdb-input-init className="form-outline mb-2">
                                    <label>Upload Image:</label>
                                    <input
                                        id="imageInput"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e)=>{
                                            e.preventDefault()
                                            setimage(e.target.files[0])
                                            handleImageChange(e)}}
                                    />
                                    <div
                                        className="image-drop"
                                        onClick={() => document.getElementById('imageInput').click()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setimage(e.target.files[0])
                                            handleImageChange(e);
                                        }}
                                        onDragOver={(e) => e.preventDefault()}
                                    >
                                        {authContext.dp ? (
                                            <p className='image_text'>Image uploaded</p>
                                        ) : (
                                            <p className='image_text'>Upload image here</p>
                                        )}
                                    </div>
                                </div>

                                <button type="submit" className="submit mb-1">Get Started</button>
                                <p style={{ marginTop: '10px'}}>
                                    If you have a LinkedIn account, please <Link to='../'>Click here</Link>.
                                </p>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
