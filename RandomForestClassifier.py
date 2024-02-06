from flask import Flask, request, jsonify
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import numpy as np

# Load the Iris dataset
data = load_iris()
X = data.data
X=X[:,:2]
y = data.target

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Instantiate the Random Forest classifier
rf_classifier = RandomForestClassifier()

# Fit the classifier to the training data
rf_classifier.fit(X_train, y_train)

# Calculate the accuracy of the model on the test set
y_pred = rf_classifier.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

# Initialize Flask app
app = Flask(__name__)

# Define standardized API response format function
def create_response(prediction, class_name, accuracy, success=True, message="Prediction successful"):
    response = {
        "success": success,
        "message": message,
        "data": {
            "prediction": prediction,
            "class": class_name,
            "accuracy": accuracy
        }
    }
    return response

# Define route for prediction
@app.route('/predict', methods=['GET'])
def predict():
    # Get query parameters
    sepal_length = float(request.args.get('sepal_length'))
    sepal_width = float(request.args.get('sepal_width'))
    
    
    # Make prediction
# Faites une prédiction en utilisant un tableau 2D
    prediction = int(rf_classifier.predict([[sepal_length, sepal_width]])[0])
    class_name = data.target_names[prediction]
    
    # Create standardized API response format
    response = response = {
        'predicted_species': class_name
    }
    
    return jsonify(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
