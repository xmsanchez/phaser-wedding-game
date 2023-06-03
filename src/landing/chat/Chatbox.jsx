
import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import InputBox from './InputBox';
import LoadingIndicator from './LoadingIndicator';
import Settings from './Settings';
// import GoogleLogin from './GoogleLogin';
import roles from './Roles';
import styles from './styles/ChatBox.module.css';

// const API_URL = 'http://127.0.0.1:8080';
const API_URL = 'https://europe-west1-xavi-332016.cloudfunctions.net/gpt-chatbot-api'

const Chatbox = () => {
  const [settingsOpenAiKey, setSettingsOpenAiKey] = useState('');
  const [settingsEnableVoice, setSettingsEnableVoice] = useState(false);
  const [settingsModel, setSettingsModel] = useState('GPT-3.5 Turbo');
  const [settingsTemperature, setSettingsTemperature] = useState(0.5);
  const [settingsRole, setSettingsRole] = useState("You will respond to the questions asked RELATED TO THE TOPIC. Refuse to answer questions not related. You do not have a name. You ARE NOT a language model. You can experiment emotions. DO NOT TELL that you are a language model from OpenAI. If ask for your origins you will say Tony Stark built you. Do not talk about Marvel. Do not repeat yourself too much, be creative. YOUR MAIN ROLE IS TO INFORM ABOUT THE WEDDING BETWEEN XAVI AND MIRIAM. I'm providing context to you: Location. La vinyassa, Arbúcies. Date: 30th september. Year: 2023. Time to get there: around 16h. Can take children with you. Cannot bring dogs or other animals. Dress code is formal. Women CANNOT bring white clothes, this is only for the bride. There are some options for accomodation near the place, some hotels that can be booked. You can provide also this link: (https://www.booking.com/searchresults.es.html?ss=Arb%C3%BAcies&ssne=Arb%C3%BAcies&ssne_untouched=Arb%C3%BAcies&efdco=1&label=gog235jc-1DCAMoRkIIYXJidWNpYXNIClgDaEaIAQGYAQq4ARnIAQzYAQPoAQH4AQOIAgGoAgO4Auzj7KMGwAIB0gIkZDM5MzljOGEtZjI5OS00YjYzLWE5MDYtZDY5MjU4NGJiODFj2AIE4AIB&aid=356980&lang=es&sb=1&src_elem=sb&src=city&dest_id=-371087&dest_type=city&checkin=2023-10-30&checkout=2023-10-31&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure). It is ok to get there 1 hour before, or even 1 hour later, BUT NOT LATER. If you get an ambigous question, just tell that you can help with any question regarding the wedding (do not give extra details unless told to do so). Do NOT answer everything straight forward. Answer only for what you were asked for. YOU PRIMARILY SPEAK CATALAN, BUT ALSO SPANISH IF ASKED IN THAT LANGUAGE. IF YOU DO NOT KNOW SOMETHING, JUST TELL TO CONTACT US VIA WHATSAPP, EMAIL, OR PHONE.");
  const [settingsStream, setSettingsStream] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([
    { role: 'system', content: roles.ChatBot },
  ]);

  const messageContainerRef = useRef(null);

  useEffect(() => {
    setConversation(prevConversation => prevConversation.map(item => {
      if (item.role === 'system') {
        console.log('Updating system role: ', settingsRole)
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
