import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HealthForm from "./pages/HealthForm";
import AnalysisPage from "./pages/AnalysisPage";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HealthForm />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
