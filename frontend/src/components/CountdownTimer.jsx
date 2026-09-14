import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    // Default 48 hours from current time if not provided
    const target = targetDate || new Date(Date.now() + 48 * 60 * 60 * 1000);
    const difference = +new Date(target) - +new Date();
    let timeLeft = { days: 1, hours: 23, minutes: 59, seconds: 59 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num) => String(num).padStart(2, '0');

  const unitBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '0.6rem 0.9rem',
    minWidth: '64px'
  };

  const numberStyle = {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.7rem',
    fontWeight: 600,
    color: '#FFFFFF',
    lineHeight: 1
  };

  const labelStyle = {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#E8DECF',
    marginTop: '4px'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <div style={unitBoxStyle}>
        <span style={numberStyle}>{format(timeLeft.days)}</span>
        <span style={labelStyle}>Days</span>
      </div>
      <span style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: 600 }}>:</span>
      <div style={unitBoxStyle}>
        <span style={numberStyle}>{format(timeLeft.hours)}</span>
        <span style={labelStyle}>Hours</span>
      </div>
      <span style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: 600 }}>:</span>
      <div style={unitBoxStyle}>
        <span style={numberStyle}>{format(timeLeft.minutes)}</span>
        <span style={labelStyle}>Mins</span>
      </div>
      <span style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: 600 }}>:</span>
      <div style={unitBoxStyle}>
        <span style={numberStyle}>{format(timeLeft.seconds)}</span>
        <span style={labelStyle}>Secs</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
