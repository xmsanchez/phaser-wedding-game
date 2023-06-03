import React, { useState } from 'react';
import RedactedText from './RedactedText';
import roles from './Roles';
import styles from './styles/Settings.module.css';

const Settings = ( props ) => {
  const { enableVoice, setEnableVoice, model, setModel, temperature, setTemperature, setOpenAiKey, setRole, stream, setStream } = props;
  const [apiKey, setApiKey] = useState(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleModelChange = (e) => {
    setModel(e.target.value);
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleApiKeySubmit = () => {
    setShowApiKeyInput(false);
    setOpenAiKey(apiKey);
  };  

  const handleRemoveApiKey = () => {
    setApiKey(null);
    setShowApiKeyInput(false);
    setOpenAiKey('');
  };
  
  const handleRoleChange = (e) => {
    setRole(roles[e.target.value]);
  };

  return (
    <div>
      <div className={styles.settings}>
        <div>
          <h3>Enable voice output</h3>
          <input
            type="checkbox"
            id="enableVoice"
            checked={enableVoice}
            onChange={() => setEnableVoice(!enableVoice)}
          />
          <label htmlFor="enableVoice">Enable Voice</label>
        </div>
        <div>
          <h3>Select engine</h3>
          <input
            type="radio"
            id="gpt35"
            name="model"
            value="GPT-3.5 Turbo"
            checked={model === 'GPT-3.5 Turbo'}
            onChange={handleModelChange}
          />
          <label htmlFor="gpt35">GPT-3.5 Turbo</label>
          <input
            type="radio"
            id="gpt4"
            name="model"
            value="GPT-4"
            checked={model === 'GPT-4'}
            onChange={handleModelChange}
          />
          <label htmlFor="gpt4">GPT-4</label>
        </div>
        <div>
          <h3>Engine temperature</h3>
          <label className={styles.hint}>Higher values for more creative response</label><br/>
          <label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</label>
          <input
            type="range"
            id="temperature"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <h3>Stream</h3>
          <label className={styles.hint}>When checked, response will be real-time</label><br/>
            <input
              type="checkbox"
              id="stream"
              checked={stream}
              onChange={() => setStream(!stream)}
            />
        </div>
      </div>
      <div className={styles.roleContainer}>
          <h3>Select role (optional)</h3>
          <label className={styles.hint}>Assistant will assume this role (optional)</label><br/>
          <select id="role" onChange={handleRoleChange}>
            {Object.keys(roles).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>))}
          </select>
        </div>
      <div className={styles.apiKeyContainer}>
          <button className={styles.apiKeyButtonAdd} onClick={() => setShowApiKeyInput(true)}>Select API key</button>
            {apiKey &&
              (<button onClick={handleRemoveApiKey} className={styles.apiKeyButtonRemove}>Remove API key</button>)
            }
            {apiKey && 
              <span><RedactedText text={apiKey}/></span>
            }
        </div>
        {showApiKeyInput && (
          <div className={styles.apiKeyRow}>
            <input type="text" onChange={handleApiKeyChange} />
            <button onClick={() => handleApiKeySubmit(false)}>Done</button>
          </div>
        )}
    </div>
  );
};

export default Settings;
