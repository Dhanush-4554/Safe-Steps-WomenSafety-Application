import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import speech_recognition as sr
import librosa
from pydub import AudioSegment
import requests
import logging
import time

# Configure logging
logger = logging.getLogger(__name__)

# Load the trained model
try:
    model = load_model('help_detection_model_improved.h5')
except Exception as e:
    logger.error(f'Error loading model: {str(e)}')
    raise

def preprocess_audio(audio_file_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file_path) as source:
        audio_data = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio_data)
        keyword_detected = detect_keywords(text)
    except sr.UnknownValueError:
        text = ""
        keyword_detected = False
    except sr.RequestError as e:
        text = ""
        keyword_detected = False

    avg_pitch, avg_energy = analyze_pitch_and_volume(audio_file_path)
    return text, keyword_detected, avg_pitch, avg_energy

def detect_keywords(text):
    return any(keyword in text.lower() for keyword in keywords)

def analyze_pitch_and_volume(audio_path):
    print("Analyzing .. !")
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

max_retries = 3
wait_time = 10

def get_emotion_probs(filename):
    print("API request sent ... !")
    API_URL = "https://api-inference.huggingface.co/models/ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"
    headers = {"Authorization": "Bearer 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"}

    with open(filename, "rb") as f:
        data = f.read()

    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, headers=headers, data=data)
            if response.status_code == 503:
                # Model is still loading
                print(f"Model is loading. Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                response.raise_for_status()
                print(response.json())
                return response.json()
        except requests.RequestException as e:
            logger.error(f'Error during Hugging Face API request: {str(e)}')
            if attempt < max_retries - 1:
                print(f"Retrying ({attempt + 1}/{max_retries})...")
                time.sleep(wait_time)
            else:
                raise

def predict_help(keyword_input, pitch_input, energy_input, emotion_probs):
    prediction = model.predict([keyword_input, pitch_input, energy_input, emotion_probs])
    label = (prediction > 0.5).astype(int)[0][0]
    result = "Help" if label == 1 else "No Help"
    return result

# Define an extensive list of keywords and phrases for help detection
keywords = [
    "help", "emergency", "assist", "danger", "scream", "rescue", "save me", "trouble", "call 911",
    "need help", "need assistance", "I'm in danger", "can't breathe", "can't move", "someone help",
    "help me", "get me out", "I'm trapped", "I'm hurt", "I'm injured", "can't escape", 
    "please help", "come quickly", "I'm in trouble", "call for help", "it's an emergency", 
    "I'm scared", "something's wrong", "get help", "I'm lost", "lost", "where am I", 
    "find me", "I'm bleeding", "need medical help", "send help", "is anyone there", "is anyone around",
    "can someone hear me", "help needed", "urgent help", "can't find my way", "I need help", 
    "please assist", "there's a problem", "immediate help", "get the police", "get the doctor", 
    "send an ambulance", "urgent", "come quickly", "it's urgent", "get me out of here", 
    "I'm stuck", "I'm being followed", "I'm being attacked", "dangerous situation", "emergency situation",
    "can't see", "can't hear", "I'm blind", "I'm deaf", "can't feel my legs", "I'm scared", 
    "I need help immediately", "something's wrong", "help now", "please come", "it's a life or death situation",
    "I think I'm in danger", "emergency help needed", "I'm in serious trouble", "immediate assistance required"
]
