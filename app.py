from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import os
import cv2

app = Flask(__name__)

# Ensure the 'uploads' directory exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

# Function to perform image segmentation (using simple thresholding as an example)
def segment_image(image_path):
    # Open image using Pillow
    image = Image.open(image_path)
    image = image.convert("RGB")
    
    # Convert to numpy array for processing (using OpenCV)
    img_array = np.array(image)

    # Convert to grayscale for segmentation
    gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)

    # Simple thresholding for segmentation (you can replace this with a more complex model)
    _, segmented = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

    # Save the original and segmented images
    original_image_path = os.path.join('uploads', 'original.jpg')
    segmented_image_path = os.path.join('uploads', 'segmented.jpg')

    # Save original and segmented images
    image.save(original_image_path)
    cv2.imwrite(segmented_image_path, segmented)

    return original_image_path, segmented_image_path

@app.route('/segment_image', methods=['POST'])
def segment_image_route():
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image file provided"}), 400

    image_file = request.files['image']
    image_path = os.path.join('uploads', image_file.filename)
    
    # Save the uploaded image
    image_file.save(image_path)
    
    # Perform segmentation
    original_image_path, segmented_image_path = segment_image(image_path)

    # Return the URLs for the original and segmented images
    return jsonify({
        "success": True,
        "original_image_url": f"/{original_image_path}",
        "segmented_image_url": f"/{segmented_image_path}"
    })

if __name__ == '__main__':
    app.run(debug=True)
