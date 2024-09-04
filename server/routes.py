import os
from flask import request, jsonify
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse
from ml_model import preprocess_audio, get_emotion_probs, predict_help
import logging
import numpy as np

# Configure logging
logger = logging.getLogger(__name__)

# Twilio credentials
account_sid = "AC7f41acdba81736c349ab2a60622b97a4"
auth_token = "fc69f0823f5a7a4d031a48c6d9ab4440"
client = Client(account_sid, auth_token)

def create_routes(app):

    @app.route('/', methods=['GET'])
    def home():
        return jsonify({'message': 'Flask server is running!'})

    @app.route('/send-call', methods=['POST'])
    def send_call_endpoint():
        try:
            send_call()
            return jsonify({'message': 'Call initiated successfully.'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/send-sms', methods=['POST'])
    def send_sms_endpoint():
        try:
            send_sms()
            return jsonify({'message': 'SMS sent successfully.'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/predict', methods=['POST'])
    def predict():
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        try:
            original_file_path = os.path.join('uploads', file.filename)
            file.save(original_file_path)

            audio_format = original_file_path.split('.')[-1]
            if file.filename.endswith('.3gp'):
                audio = AudioSegment.from_file(original_file_path, format='3gp')
                wav_file_path = original_file_path.replace('.3gp', '.wav')
                audio.export(wav_file_path, format='wav')
            else:
                wav_file_path = original_file_path

            text, keyword_detected, avg_pitch, avg_energy = preprocess_audio(wav_file_path)
            emotion_response = get_emotion_probs(wav_file_path)

            if isinstance(emotion_response, list) and len(emotion_response) > 0:
                emotion_probs = np.array([emotion['score'] for emotion in emotion_response], dtype=np.float32)
                emotion_probs = emotion_probs.reshape(1, -1)

                if emotion_probs.shape[1] < 8:
                    padding = np.zeros((1, 8 - emotion_probs.shape[1]), dtype=np.float32)
                    emotion_probs = np.concatenate([emotion_probs, padding], axis=1)
            else:
                return jsonify({'error': 'Invalid or empty response from Hugging Face API'}), 500

            keyword_input = np.array([[int(keyword_detected)]], dtype=np.float32)
            pitch_input = np.array([[avg_pitch]], dtype=np.float32)
            energy_input = np.array([[avg_energy]], dtype=np.float32)
            emotion_probs = emotion_probs.astype(float)

            result = "No keyword detected. The audio indicates 'No Help'."
            if keyword_detected:
                result = predict_help(keyword_input, pitch_input, energy_input, emotion_probs)
                if result == "Help":
                    send_alert()

            os.remove(original_file_path)
            if original_file_path != wav_file_path:
                os.remove(wav_file_path)

            return jsonify({
                'text': text,
                'keyword_detected': keyword_detected,
                'avg_pitch': float(avg_pitch),
                'avg_energy': float(avg_energy),
                'emotion_probs': emotion_probs.tolist(),
                'result': result
            })

        except Exception as e:
            logger.error(f'An error occurred during processing: {str(e)}')
            return jsonify({'error': 'An error occurred', 'details': str(e)}), 500

def send_alert():
    print('Sending Alert')
    try:
        live_location = "https://maps-eta-gilt.vercel.app/map"
        twiml = VoiceResponse()
        twiml.say(voice='alice', message='Hello! Your friend might be in big trouble. Please check the SMS message.')

        client.messages.create(
            from_='+16122844698',
            to='+918618541131',
            body=f'Your friend is in big trouble, please check out the link: {live_location}'
        )

        call = client.calls.create(
            twiml=twiml,
            to='+918618541131',
            from_='+16122844698'
        )
        logger.error(f'Alert sent. Call SID: {call.sid}')

    except Exception as e:
        logger.error(f'Failed to send alert: {str(e)}')

def send_call():
    try:
        # Create the TwiML response
        twiml = VoiceResponse()
        twiml.say("Hello! Your friend might be in big trouble. Please check the SMS message.", voice='alice')

        # Make the call
        call = client.calls.create(
            twiml=twiml,
            to='+918618541131',
            from_='+16122844698'
        )
        logger.error(f'Call initiated. Call SID: {call.sid}')

    except Exception as e:
        logger.error(f'Failed to send call alert: {str(e)}')
        
def send_sms():
    try:
        live_location = "https://maps-eta-gilt.vercel.app/map"

        client.messages.create(
            from_='+16122844698',
            to='+918618541131',
            body=f'Your friend is in big trouble, please check out the link: {live_location}'
        )

    except Exception as e:
        logger.error(f'Failed to send SMS alert: {str(e)}')

