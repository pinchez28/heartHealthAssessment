import React from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <header className="navbar healthcare-navbar">
      <div className="logo-container">
        <img src={logo} alt="HeartCare Logo" className="logo" />
      </div>
      <h1 className="title">Heart Health Advisor</h1>
    </header>
  );
}
