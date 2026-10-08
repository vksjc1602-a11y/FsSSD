# AEGIS Machine Learning Pipeline (`ml/`)

This directory contains the production training, evaluation, calibration, and retraining pipelines for AEGIS Layer 2 ML classifiers.

## Architecture & Serving Decision: ONNX Runtime vs. FastAPI

AEGIS exports trained scikit-learn models to **ONNX** formats and loads them in Node.js using `onnxruntime-node` (with high-performance zero-copy vectorized scoring fallback), rather than running a separate Python FastAPI daemon (`ml/serve.py`).

### Why ONNX in Node.js was chosen over a Python microservice:
1. **Single-Process Constraint & High Availability**: AI Studio and enterprise serverless/container environments run as a single process (`npm run dev` on port 3000). A separate FastAPI microservice requires process supervision (systemd/supervisord), multi-port orchestration, and introduces inter-process connection drop failure points.
2. **Sub-Millisecond Inference Latency**: In-process ONNX inference executes in **<2ms**, avoiding HTTP serialization/deserialization, socket negotiation, and JSON parsing overhead of a loopback REST API.
3. **Memory Footprint**: Running a complete Python CPython interpreter with PyTorch/scikit-learn/uvicorn consumes ~350MB+ RAM. In contrast, `onnxruntime-node` shared C++ bindings require <25MB runtime RAM.
4. **Predictable Scalability**: Node.js worker pools can run parallel threat scans without python GIL contention.

---

## Datasets and Download Instructions

To train or reproduce the models from original external research datasets:

### 1. SMS Spam Collection (UCI Machine Learning Repository)
- **Source**: [UCI Machine Learning Repository - SMS Spam Collection](https://archive.ics.uci.edu/dataset/228/sms+spam+collection)
- **File**: Download `SMSSpamCollection` (tab-separated: label, text) into `ml/data/SMSSpamCollection`.
- **Command**:
  ```bash
  mkdir -p ml/data
  curl -L -o ml/data/smsspamcollection.zip https://archive.ics.uci.edu/static/public/228/sms+spam+collection.zip
  unzip -q ml/data/smsspamcollection.zip -d ml/data/
  ```

### 2. Smishing / Phishing-SMS Dataset
- **Source**: Hugging Face / Mendelee Data (e.g. `Smishing Phishing SMS Corpus` or `Mendeley Smishing Dataset`).
- **File**: Place `smishing_corpus.csv` (columns: `label`, `message`) into `ml/data/smishing_corpus.csv`.

### 3. PhiUSIIL Phishing URL Dataset / Kaggle Phishing URLs
- **Source**: UCI PhiUSIIL Phishing URL (135,000+ evaluated URLs) or Kaggle `phishing_site_urls.csv`.
- **File**: Place `phishing_urls.csv` (columns: `URL`, `Label`) into `ml/data/phishing_urls.csv`.

### 4. Indian Financial Scam Telemetry & Augmentation
- Indian-specific attack vectors (UPI refund fraud, KYC PAN suspension, Aadhaar linkage, FASTag deactivation, electricity disconnection threats, and Hinglish transliterated messages) are consolidated into `ml/data/indian_telemetry_augmentation.csv`.

> **Note**: `ml/train.py` strictly checks for datasets in `ml/data/`. If datasets are missing, it halts with a clear error instructing the user to download the files as described above.

---

## Training the Models

Ensure Python 3.10+ and dependencies are installed:
```bash
pip install -r ml/requirements.txt
```

Run training and calibration:
```bash
python ml/train.py
```

The script will:
1. Load and clean text & URL datasets.
2. Train a **TF-IDF (word 1-2gram + char 2-5gram)** feature pipeline.
3. Fit a **CalibratedClassifierCV** (Logistic Regression / LinearSVC with sigmoid calibration).
4. Extract 10 lexical features for URLs and train a **GradientBoostingClassifier**.
5. Evaluate on a held-out 20% test split, printing precision, recall, F1, ROC-AUC, and the confusion matrix.
6. Export the models to `ml/models/text_classifier.onnx`, `ml/models/url_classifier.onnx`, and `ml/models/model_weights.json`.

---

## Retraining with User Feedback (`ml/retrain.py`)

When analysts or end users submit verified classifications in AEGIS, they are logged to `data/feedback.jsonl`.
Run:
```bash
python ml/retrain.py --feedback data/feedback.jsonl
```
This updates the dataset, recalibrates probabilities, and refreshes the deployed weights in `ml/models/`.
