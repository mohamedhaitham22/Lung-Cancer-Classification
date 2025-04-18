
# 🫁 Lung Cancer Classification from Histopathological Images using Deep Learning

## 📄 Abstract

Lung cancer remains one of the leading causes of cancer-related deaths globally, highlighting the importance of early and accurate diagnosis. This project leverages **deep learning** techniques to classify histopathological lung tissue images into the following categories:

- **Lung Adenocarcinoma**
- **Normal Lung Tissue**
- **Lung Squamous Cell Carcinoma**

---

## 🧪 Lung Histopathology Image Preprocessing Pipeline

This Jupyter Notebook provides a comprehensive preprocessing pipeline for the **"Lung and Colon Cancer Histopathological Images"** dataset (available on Kaggle). The pipeline prepares high-quality, normalized, and segmented image patches for deep learning models.

---

## 📦 Dataset Structure

The dataset is organized into three class-specific folders:

```
lung_aca/    → Lung Adenocarcinoma  
lung_n/      → Normal Lung Tissue  
lung_scc/    → Lung Squamous Cell Carcinoma
```

Each folder contains histopathological images with diverse staining and resolution characteristics.

---

## 🔧 Preprocessing Steps

### 1. Image Loading
- Loads all images from the specified directory.
- Converts images from **BGR to RGB** using OpenCV.

### 2. Image Resizing
- Resizes all images to **224 × 224** pixels using `cv2.INTER_LANCZOS4`.
- (Optional) You may change the target size (e.g., to `256 × 256`) depending on the model.

### 3. Reinhard Color Normalization
- Normalizes each image in **LAB color space**.
- Uses class-wise mean and standard deviation.
- Minimizes stain variability to improve model generalization.

### 4. Min-Max Normalization
- Scales all pixel values to the **[0, 1]** range.

### 5. Watershed Segmentation
- Enhances tissue boundaries using the **Watershed algorithm**.
- Applies thresholding, distance transformation, and morphological operations.
- Highlights segmented regions with red boundary lines.

### 6. Saving Processed Images
- Saves each processed image as a `.png` in the following structure:

```
data_after_prerocessing/
├── lung_aca/
├── lung_n/
└── lung_scc/
```

---

## 🧰 Libraries Used

- `opencv-python` (`cv2`)
- `numpy`
- `pandas`
- `glob`
- `sklearn.preprocessing.StandardScaler`

---

## 🚀 How to Use

1. Download the dataset from Kaggle.
2. Update the `data_path` variable in the notebook if necessary.
3. Run the notebook cells sequentially.
4. Locate the processed images in the `data_after_prerocessing/` folder.
5. Use these images to train classification models (e.g., **CNNs**, **EfficientNet**).

---

## 🌐 Deployment

- **Frontend**: React, JavaScript, HTML, CSS  
- **Backend**: FastAPI, Python  

---

## 📜 License

This project is licensed under the **MIT License**.  
You may use, modify, and distribute it for academic and non-commercial purposes.

---

## 🙌 Acknowledgements

- **Dataset**: [Lung and Colon Cancer Histopathological Images – Kaggle](https://www.kaggle.com/)
- **Models Used**: VGG16,EfficientNetB3
