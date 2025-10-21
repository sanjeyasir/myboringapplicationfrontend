import React from "react";
import headerIcon from './header_icon.png'; // make sure this path is correct

import { useNavigate } from "react-router-dom";

export default function Header({
  navOpen,
  username = "John Doe",
  profilePic = headerIcon, // <-- use the imported image directly
  onLogout,
  systemName = "Asset Management System"
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Show a confirmation alert
    if (window.confirm("You are logging out. Do you want to continue?")) {
      // Optional: call a logout function if provided
      if (onLogout) onLogout();

      // Navigate to home page
      navigate("/");
    }
  };
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "60px",
        background: "#f5f5f5",
        padding: "0 20px",
        fontFamily: "'Montserrat', sans-serif",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "margin-left 0.3s ease",
        marginLeft: navOpen ? "250px" : "60px",
        width: `calc(100% - ${navOpen ? "250px" : "60px"})`,
        position: "fixed",
        top: 0,
        zIndex: 900,
      }}
    >
      {/* System Name */}
      <span style={{ fontWeight: 600, fontSize: "17px", color: "#333", letterSpacing: "0.5px" }}>
        {systemName}
      </span>

      {/* User Section */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "10px", fontWeight: 500, color: "#333", fontSize: "13px" }}>
          {username}
        </span>
        <img
          src={profilePic} // <-- now correctly using the image
          alt="profile"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "15px",
            border: "1px solid #ccc"
          }}
        />
       <button
          onClick={handleLogout}
          style={{
            background: "#e53e3e",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: 500,
            fontFamily: "'Montserrat', sans-serif",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#c53030")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#e53e3e")}
        >
          Logout
        </button>
      </div>
    </header>
  );
}


