import React, { useState, useEffect } from 'react';
import styles from './styles/LoadingIndicator.module.css';

const LoadingIndicator = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === '...') {
          return '';
        } else {
          return prevDots + '.';
        }
      });
    }, 500); // Adjust the interval duration as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.loadingIndicatorContainer}>
      <div className={styles.loadingIndicator}></div>
      <p>
        <i>Estem escrivint{dots}</i>
      </p>
    </div>
  );
};

export default LoadingIndicator;
