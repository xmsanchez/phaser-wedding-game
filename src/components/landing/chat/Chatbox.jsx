
import React, { useState, useEffect, useRef } from 'react';
import { socket } from './Socket'
import Message from './Message';
import InputBox from './InputBox';
import LoadingIndicator from './LoadingIndicator';
import Settings from './Settings';
// import GoogleLogin from './GoogleLogin';
import roles from './Roles';
import styles from './styles/ChatBox.module.css';

const API_URL = 'http://127.0.0.1:5000';
// const API_URL = 'https://europe-west1-xavi-332016.cloudfunctions.net/gpt-chatbot-api'

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

  const [isConnected, setIsConnected] = useState(false);
  const [result, setResult] = useState('');

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
  
  // const stream = (message) => {
  //   const userMessage = { role: 'user', content: message };
  //   setConversation((prevConversation) => [...prevConversation, userMessage]);
  //   setLoading(true);

  //   const requestBody = {
  //     conversation: [...conversation, userMessage],
  //     settings: { openAiKey: settingsOpenAiKey, enableVoice: settingsEnableVoice, model: settingsModel, temperature: settingsTemperature, stream: settingsStream }
  //   };
  //   let responseMessage;
  //   const assistantMessage = { role: 'assistant', content: message };
  //   console.log('assistantMessage: ', assistantMessage);
  //   socket.emit('request_chatGPT_description', [...conversation, userMessage]);


  //   setAssistantMessage('');
  // }

  const stream = (message) => {
    setAssistantMessage('');
    const userMessage = { role: 'user', content: message };
    setConversation((prevConversation) => [...prevConversation, userMessage]);
    setLoading(true);

    const requestBody = {
      conversation: conversation.concat(userMessage).map(({ streaming, ...msg }) => msg)
    };
    let responseMessage;
    const assistantMessage = { role: 'assistant', content: message };
    console.log('assistantMessage: ', assistantMessage);
    socket.emit('request_chatGPT_description', conversation.concat(userMessage).map(({ streaming, ...msg }) => msg));


    setAssistantMessage('');
  }
  
  const [assistantMessage, setAssistantMessage] = useState('');
  
  useEffect(() => {
    if (assistantMessage) {
      const messages = [...conversation];
      const lastIndex = messages.length - 1;
  
      if (
        messages[lastIndex] &&
        messages[lastIndex].role === "assistant" &&
        messages[lastIndex].streaming === true
      ) {
        messages[lastIndex].content = assistantMessage;
      } else {
        messages.push({
          role: "assistant",
          content: assistantMessage,
          streaming: true,
        });
      }
      setConversation(messages);
    }
  }, [assistantMessage]);

  useEffect(() => {
    function onChunk(value) {
      setAssistantMessage((prevMessage) => prevMessage + value);
      setLoading(false);
    }

      function onConnect() {
          setIsConnected(true);
      }

      if (socket.connected) {
          onConnect()
      }

      socket.on('chatGPT_descripiton_chunk', onChunk)
      socket.on('connect', onConnect)

      return () => {
          socket.off('chatGPT_descripiton_chunk', onChunk)
          socket.off('connect', onConnect)
      };
  }, []);
  
  // useEffect(() => {
  //   let completeMessage = '';
  //   let chunkTimeout = null;
  
  //   function onChunk(value) {
  //     // Clear the existing timeout if a new chunk comes in
  //     if (chunkTimeout) {
  //       clearTimeout(chunkTimeout);
  //     }
  
  //     completeMessage += value;
  
  //     // Set a new timeout
  //     chunkTimeout = setTimeout(() => {
  //       const assistantMessage = { role: 'assistant', content: completeMessage };
  //       setConversation((prevConversation) => [
  //         ...prevConversation,
  //         assistantMessage,
  //       ]);
  //       setLoading(false);
  //       completeMessage = ''; // Reset the complete message
  //     }, 1000); // 1 second timeout
  //   }
  
  //   function onConnect() {
  //     setIsConnected(true);
  //   }
  
  //   if (socket.connected) {
  //     onConnect();
  //   }
  
  //   socket.on('chatGPT_descripiton_chunk', onChunk);
  //   socket.on('connect', onConnect);
  
  //   return () => {
  //     socket.off('chatGPT_descripiton_chunk', onChunk);
  //     socket.off('connect', onConnect);
  //     if (chunkTimeout) {
  //       clearTimeout(chunkTimeout);
  //     }
  //   };
  // }, []);

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
        <InputBox sendMessage={stream} />
      </div>
    </div>
  );
};

export default Chatbox;
