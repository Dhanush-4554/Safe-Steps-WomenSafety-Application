from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from pydub import AudioSegment
import os
import requests
import speech_recognition as sr
import librosa

app = Flask(__name__)

# Load the trained model
model = load_model('help_detection_model.h5')

# Define the route for predictions
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file.filename.endswith('.wav'):
        try:
            # Save the file
            wav_path = os.path.join('uploads', file.filename)
            file.save(wav_path)

            # Preprocess the audio to extract features
            text, keyword_detected, avg_pitch, avg_energy = preprocess_audio(wav_path, keywords)

            # Get emotion probabilities using Hugging Face API
            try:
                emotion_response = get_emotion_probs(wav_path)
                print("Emotion API Response:", emotion_response)  # Debugging line
            except requests.RequestException as e:
                return jsonify({'error': 'Failed to get emotion probabilities from Hugging Face API', 'details': str(e)}), 500

            # Validate and process emotion response
            if isinstance(emotion_response, list) and len(emotion_response) > 0:
                emotion_probs = np.array([emotion['score'] for emotion in emotion_response], dtype=np.float32)
                emotion_probs = emotion_probs.reshape(1, -1)

                # Expand emotion_probs to 8 values if needed
                if emotion_probs.shape[1] < 8:
                    padding = np.zeros((1, 8 - emotion_probs.shape[1]), dtype=np.float32)
                    emotion_probs = np.concatenate([emotion_probs, padding], axis=1)
            else:
                return jsonify({'error': 'Invalid or empty response from Hugging Face API'}), 500

            # Prepare input data
            keyword_input = np.array([[int(keyword_detected)]], dtype=np.float32).tolist()
            pitch_input = np.array([[avg_pitch]], dtype=np.float32).tolist()
            energy_input = np.array([[avg_energy]], dtype=np.float32).tolist()
            emotion_probs = emotion_probs.astype(float).tolist()

            # Make a prediction if keyword is detected
            if keyword_detected:
                prediction = model.predict([np.array(keyword_input), np.array(pitch_input), np.array(energy_input), np.array(emotion_probs)])
                label = (prediction > 0.5).astype(int)[0][0]
                result = "Help" if label == 1 else "No Help"
            else:
                result = "No keyword detected. The audio indicates 'No Help'."

            # Clean up files
            os.remove(wav_path)

            return jsonify({
                'text': text,
                'keyword_detected': keyword_detected,
                'avg_pitch': float(avg_pitch),
                'avg_energy': float(avg_energy),
                'emotion_probs': emotion_probs,
                'result': result
            })

        except Exception as e:
            return jsonify({'error': 'An error occurred', 'details': str(e)}), 500

    return jsonify({'error': 'Invalid file format'}), 400

def preprocess_audio(audio_file_path, keywords):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file_path) as source:
        audio_data = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio_data)
        keyword_detected = detect_keywords(text, keywords)
    except sr.UnknownValueError:
        text = ""
        keyword_detected = False
    except sr.RequestError as e:
        print(f"Could not request results from Speech Recognition service; {e}")
        text = ""
        keyword_detected = False

    avg_pitch, avg_energy = analyze_pitch_and_volume(audio_file_path)

    return text, keyword_detected, avg_pitch, avg_energy

def detect_keywords(text, keywords):
    return any(keyword in text.lower() for keyword in keywords)

def analyze_pitch_and_volume(audio_path):
    y, sr = librosa.load(audio_path)

    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)

    pitch_values = []
    for i in range(pitches.shape[1]):
        pitch = pitches[:, i]
        pitch = pitch[pitch > 0]
        if len(pitch) > 0:
            pitch_values.append(np.mean(pitch))

    energy = np.sum(librosa.feature.rms(y=y))
    avg_pitch = np.mean(pitch_values) if pitch_values else 0
    avg_energy = energy / len(y)

    return avg_pitch, avg_energy

def get_emotion_probs(filename):
    API_URL = "https://api-inference.huggingface.co/models/ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"
    headers = {"Authorization": "Bearer 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"}

    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    
    # Print raw response for debugging
    print("Hugging Face API Response:", response.json())
    
    return response.json()

# Define keywords for detection
keywords = ["help", "emergency", "assist", "danger", "scream"]

if __name__ == '__main__':
    # Ensure the uploads directory exists
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    
    app.run(debug=True)
