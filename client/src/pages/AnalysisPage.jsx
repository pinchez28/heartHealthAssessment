import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label
} from "recharts";


export default function AnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, input, timestamp, riskCategory } = location.state || {};

  if (!result || !input) {
    return (
      <div className="no-result">
        <p>No prediction data found.</p>
        <button onClick={() => navigate("/")}>🔙 Back to Form</button>
      </div>
    );
  }

  const isAtRisk = result.prediction === 1;
  const confidence = (result.confidence * 100).toFixed(2);

  // Dynamically extract and normalize abnormal factors
  const abnormalFactors = [];
  if (input.Age > 65) abnormalFactors.push({ factor: "Age > 65", riskIndex: input.Age });
  if (input.RestingBP > 130) abnormalFactors.push({ factor: "RestingBP > 130", riskIndex: input.RestingBP });
  if (input.Cholesterol > 200) abnormalFactors.push({ factor: "Cholesterol > 200", riskIndex: input.Cholesterol });
  if (input.FastingBS === 1) abnormalFactors.push({ factor: "FastingBS > 120", riskIndex: 120 });
  if (input.Oldpeak >= 2) abnormalFactors.push({ factor: "Oldpeak ≥ 2", riskIndex: input.Oldpeak * 50 }); // scaled
  if (input.ExerciseAngina === "Yes") abnormalFactors.push({ factor: "Exercise Angina", riskIndex: 100 });

  return (
    <div className={`analysis-container ${isAtRisk ? "risk" : "safe"}`}>
      <h2>{isAtRisk ? "High Risk Detected!" : "You're Likely Safe!"}</h2>

      <div className="meta-info">
        <p><strong>Prediction Time:</strong> {new Date(timestamp).toLocaleString()}</p>
        <p><strong>Risk Category:</strong> {riskCategory}</p>
        <p className="confidence">
          Confidence Score: <span>{confidence}%</span>
        </p>
      </div>
    <div className="advice-box">
        <h3>Professional Advice</h3>
        {isAtRisk ? (
            <p>
            <li>Recommend immediate cardiology referral for further diagnostic testing.</li>
            <li>Encourage lifestyle interventions: reduce salt, quit smoking, and manage stress.</li>
            <li>Monitor key vitals regularly (BP, cholesterol, blood sugar).</li>
            </p>
        ) : (
            <p>
            <li>Continue regular checkups and maintain healthy lifestyle.</li>
            <li>Keep a heart-healthy diet (low in saturated fats and cholesterol).</li>
            <li>Encourage continued physical activity and mental wellness.</li>
            </p>
        )}
    </div>


      {isAtRisk && (
        <div className="chart-wrapper">
          <h3>Key Contributing Factors</h3>
          {abnormalFactors.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(200, 60 * abnormalFactors.length)}>
              <LineChart
                data={abnormalFactors}
                margin={{ top: 20, right: 40, left: 30, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis
                  dataKey="factor"
                  tick={{ fontSize: 13 }}
                >
                  <Label value="Factor" position="insideBottom" offset={-5} />
                </XAxis>
                <YAxis
                  type="number"
                  domain={[0, "dataMax + 20"]}
                  tick={{ fontSize: 13 }}
                >
                  <Label value="Risk Index" angle={-90} position="insideLeft" />
                </YAxis>
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="riskIndex"
                  stroke="#e63946"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#e63946" }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ marginTop: "1rem", color: "#777" }}>
              No abnormal factors identified.
            </p>
          )}
        </div>
      )}

      <button className="back-btn" onClick={() => navigate("/")}>
        Predict Again
      </button>
    </div>
  );
}
