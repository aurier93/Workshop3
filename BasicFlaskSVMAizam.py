from flask import Flask, request, jsonify,render_template
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

app = Flask(__name__)

# Load the Iris dataset
iris = load_iris()
X = iris.data[:,:2]  # Features
y = iris.target  # Target variable

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Initialize the SVM classifier
svm_classifier = SVC(kernel='poly')

# Train the SVM classifier
svm_classifier.fit(X_train, y_train)

# Make predictions on the testing set
y_pred = svm_classifier.predict(X_test)

# Calculate the accuracy of the model
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)

#Define home route
@app.route('/')
def home():
    s = f'''Base route of the API\n
        Model accuracy on test : {accuracy}\n
        To test prediction on personalized data, use this url template:\n
        http://localhost:5000/predict?sepal_length=5.1&sepal_width=3.5
        with sl : sepal length ; sw : sepal width
             pl : petal length ; pw : petal width
        '''
    return s

# Define a route for prediction
@app.route('/predict', methods=['GET'])
def predict():
    # Get request arguments
    sepal_length = request.args.get('sepal_length', type=float)
    sepal_width = request.args.get('sepal_width', type=float)
    #petal_length = request.args.get('petal_length', type=float)
    #petal_width = request.args.get('petal_width', type=float)

    # Make prediction using the SVM classifier
    prediction = svm_classifier.predict([[sepal_length, sepal_width]])

    # Map numerical prediction to class label
    species_labels = ['setosa', 'versicolor', 'virginica']
    predicted_species = species_labels[int(prediction[0])]

    # Prepare API response
    response = {
        'predicted_species': predicted_species
    }

    return jsonify(response)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)