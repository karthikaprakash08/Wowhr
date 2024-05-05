//imported in react
import { useContext, useRef } from "react";

//imported in canvas
import html2canvas from "html2canvas";

//imported in font
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faSquareTwitter } from "@fortawesome/free-brands-svg-icons";
import { faSquareInstagram } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faSquareYoutube } from "@fortawesome/free-brands-svg-icons";

//import in auth file
import AuthContext from "../Context/AuthContext";

//style.css
import "./CertificateContainer.css";

//imported image
import logo from '../login/Assets/logo.png';
import proud from './Assets/ribbon.png';
import linkedin from './Assets/Linkedin-logo.png';


function CertificateContainer() {
  let authcontext = useContext(AuthContext);

  const CertificateRef = useRef(null);

  var linkedinoriginal = authcontext.Name;
  var linkedinid = linkedinoriginal.replace(" ", "").toLowerCase()
 
  const getLinkedInName = (url) => {
    const parts = url.split("/");
    const name = parts[4];
    return name;
  };

  const handleDownload = async () => {
    if (!CertificateRef.current) return;

    try {
      // Capture the certificate as a canvas
      const canvas = await html2canvas(CertificateRef.current, {
        scale: 1.5, // Increase scale for better quality
        useCORS: true, // Use CORS if necessary
      });

      // Convert the canvas to a data URL (base64 encoded PNG)
      const dataURL = canvas.toDataURL("image/png");

      // Create a link element to download the image
      const link = document.createElement("a");
      link.href = dataURL; // Set the href to the data URL
      link.download = "proudmembercard.png"; // Set the filename for the download

      // Append the link to the document and trigger a click to start the download
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error capturing or downloading certificate:", error);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row  d-flex justify-content-center align-items-center">
          <div className="col-md-8 text-center">
            <div className="col-md-8">
              <img src={logo}
               className="m-4" width='300px' height='70px'/>
            </div>
          </div>

          <div className="col-md-4  text-center">
            <div className="rightcontainer">
              <button type="button" className="btn" onClick={handleDownload}>
              {" "}
              Download Card
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center">
          <div className="leftcontainer">
            <div className="certificate" id="certificate" ref={CertificateRef}>
              <img className="ribbon" src={proud} alt="ribbon" />
              <div className="links">
                <a href="https://wowhr.in/">www.wowhr.in</a>
                <div className="socialmedia">
                  <div className="icons">
                    <FontAwesomeIcon
                      icon={faFacebook}
                      style={{ fontSize: "35px", color: "#1877f2" }}
                    />
                    <FontAwesomeIcon
                      icon={faSquareTwitter}
                      style={{ fontSize: "35px", color: "#6eadff" }}
                    />
                    <FontAwesomeIcon
                      icon={faSquareInstagram}
                      style={{ fontSize: "35px", color: "rgb(255, 0, 200)" }}
                    />
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      style={{ fontSize: "35px", color: "#1877f2" }}
                    />
                    <FontAwesomeIcon
                      icon={faSquareYoutube}
                      style={{ fontSize: "35px", color: "red" }}
                    />
                  </div>
                  <h2>wowhr</h2>
                </div>
              </div>
              <div className="dpcontainer">
                <img  src={authcontext.dp!="" ? authcontext.dp : "images/user.png"} alt="" id="dp"/>
              </div>
              <div className="namecontainer">
                <div style={{ fontSize: "23px" }} className="name" id="name">
                  <b>{authcontext.Name}</b><br/>

                  <p className="designation">{authcontext.designation} , {authcontext.companyname}</p>
                </div>

                {authcontext.Linkedin != "" && (
                  <div className="d-flex" style={{alignItems:"center",gap:"5px"}}>
                    
                    <img  className="linkedin-logo-small"  src={linkedin} alt="LinkedIn Logo"/>
                    <p className="linkedin" id="linkedin">
                    <b>{linkedinid}</b>
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>  
  );
}

export default CertificateContainer;