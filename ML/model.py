import speech_recognition as sr
import librosa
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, concatenate , Dropout

# Simulated emotion probabilities for 10 samples
emotion_probs = np.array([
    [0.1, 0.1, 0.05, 0.05, 0.3, 0.1, 0.2, 0.1],  # Angry
    [0.2, 0.05, 0.1, 0.1, 0.25, 0.1, 0.1, 0.1],  # Calm
    [0.1, 0.1, 0.3, 0.1, 0.05, 0.1, 0.15, 0.1],  # Disgust
    [0.15, 0.15, 0.1, 0.25, 0.1, 0.05, 0.1, 0.1],  # Fearful
    [0.2, 0.05, 0.05, 0.1, 0.35, 0.05, 0.1, 0.1],  # Happy
    [0.05, 0.15, 0.1, 0.05, 0.1, 0.35, 0.1, 0.1],  # Neutral
    [0.1, 0.05, 0.15, 0.15, 0.2, 0.1, 0.2, 0.05],  # Sad
    [0.15, 0.1, 0.1, 0.05, 0.2, 0.1, 0.1, 0.2],  # Surprised
    [0.1, 0.2, 0.05, 0.1, 0.1, 0.15, 0.15, 0.15],  # Neutral
    [0.2, 0.05, 0.05, 0.1, 0.35, 0.05, 0.1, 0.1],  # Happy
])

# Other example data
keyword_flags = np.array([[1], [0], [1], [0], [1], [0], [0], [1], [0], [1]])  # 1 for keyword detected, 0 for not detected
pitch_values = np.array([[250], [150], [300], [200], [320], [180], [170], [290], [210], [330]])  # Average pitch values in Hz
energy_values = np.array([[0.03], [0.01], [0.04], [0.02], [0.05], [0.01], [0.015], [0.04], [0.025], [0.05]])  # Average energy values
labels = np.array([[1], [0], [1], [0], [1], [0], [0], [1], [0], [1]])  # 1 for "Help", 0 for "No Help"

# Define the input layers
keyword_input = Input(shape=(1,), name='keyword_input')
pitch_input = Input(shape=(1,), name='pitch_input')
energy_input = Input(shape=(1,), name='energy_input')
emotion_input = Input(shape=(8,), name='emotion_input')  # 8 emotion probabilities

# Define dense layers for each input
keyword_dense = Dense(16, activation='relu')(keyword_input)

pitch_dense = Dense(16, activation='relu')(pitch_input)

energy_dense = Dense(16, activation='relu')(energy_input)

emotion_dense = Dense(16, activation='relu')(emotion_input)


# Concatenate the dense layers
concatenated = concatenate([keyword_dense, pitch_dense, energy_dense, emotion_dense])

# Final decision layer
dense_1 = Dense(32, activation='relu')(concatenated)
output = Dense(1, activation='sigmoid')(dense_1)  # Binary classification (Help or No Help)

# Define the model
model = Model(inputs=[keyword_input, pitch_input, energy_input, emotion_input], outputs=output)

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
model.fit([keyword_flags, pitch_values, energy_values, emotion_probs], labels, epochs=20, batch_size=1)

# Save the model
model.save('help_detection_model.h5')
