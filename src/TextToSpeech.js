import React, { useState } from 'react';
import axios from 'axios';
import { htmlToText } from 'html-to-text';

const TextToSpeech = ({ text }) => {
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');

  const handleSpeak = async () => {
    const simpleText = "Bonjour, comment ça va?"; // Utilisez un texte simple pour tester

    if (simpleText !== '') {
      try {
        // Convertir le texte simple en texte brut
        const plainText = htmlToText(simpleText, {
          wordwrap: false,
        });

        // Assurez-vous que le format JSON est correct
        const requestBody = {
          inputs: plainText
        };

        console.log('Request Body:', JSON.stringify(requestBody));

        const response = await axios.post(
          'https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_fastspeech2', // Utilisez l'URL correcte du modèle
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
          }
        );

        if (response.status === 200) {
          const audioBlob = new Blob([response.data], { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
          const audio = new Audio(audioUrl);
          audio.play();
        } else {
          setError(`Error: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error generating speech:', error);
        setError('An error occurred while generating speech.');
      }
    }
  };

  return (
    <div>
      <button onClick={handleSpeak}>Read Text</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default TextToSpeech;
