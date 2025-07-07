import React from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <header className="navbar">
      <img src={logo} alt="HeartCare Logo" className="logo" />
      <h1 className="title">Heart Health</h1>
    </header>
  );
}
