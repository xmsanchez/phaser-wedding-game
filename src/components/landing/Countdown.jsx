import React, { useState, useEffect } from 'react';

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear interval if target date has been reached
    if (timeLeft.total <= 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  function calculateTimeLeft() {
    const targetDate = new Date("September 30, 2023 16:30:00").getTime();
    const now = new Date().getTime();

    const difference = targetDate - now;

    let days = Math.floor(difference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((difference / 1000 / 60) % 60);
    let seconds = Math.floor((difference / 1000) % 60);

    if (difference <= 0) {
      days = hours = minutes = seconds = 0;
    }

    return {
      total: difference,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  return (
    <div>
      {(
        <h2 className="countdown">
          {timeLeft.days} dies, {timeLeft.hours} hores, {timeLeft.minutes} minuts, {timeLeft.seconds} segons
        </h2>
      )}
    </div>
  );
}

export default Countdown;