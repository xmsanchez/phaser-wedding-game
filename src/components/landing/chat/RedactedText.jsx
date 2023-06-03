import React from 'react';

const RedactedText = ({ text }) => (
    <span>
        {text.slice(0, 3)}
        {text.slice(5, -2).replace(/./g, '*')}
        {text.slice(-2)}
    </span>
);
  
export default RedactedText;