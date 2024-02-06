from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

# Load the iris dataset
iris = load_iris()

X = iris.data
X=X[:,:2]
y = iris.target


# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train the decision tree classification model
model = DecisionTreeClassifier(max_depth=1,max_leaf_nodes=2,max_features=1)
model.fit(X_train, y_train)

# Calculate the accuracy score
accuracy = accuracy_score(y_test, model.predict(X_test))

# Initialize Flask app
app = Flask(__name__)

# Define prediction route
@app.route('/predict', methods=['GET'])
def predict():
    # Extract model arguments from query parameters
    sepal_length = request.args.get('sepal_length', type=float)
    sepal_width = request.args.get('sepal_width', type=float)

    
    # Make prediction based on provided parameters
    prediction = model.predict([[sepal_length, sepal_width]])
    
    # Convert numeric prediction to species label
    species_labels = ['setosa', 'versicolor', 'virginica']
    predicted_species = species_labels[int(prediction[0])]
    
    return jsonify({'predicted_species': predicted_species, 'accuracy': accuracy})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
