import pandas as pd


def format_input(data: dict) -> pd.DataFrame:
    """
    Validates and converts incoming JSON data into a Pandas DataFrame.
    Raises an error if required fields are missing.
    """
    expected_fields = [
        "Age", "Sex", "ChestPainType", "RestingBP", "Cholesterol",
        "FastingBS", "RestingECG", "MaxHR", "ExerciseAngina",
        "Oldpeak", "ST_Slope"
    ]

    # Check all expected fields are present
    for field in expected_fields:
        if field not in data:
            raise ValueError(f"Missing field: {field}")

    # Convert to DataFrame
    df = pd.DataFrame([data])
    return df
