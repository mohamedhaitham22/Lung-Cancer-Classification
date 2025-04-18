
# 🧬 Lung Histopathology Image Preprocessing Pipeline

This Jupyter Notebook provides a full preprocessing pipeline for lung histopathology images from the **"Lung and Colon Cancer Histopathological Images"** dataset (available on Kaggle). The goal is to prepare high-quality, normalized, and segmented image patches for training deep learning models in cancer classification.

---

## 📦 Dataset Structure

The dataset contains 3 classes stored in subfolders:

- `lung_aca` → Lung adenocarcinoma  
- `lung_n` → Normal lung tissue  
- `lung_scc` → Squamous cell carcinoma  

Each folder contains histopathological images with varying colors and resolutions.

---

## 🔧 Preprocessing Steps

1. **Image Loading**
   - All images are loaded from the specified folder structure.
   - Images are converted from BGR to RGB using OpenCV.

2. **Image Resizing**
   - Images are resized to a fixed shape: **224 × 224** using `cv2.INTER_LANCZOS4` interpolation.
   - You can change the size to (256, 256) if required by your model.

3. **Reinhard Color Normalization**
   - Each image is normalized based on the LAB color space using pre-computed class-wise mean and standard deviation values.
   - This reduces stain variation and improves model robustness.

4. **Min-Max Normalization**
   - Scales image pixel values to a range of `[0, 1]` using Min-Max normalization.

5. **Watershed Segmentation**
   - Applies Watershed algorithm on the normalized images to highlight tissue boundaries.
   - Includes thresholding, distance transform, and morphological operations for clear segmentation.
   - Boundary lines are drawn in red.

6. **Saving Processed Images**
   - Each segmented image is saved as a `.png` file in a new folder `data_after_prerocessing/` with subfolders for each class.

---

## 🧰 Libraries Used

- `cv2` (OpenCV)  
- `numpy`  
- `pandas`  
- `glob`  
- `sklearn.preprocessing.StandardScaler`  

---

## 📁 Output

- Preprocessed and segmented images saved to:
  ```
  /kaggle/working/data_after_prerocessing/
      ├── lung_aca/
      ├── lung_n/
      └── lung_scc/
  ```

---

## 🚀 How to Use

1. Download the dataset from Kaggle and adjust the `data_path` if needed.
2. Run the entire notebook in order.
3. Find the final preprocessed images in the output directory.
4. Use the output images for training classification models (CNN, EfficientNet, etc.).

---

## 🧠 Author

Developed by **Mohamed Haitham**, a student of AI and Bioinformatics.
