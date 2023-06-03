import React, { useState, useEffect } from 'react';
import styles from './styles/InputBox.module.css';

const InputBox = ({ sendMessage }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [stream, setStream] = useState(null);
  const [silenceTimeout, setSilenceTimeout] = useState(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const message = input.trim();
      if (message !== '') {
        sendMessage(message);
        setInput('');
      }
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setAudioChunks((prevChunks) => [...prevChunks, event.data]);
      clearTimeout(silenceTimeout);
      setSilenceTimeout(setTimeout(handleMicClick, 3000));
    }
  };

  const handleMicClick = async () => {
    if (isListening) {
      mediaRecorder.stop();
      clearTimeout(silenceTimeout);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    } else {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(userStream);
        const recorder = new MediaRecorder(userStream);
        recorder.ondataavailable = handleDataAvailable;
        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          sendAudio(audioBlob);
          setAudioChunks([]);
        };
        recorder.start();
        setMediaRecorder(recorder);
      } catch (err) {
        console.error('Error getting user media:', err);
      }
    }
    setIsListening(!isListening);
  };

  const sendAudio = async (audioBlob) => {
    // Call the modified sendMessage function with the audioBlob and set isAudio to true
    sendMessage(audioBlob, true);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
  
    const message = input.trim();
  
    if (message) {
      if (event.ctrlKey && event.code === 'Enter') {
        setInput(input + '\n'); // add a newline to the input value
        return; // don't submit the form
      }
  
      sendMessage(message);
      setInput('');
    }
  };
 
  return (
    <form className={styles.inputBox} onSubmit={handleSubmit}>
      <textarea
        className={styles.inputField}
        value={input}
        onKeyDown={handleKeyDown}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Type your message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default InputBox;
