from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image, UnidentifiedImageError
from dotenv import load_dotenv
import tensorflow as tf
import numpy as np
import logging
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Setup CORS to allow requests from specified origins
origins = [
    "http://localhost",
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the pre-trained model and its classes
MODEL_PATH = os.getenv("LUNG_MODEL")
MODEL_CLASSES = ["Lung Squamous Cell Carcinoma", "Lung Adenocarcinoma", "Lung_Normal"]

# Initialize logger
logging.basicConfig(level=logging.INFO)

# Load the model
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    logging.info(f"Successfully loaded model from {MODEL_PATH}")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    raise RuntimeError("Failed to load the model.")

# Define endpoint for checking server status
@app.get("/ping")
async def ping():
    return "Hello, I am alive"

# Function to read uploaded file as an image
def read_file_as_image(data: bytes) -> np.ndarray:
    return np.array(Image.open(BytesIO(data)))

# Function to validate if an image is likely a histopathology image
def is_histopathology_image(image: Image.Image) -> bool:
    # Placeholder logic: check dimensions and color patterns
    width, height = image.size
    if width < 100 or height < 100:
        return False
    dominant_color = np.array(image).mean(axis=(0, 1))  # Average RGB color
    # Example threshold to differentiate: Adjust based on real data
    if dominant_color[0] > 200 and dominant_color[1] > 200 and dominant_color[2] > 200:
        return False  # Likely not histopathological
    return True

# Define endpoint for making predictions
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Check if the uploaded file is an image
    if not file.content_type.startswith('image'):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
    
    try:
        # Read the file as an image
        image = Image.open(BytesIO(await file.read()))
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")
    
    try:
        # Validate if the image is a histopathology image
        if not is_histopathology_image(image):
            return {
                'class': "Invalid Image",
                'confidence': 0.0
            }

        # Preprocess the image
        image = image.resize((224, 224))
        image_array = np.array(image) / 255.0
        img_batch = np.expand_dims(image_array, axis=0)

        # Make predictions
        predictions = model.predict(img_batch)
        predicted_class_idx = np.argmax(predictions[0])
        predicted_class = MODEL_CLASSES[predicted_class_idx]
        confidence = float(predictions[0][predicted_class_idx])

        return {
            'class': predicted_class,
            'confidence': confidence
        }
    except Exception as e:
        logging.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")

# Run the FastAPI app with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='localhost', port=8000)