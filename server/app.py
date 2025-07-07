from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from tensorflow.keras.models import load_model
from utils import format_input  # 👈 helper for formatting input

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Load model and preprocessor
model = load_model("model/nn_model.keras")
preprocessor = joblib.load("model/preprocessor.pkl")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON input from client
        data = request.get_json()

        # Format input into a DataFrame
        df = format_input(data)

        # Preprocess input
        X = preprocessor.transform(df)

        # Predict using the neural network
        prob = model.predict(X)[0][0]
        prediction = int(prob > 0.5)

        # Return prediction result
        return jsonify({
            "prediction": prediction,
            "confidence": round(float(prob), 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5050)
