import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import requests
import speech_recognition as sr
import librosa
from pydub import AudioSegment  # Import pydub for audio conversion
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Load the trained model
try:
    model = load_model('help_detection_model.h5')
    logger.info('Model loaded successfully.')
except Exception as e:
    logger.error(f'Error loading model: {str(e)}')
    raise

@app.route('/', methods=['GET'])
def home():
    logger.info('Home route accessed.')
    return jsonify({'message': 'Flask server is running!'})

@app.route('/predict', methods=['POST'])
def predict():
    logger.info('Predict route hit.')

    if 'file' not in request.files:
        logger.error('No file part in the request.')
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        logger.error('No selected file.')
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Save the file (either .3gp or .wav)
        original_file_path = os.path.join('uploads', file.filename)
        file.save(original_file_path)
        logger.info(f'File saved at {original_file_path}')

        audio_format = original_file_path.split('.')[-1]  # Extract format from filename

        # Log details
        logger.info(f'Format={audio_format}')


        # Convert .3gp to .wav if needed
        if file.filename.endswith('.3gp'):
            logger.info('Converting .3gp file to .wav format')
            audio = AudioSegment.from_file(original_file_path, format='3gp')
            wav_file_path = original_file_path.replace('.3gp', '.wav')
            audio.export(wav_file_path, format='wav')
            logger.info(f'File converted and saved at {wav_file_path}')
        else:
            wav_file_path = original_file_path


        # Preprocess the audio to extract features
        text, keyword_detected, avg_pitch, avg_energy = preprocess_audio(wav_file_path, keywords)
        logger.info(f'Audio processed: Text="{text}", Keyword Detected={keyword_detected}, Avg Pitch={avg_pitch}, Avg Energy={avg_energy}')

        # Get emotion probabilities using Hugging Face API
        try:
            emotion_response = get_emotion_probs(wav_file_path)
            logger.info(f'Emotion API Response: {emotion_response}')
        except requests.RequestException as e:
            logger.error(f'Failed to get emotion probabilities from Hugging Face API: {str(e)}')
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
            logger.error('Invalid or empty response from Hugging Face API.')
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
            logger.info(f'Prediction result: {result}')
        else:
            result = "No keyword detected. The audio indicates 'No Help'."
            logger.info(f'No keyword detected. Result: {result}')

        # Clean up files
        os.remove(original_file_path)
        if original_file_path != wav_file_path:
            os.remove(wav_file_path)
        logger.info('File cleaned up.')

        return jsonify({
            'text': text,
            'keyword_detected': keyword_detected,
            'avg_pitch': float(avg_pitch),
            'avg_energy': float(avg_energy),
            'emotion_probs': emotion_probs,
            'result': result
        })
    

    except Exception as e:
        logger.error(f'An error occurred during processing: {str(e)}')
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500

    logger.error('Invalid file format.')
    return jsonify({'error': 'Invalid file format'}), 400

def preprocess_audio(audio_file_path, keywords):
    logger.info(f'Preprocessing audio file: {audio_file_path}')
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file_path) as source:
        audio_data = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio_data)
        keyword_detected = detect_keywords(text, keywords)
        logger.info(f'Speech Recognition result: "{text}", Keyword detected: {keyword_detected}')
    except sr.UnknownValueError:
        text = ""
        keyword_detected = False
        logger.warning('Speech Recognition could not understand the audio.')
    except sr.RequestError as e:
        text = ""
        keyword_detected = False
        logger.error(f'Could not request results from Speech Recognition service: {e}')

    avg_pitch, avg_energy = analyze_pitch_and_volume(audio_file_path)
    logger.info(f'Audio analysis: Avg Pitch={avg_pitch}, Avg Energy={avg_energy}')

    return text, keyword_detected, avg_pitch, avg_energy

def detect_keywords(text, keywords):
    return any(keyword in text.lower() for keyword in keywords)

def analyze_pitch_and_volume(audio_path):
    logger.info(f'Analyzing pitch and volume of audio file: {audio_path}')
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
    logger.info(f'Getting emotion probabilities for file: {filename}')
    API_URL = "https://api-inference.huggingface.co/models/ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"
    headers = {"Authorization": "Bearer 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"}

    with open(filename, "rb") as f:
        data = f.read()
    try:
        response = requests.post(API_URL, headers=headers, data=data)
        response.raise_for_status()
        logger.info(f'Hugging Face API response: {response.json()}')
        return response.json()
    except requests.RequestException as e:
        logger.error(f'Error during Hugging Face API request: {str(e)}')
        raise

# Define an extensive list of keywords and phrases for help detection
keywords = [
    "help", "emergency", "assist", "danger", "scream", "rescue", "save me", "trouble", "call 911",
    "need help", "need assistance", "I'm in danger", "can't breathe", "can't move", "someone help",
    "help me", "get me out", "I'm trapped", "I'm hurt", "I'm injured", "can't escape", 
    "please help", "come quickly", "I'm in trouble", "call for help", "it's an emergency", 
    "I'm scared", "something's wrong", "get help", "I'm lost", "lost", "where am I", 
    "find me", "I'm bleeding", "need medical help", "send help", "is anyone there", "is anyone around",
    "can someone hear me", "help needed", "urgent help", "can’t find my way", "I need help", 
    "please assist", "there's a problem", "immediate help", "get the police", "get the doctor", 
    "send an ambulance", "urgent", "come quickly", "it's urgent", "get me out of here", 
    "I'm stuck", "I'm being followed", "I'm being attacked", "dangerous situation", "emergency situation",
    "can't see", "can't hear", "I'm blind", "I'm deaf", "can't feel my legs", "I'm scared", 
    "I need help immediately", "something's wrong", "help now", "please come", "it's a life or death situation",
    "I think I'm in danger", "emergency help needed", "I'm in serious trouble", "immediate assistance required"
]

if __name__ == '__main__':
    # Ensure the uploads directory exists
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    
    app.run(host='0.0.0.0', port=5000)
