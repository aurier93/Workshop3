import requests
from collections import Counter
# List of URLs for each model's API
model_urls = [
    'https://4630-2a0d-e487-58f-e8be-c0e7-75a1-5487-7187.ngrok-free.app/predict?sepal_length=3.1&sepal_width=2.5',
    'https://89a8-82-125-134-40.ngrok-free.app/predict?sepal_length=3.1&sepal_width=2.5',
    'https://a7dd-2a01-e34-ec61-b610-f001-3387-f642-be03.ngrok-free.app/predict?sepal_length=3.1&sepal_width=2.5',
    
]

# Function to collect predictions from each model's API
def collect_predictions():
    predictions = []
    for url in model_urls:
        try:
            response = requests.get(url)
            if response.status_code == 200:
                prediction = response.json()['predicted_species']
                predictions.append(prediction)
        except Exception as e:
            print(f"Error accessing model at {url}: {e}")
    
    return predictions

# Function to calculate consensus prediction by averaging predictions
def calculate_consensus(predictions):
    consensus_prediction = None
    if predictions:
        num_models = len(predictions)
        species_counts = Counter(predictions)
        max_count = max(species_counts.values())
        consensus_prediction = [species for species, count in species_counts.items() if count == max_count][0]
    
    return consensus_prediction, species_counts

# Collect predictions from all models
predictions = collect_predictions()

# Calculate consensus prediction and species counts
consensus_prediction, species_counts = calculate_consensus(predictions)

print("Consensus Prediction:", consensus_prediction)
print("Species Counts:", species_counts)
