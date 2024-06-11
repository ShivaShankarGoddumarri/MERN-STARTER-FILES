import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

import { socket_io } from "../../Utils";
import ProfileImageUpdate from "./ProfileImageUpdate";
import NameGenerator from "../Common/NameGenerator";



const Navbar = () => {
  const { email, role, userName, image, user_id } = useSelector(
    (store) => store.auth.loginDetails
  );
  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  const [open, setOpen] = React.useState(false);
  const userDetailsRef = useRef(null);


  const handleClickOpen = () => {
    document
      .getElementsByClassName("userDetails")[0]
      .classList.remove("showUserDetails");
    setOpen(true);
  };


  const navigate = useNavigate();

  const [selectedIcon, setSelectedIcon] = useState("");

  const handleItemClick = (val) => {
    setSelectedIcon(val);
  };


  const handleClickOutside = (event) => {
    if (
      userDetailsRef.current &&
      !userDetailsRef.current.contains(event.target) &&
      event.target.id !== "editProfile" &&
      event.target.id !== "Profile-img"
    ) {
      document
        .getElementsByClassName("userDetails")[0]
        .classList.remove("showUserDetails");
    }
  };


  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {

    if (currentPath === "/") {
      setSelectedIcon("home");
    }else if (currentPath === "/dashboard") {
      setSelectedIcon("dashboard");
    } else if (currentPath === "/mentors") {
      setSelectedIcon("mentors");
    } 
  }, [currentPath, role]);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // console.log(window.location.pathname.slice(1));

    if (document.getElementsByClassName("navSelected")?.length > 0) {
      document
        .getElementsByClassName("navSelected")[0]
        ?.classList.remove("navSelected");
    }
    if (document.getElementsByClassName("highletNavImg")?.length > 0) {
      document
        .getElementsByClassName("highletNavImg")[0]
        ?.classList.remove("highletNavImg");
    }

    if (window.location.pathname.slice(1) !== "editProfile") {
      document
        .getElementById(window.location.pathname.slice(1))
        ?.classList.add("navSelected");
      if (window.location.pathname.slice(1).split("/")[0] === "conversations") {
        document
          .getElementById("conversations")

          ?.classList.add("navSelected");
      }

      if (window.location.pathname.slice(1).split("/")[0] === "user") {
        document
          .getElementById("searchusers")

          ?.classList.add("navSelected");
      }

      if (window.location.pathname.slice(1).split("/")[0] === "livePitches") {
        document
          .getElementById("livePitches")

          ?.classList.add("navSelected");
      }
    } else {
      document
        .getElementById(window.location.pathname.slice(1))
        ?.children[0].classList.add("highletNavImg");
    }
  }, [window.location.pathname]);


  const [helpPopOpen, setHelpPopOpen]= useState(false)


  const logoutDecider = (value) => {

    if (value == 'All') {
      socket.current.emit("logoutAll", {
        userId: user_id,

      });
      localStorage.removeItem("user");
      localStorage.clear();
      window.location.href = "/login";
    } else if (value == 'Single') {
      localStorage.removeItem("user");
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  return (
    <div
      className="navbar"
      style={{
        display: localStorage.getItem("user") == undefined ? "none" : "flex",
      }}
    >
      <div
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/home");
        }}
      >
        <img
          id="logoImage" 
          src="/logo.png"
          // src={
            
          //   localStorage.getItem("theme") == "light"
          //     ? process.env.REACT_APP_MAIL_LOGO
          //     : process.env.REACT_APP_MAIL_LOGO
          // }
          alt="logo"
        />
      </div>

      

      <div className="menuIcons">
          <>
            {role === "Admin" && (
              <>
              <div title="Profiles">
                <i className="far fa-user icon" id="profiles"
                  onClick={() => navigate("/profiles")}></i>
               
              </div>
              </>
            )}
        </>
        

        {/* DARK AND WHITE THEME */}
        {/* <div
          id=""
          className="icon"
          title={`Switch to ${
            localStorage.getItem("theme") === "light" ? "Dark" : "Light"
          } Mode`}
          onClick={(e) => {
            const body = document.body;
            const currentTheme = body.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            const mode = newTheme === "light" ? "Dark" : "Light";

            body.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            document.getElementById("themeIcon").className = `fas fa-${
              newTheme == "light" ? "moon" : "sun"
            }`;

            // Switching the logo based on the theme
            const logoImg = document.getElementById("logoImage");
            logoImg.src =
              newTheme === "light" ? process.env.REACT_APP_MAIL_LOGO : process.env.REACT_APP_MAIL_LOGO;
            logoImg.alt = `${mode} Logo`;

            e.currentTarget.title = `Switch to ${mode} Mode`;
          }}
        >
          <i
            id="themeIcon"
            class={`fas fa-${
              localStorage.getItem("theme") == "light" ? "moon" : "sun"
            }`}
          ></i>
        </div>         */}
          <>
            {/* HOME ICON */}

            <div
              className={`navbar-item ${selectedIcon === "home" ? "selected" : ""
                }`}
              onClick={() => {
                navigate("/");
                handleItemClick("home");
              }}
            >
              {selectedIcon === "home" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  id="dashboard"
                  className="icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M13 3v6h8V3m-8 18h8V11h-8M3 21h8v-6H3m0-2h8V3H3z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  id="dashboard"
                  className="icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6zm2-10h4V5H5zm10 8h4v-6h-4zm0-12h4V5h-4zM5 19h4v-2H5zm4-2"
                  />
                </svg>
              )}
              <div className={`navbar-title ${selectedIcon === "home" ? "selected-title" : ""}`}>Home</div>
            </div>

            {/* DASHBOARD ICON */}

            <div
              className={`navbar-item ${selectedIcon === "dashboard" ? "selected" : ""
                }`}
              onClick={() => {
                navigate("/dashboard");
                handleItemClick("dashboard");
              }}
            >
              {selectedIcon === "dashboard" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  id="dashboard"
                  className="icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  id="dashboard"
                  className="icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2zm2 2H5V5h14v14.1M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2"
                  />
                </svg>
              )}
              <div className={`navbar-title${selectedIcon === "dashboard" ? " selected-title" : ""}`}>Dashboard</div>
            </div>

            {/* MENTOR ICON */}
            <div
              className={`navbar-item ${selectedIcon === "mentors" ? "selected" : ""
                }`}
              onClick={() => {
                navigate("/searchusers");
                handleItemClick("mentors");
              }}
            >
              {selectedIcon === "mentors" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 256 256"
                  id="searchusers"
                  className="icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h13.39a8 8 0 0 0 7.23-4.57a48 48 0 0 1 86.76 0a8 8 0 0 0 7.23 4.57H216a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16M104 168a32 32 0 1 1 32-32a32 32 0 0 1-32 32m112 32h-56.57a63.93 63.93 0 0 0-13.16-16H192a8 8 0 0 0 8-8V80a8 8 0 0 0-8-8H64a8 8 0 0 0-8 8v96a8 8 0 0 0 6 7.75A63.72 63.72 0 0 0 48.57 200H40V56h176Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 256 256"
                  id="searchusers"
                  className="icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h13.39a8 8 0 0 0 7.23-4.57a48 48 0 0 1 86.76 0a8 8 0 0 0 7.23 4.57H216a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16M80 144a24 24 0 1 1 24 24a24 24 0 0 1-24-24m136 56h-56.57a64.39 64.39 0 0 0-28.83-26.16a40 40 0 1 0-53.2 0A64.39 64.39 0 0 0 48.57 200H40V56h176ZM56 96V80a8 8 0 0 1 8-8h128a8 8 0 0 1 8 8v96a8 8 0 0 1-8 8h-16a8 8 0 0 1 0-16h8V88H72v8a8 8 0 0 1-16 0"
                  />
                </svg>
              )}
              <div className={`navbar-title${selectedIcon === "mentors" ? " selected-title" : ""}`}>Mentors</div>
            </div>

            {role === "Admin" && (
              <>
                {/* PROFILE REQUEST ICON */}
                {role === "Admin" && (
                  <div
                    className={`navbar-item ${selectedIcon === "profiles" ? "selected" : ""
                      }`}
                    onClick={() => {
                      navigate("/profileRequests");
                      handleItemClick("profiles");
                    }}
                  >
                    {selectedIcon === "profiles" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.2em"
                        height="1.2em"
                        viewBox="0 0 24 24"
                        id="profileRequests"
                        className="icon"
                      >
                        <path
                          fill="var(--nav-head-icons)"
                          d="M3 6.25v11.5A3.25 3.25 0 0 0 6.25 21h5.772a6.462 6.462 0 0 1-1.008-3.07C8.474 17.556 7 15.755 7 14v-.5A1.5 1.5 0 0 1 8.5 12h5.534a6.47 6.47 0 0 1 3.466-1a6.47 6.47 0 0 1 3.5 1.022V6.25A3.25 3.25 0 0 0 17.75 3H6.25A3.25 3.25 0 0 0 3 6.25m9-.75a2.75 2.75 0 1 1 0 5.5a2.75 2.75 0 0 1 0-5.5m11 12a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0m-2.146-2.354a.5.5 0 0 0-.708 0L16.5 18.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.2em"
                        height="1.2em"
                        viewBox="0 0 32 32"
                        id="profileRequests"
                        className="icon"
                      >
                        <path
                          fill="var(--nav-head-icons)"
                          d="M7.5 3A4.5 4.5 0 0 0 3 7.5v17A4.5 4.5 0 0 0 7.5 29h8.792a9.018 9.018 0 0 1-1.357-2H7.5A2.5 2.5 0 0 1 5 24.5v-17A2.5 2.5 0 0 1 7.5 5h17A2.5 2.5 0 0 1 27 7.5v7.435c.728.362 1.4.82 2 1.357V7.5A4.5 4.5 0 0 0 24.5 3zM14 23a8.983 8.983 0 0 1 3.343-7h-5.914A2.429 2.429 0 0 0 9 18.429c0 3.02 2.153 5.205 5.092 5.864A9.067 9.067 0 0 1 14 23m5.75-12.25a3.75 3.75 0 1 1-7.5 0a3.75 3.75 0 0 1 7.5 0M23 15.5a7.5 7.5 0 1 1 0 15a7.5 7.5 0 0 1 0-15m4.53 4.72a.75.75 0 0 0-1.06 0l-4.72 4.72l-1.97-1.97a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 0 0 0-1.06"
                        />
                      </svg>
                    )}
                    <div className={`navbar-title${selectedIcon === "profiles" ? " selected-title" : ""}`}>Profiles</div>
                  </div>
                )}

                {/* PITCHES ICON */}
                {role === "Admin" && (
                  <div
                    className={`navbar-item ${selectedIcon === "pitches" ? "selected" : ""
                      }`}
                    onClick={() => {
                      navigate("/pitches");
                      handleItemClick("pitches");
                    }}
                  >
                    {selectedIcon === "pitches" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        id="pitches"
                        width="1.2em"
                        height="1.2em"
                        className="icon"
                      >
                        <path
                          fill="var(--nav-head-icons)"
                          d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M7,15V17H9C9.14,18.55 9.8,19.94 10.81,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19A2,2 0 0,1 21,5V13.03C19.85,11.21 17.82,10 15.5,10C14.23,10 13.04,10.37 12.04,11H7V13H10C9.64,13.6 9.34,14.28 9.17,15H7M17,9V7H7V9H17Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        id="pitches"
                        width="1.2em"
                        height="1.2em"
                        className="icon"
                      >
                        <path
                          fill="var(--nav-head-icons)"
                          d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M5,3H19C20.11,3 21,3.89 21,5V13.03C20.5,12.23 19.81,11.54 19,11V5H5V19H9.5C9.81,19.75 10.26,20.42 10.81,21H5C3.89,21 3,20.11 3,19V5C3,3.89 3.89,3 5,3M7,7H17V9H7V7M7,11H12.03C11.23,11.5 10.54,12.19 10,13H7V11M7,15H9.17C9.06,15.5 9,16 9,16.5V17H7V15Z"
                        />
                      </svg>
                    )}
                    <div className={`navbar-title${selectedIcon === "pitches" ? " selected-title" : ""}`}>Pitches</div>
                  </div>
                )}

                {/* REPORTS ICON */}

                {role === "Admin" && (
                  <div
                    className={`navbar-item ${selectedIcon === "reports" ? "selected" : ""
                      }`}
                    onClick={() => {
                      navigate("/postReports");
                      handleItemClick("reports");
                    }}
                  >
                    {selectedIcon === "reports" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.2em"
                        height="1.2em"
                        viewBox="0 0 24 24"
                        id="postReports"
                        className="icon"
                      >
                        <path
                          fill="var(--nav-head-icons)"
                          d="M13 13h-2V7h2m-2 8h2v2h-2m4.73-14H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.2em"
                        height="1.2em"
                        viewBox="0 0 24 24"
                        id="postReports"
                        className="icon"
                      >
                        <path
                          fill="var(--nav-head-icons)"
                          d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m-1-4h2V7h-2zm-2.75 8L3 15.75v-7.5L8.25 3h7.5L21 8.25v7.5L15.75 21zm.85-2h5.8l4.1-4.1V9.1L14.9 5H9.1L5 9.1v5.8zm2.9-7"
                        />
                      </svg>
                    )}
                    <div className={`navbar-title${selectedIcon === "reports" ? " selected-title" : ""}`}>Reports</div>
                  </div>
                )}
              </>
            )}
           
          </>
       

        <div
          id="editProfile"
          style={{ position: "relative" }}
          onClick={() => {
            document
              .getElementsByClassName("userDetails")[0]
              .classList.toggle("showUserDetails");
          }}
        >
          {(image !== undefined && image !== "") ? <img
            id="Profile-img"
            className="Profile-img"
            src={image !== undefined && image !== "" ? image : "/profile.png"}
            alt=""
          /> : <NameGenerator userName={userName} sizes={{ height: '30px', width: '30px', fontSize: '12px' }} />}
        </div>
        <div className="userDetails" ref={userDetailsRef}>
          <span className="line-loader"></span>
          <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
            <div className="popupImg">
              {(image !== undefined && image !== "") ? <img
                style={{
                  borderRadius: "50%",
                  cursor: "pointer",
                  maxWidth: "100%",
                  height: '80px', width: '80px',
                  display: 'block'
                }}
                src={
                  image !== undefined && image !== "" ? image : "/profile.png"
                }
                alt="Profile"
              /> :<NameGenerator userName={userName} sizes={{height: '80px', width: '80px', fontSize: '26px'}}/>}
             
              <i
                className="fas fa-pencil-alt edit-icon"
                onClick={handleClickOpen}
              ></i>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', }}>
              <div className="Navusername">{userName}</div>
              <div className="Navemail">{email}</div>
              <div className="Navrole">{role}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={() => {
            // setLogoutPopupOpen(true)
            logoutDecider('All')
          }}>
            <button style={{ display: 'flex', alignItems: 'center' }}>
              <i
                className="fas fa-sign-out-alt"
                style={{ marginRight: "5px" }}
              ></i>{" "}
              Signout
            </button>
      
          </div>
        </div>

        <ProfileImageUpdate open={open} setOpen={setOpen} />

      </div>
    </div>
  );
};

export default Navbar;
