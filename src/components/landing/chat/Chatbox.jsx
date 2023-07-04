
import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import InputBox from './InputBox';
import LoadingIndicator from './LoadingIndicator';
import Settings from './Settings';
import roles from './Roles';
import styles from './styles/ChatBox.module.css';

// const API_URL = 'http://127.0.0.1:8080';
let API_URL = '';
try {
  API_URL = import.meta.env.VITE_CHATBOT_API_URL;
} catch (error) {
  console.log('Error getting chatbot API key: ' + error + '. Note that chatbot won\'t be available.');
}
API_URL = 'https://europe-west1-xavi-332016.cloudfunctions.net/gpt-chatbot-api'

const Chatbox = ({playerName}) => {
  let role = roles.WeddingPlanner;
  if(playerName === 'Xavi'){
    role = roles.WeddingPlanner += ". THIS USER IS XAVI. He is the husband!. Obviously without him there is no wedding. For reference: Antoni and Aurora are Xavi\'s parents. Sergi and Sílvia are his brother and sister. Margarita is Miriam\'s mother, and Sheila her sister.";
  }else if(playerName === 'Miriam'){
    role = roles.WeddingPlanner += ". THIS USER IS MIRIAM. She is the bride!. Obviously without her there is no wedding. For reference: Antoni and Aurora are Xavi\'s parents. Sergi and Sílvia are his brother and sister. Margarita is Miriam\'s mother, and Sheila her sister.";
  }else{
    role = roles.WeddingPlanner += ". REMEMBER TO SPEAK CATALAN. REMEMBER TO CALL THE USER BY THE NAME IN YOUR INTERACTIONS, SPECIALLY IN THE FIRST MESSAGE: " + playerName + ". For reference: Antoni and Aurora are Xavi\'s parents. Sergi and Sílvia are his brother and sister. Margarita is Miriam\'s mother, and Sheila her sister.";
  }

  const [settingsOpenAiKey, setSettingsOpenAiKey] = useState('');
  const [settingsEnableVoice, setSettingsEnableVoice] = useState(false);
  const [settingsModel, setSettingsModel] = useState('GPT-3.5 Turbo');
  const [settingsTemperature, setSettingsTemperature] = useState(0.5);
  const [settingsRole, setSettingsRole] = useState(role);
  const [settingsStream, setSettingsStream] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([
    { role: 'system', content: role },
  ]);

  const messageContainerRef = useRef(null);

  useEffect(() => {
    setConversation(prevConversation => prevConversation.map(item => {
      if (item.role === 'system') {
        // console.log('Updating system role: ', settingsRole)
        return { ...item, content: settingsRole };
      }
      return item;
    }));
  }, [settingsRole]);

  useEffect(() => {
    console.log('Key changed')
  }, [settingsOpenAiKey]);

  useEffect(() => {
    console.log('Stream mode set to ', settingsStream)
  }, [settingsStream]);

  useEffect(() => {
    // Scroll to the bottom of the message container
    const messageContainer = messageContainerRef.current;
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, [conversation]);

  const cleanHistory = () => {
    setConversation([{ role: 'system', content: roles.ChatBot }]);
  }

  function generateClientId(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return result;
  }

  const sendMessage = async (message) => {
    const userMessage = { role: 'user', content: message };
    setConversation((prevConversation) => [...prevConversation, userMessage]);
    setLoading(true);

    const requestBody = {
      conversation: [...conversation, userMessage],
      settings: { openAiKey: settingsOpenAiKey, enableVoice: settingsEnableVoice, model: settingsModel, temperature: settingsTemperature, stream: settingsStream }
    };
  
    if (!settingsStream) {
      await requestNoStream(requestBody);
    } else {
      await requestStream(requestBody);
    }
  
    setLoading(false);
  };
  
  const requestNoStream = async (requestBody) => {  
    let response = {};
    let responseData;
    let responseMessage;
  
    try {
      response = await Promise.race([
        fetch(API_URL + '/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 120000)
        ),
      ]);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      responseData = await response.json();
      responseMessage = responseData.text || "Sorry, I couldn't understand you. Please try again.";
    } catch (error) {
      console.log(error);
      responseMessage = 'Sorry, something is not working. Please try again. ';
    }
    const assistantMessage = { role: 'assistant', content: responseMessage };
  
    if (response.hasOwnProperty('status')) {
      if (response.status === 401) {
        setApiMessage("You are not authorized to access the API");
      }
    } else {
      setApiMessage('');
      setConversation((prevConversation) => [
        ...prevConversation,
        assistantMessage,
      ]);
    }
  };
  
  const requestStream = async (requestBody) => {
    let responseMessage;

    const clientId = generateClientId(); 

    const eventSource = new EventSource(API_URL + `/stream?clientId=${clientId}`)

    eventSource.addEventListener('message', (event) => {
      console.log('Stream: ' + event.data);
      responseMessage = event.data.message;
    });

    eventSource.addEventListener('error', (event) => {
      console.error(`Error occurred while receiving streaming data: ${event}`);
      eventSource.close();
    });

    fetch(API_URL + '/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }).then((response) => {
        if (!response.ok) {
          throw new Error('Failed to start streaming data');
        }

        console.log('Started streaming data');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  return (
    <div className={styles.mainContainer}>
      {showSettings &&
      <div className={styles.settingsContainer}>
        <Settings 
          enableVoice={settingsEnableVoice}
          setEnableVoice={setSettingsEnableVoice}
          model={settingsModel}
          setModel={setSettingsModel}
          temperature={settingsTemperature}
          setTemperature={setSettingsTemperature}
          setOpenAiKey={setSettingsOpenAiKey}
          setRole={setSettingsRole}
          stream={settingsStream}
          setStream={setSettingsStream}
        />
      </div>
      }
      <div className={styles.chatBox}>
        <div>
            {apiMessage ? 
            <p className={styles.apiMessage}>{apiMessage}</p> : ''}
        </div>
        <div className={styles.messageContainer} ref={messageContainerRef}>
          {conversation
            .filter((message) => message.role !== 'system')
            .map((message, index) => (
              <Message
                key={index}
                message={message}
                apiMessage={apiMessage}
                className={
                  message.role === 'user'
                    ? styles.userMessage
                    : styles.chatbotMessage
                }
              />
            ))}
          {loading && <LoadingIndicator />}
        </div>
        <InputBox sendMessage={sendMessage} />
        {/* <button onClick={() => cleanHistory()} type="submit">Clean history</button> */}
      </div>
    </div>
  );
};

export default Chatbox;
