import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HealthForm() {
  const navigate = useNavigate();

  const defaultInput = {
    Age: 40,
    Sex: "Male",
    ChestPainType: "TA",
    RestingBP: 120,
    Cholesterol: 180,
    FastingBS: "0",
    RestingECG: "Normal",
    MaxHR: 150,
    ExerciseAngina: "No",
    Oldpeak: 0.0,
    ST_Slope: "Up",
  };

  const [formData, setFormData] = useState(defaultInput);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Prediction failed");

      const result = await response.json();
      const timestamp = new Date().toISOString();
      const riskCategory = result.prediction === 1 ? "High Risk" : "Low Risk";

      navigate("/analysis", {
        state: { result, input: formData, timestamp, riskCategory },
      });
    } catch (err) {
      console.error(err);
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectOptions = {
    Sex: ["Male", "Female"],
    ChestPainType: ["Typical Angina", "Atypical Angina", "Non-Anginal Pain", "Asymptomatic"],
    FastingBS: ["0 (No)", "1 (Yes)"],
    RestingECG: ["Normal", "ST Abnormality", "Left Ventricular Hypertrophy"],
    ExerciseAngina: ["No", "Yes"],
    ST_Slope: ["Up-sloping", "Flat", "Down-sloping"],
  };

  const labelMap = {
    Age: "Age (years)",
    Sex: "Sex",
    ChestPainType: "Type of Chest Pain",
    RestingBP: "Resting Blood Pressure (mm Hg)",
    Cholesterol: "Cholesterol (mg/dL)",
    FastingBS: "Fasting Blood Sugar > 120 mg/dL",
    RestingECG: "Resting ECG Results",
    MaxHR: "Maximum Heart Rate Achieved",
    ExerciseAngina: "Exercise-Induced Angina",
    Oldpeak: "Oldpeak (ST depression induced by exercise)",
    ST_Slope: "Slope of the Peak Exercise ST Segment",
  };

  return (
    <div className="analysis-container">
      <h2>Heart Health Risk Assessment</h2>
      <p>Please fill all fields for accurate risk prediction.</p>

      <form className="form-grid" onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <label key={key}>
            {labelMap[key] || key}
            {selectOptions[key] ? (
              <select name={key} value={value} onChange={handleChange}>
                {selectOptions[key].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                name={key}
                step={key === "Oldpeak" ? "0.1" : "1"}
                value={value}
                onChange={handleChange}
                required
              />
            )}
          </label>
        ))}

        <button type="submit" className="predict-button" disabled={loading}>
          {loading ? "Predicting..." : "Predict Risk"}
        </button>
      </form>
    </div>
  );
}
