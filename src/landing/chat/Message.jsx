import React from 'react';
import Linkify from 'react-linkify';
import styles from './styles/Message.module.css';

const Message = ( props ) => {
  const { message, className } = props;
  const { content } = message;

  const parts = content.split('```');

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(
      () => {
        console.log('Copied to clipboard');
      },
      (err) => {
        console.error('Failed to copy text: ', err);
      },
    );
  };

  const replaceNewLines = (str) => {
    return str.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < str.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      {parts.map((part, index) => {
        const isCode = index % 2 === 1;
        return isCode ? (
          <div key={index} className={styles.codeContainer}>
            <button
              className={styles.copyButton}
              onClick={() => handleCopyCode(part)}
            >
              Copy code
            </button>
            <pre className={styles.code}>
              <code>{replaceNewLines(part)}</code>
            </pre>
          </div>
        ) : (
          <div key={index} className={`${styles.message} ${className}`}>
            <Linkify properties={{target: '_blank'}}>{replaceNewLines(part)}</Linkify>
          </div>
        );
      })}
    </>
  );
};

export default Message;
