import React, { useState, useEffect } from 'react';

const Phone = ({ onClose }) => {
    const [time, setTime] = useState(new Date());
    const [battery, setBattery] = useState(100);
    const [countdown, setCountdown] = useState(100);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setTime(new Date());
        }, 60000);

        return () => clearInterval(timeInterval); 
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timerInterval = setInterval(() => {
                setCountdown(prev => prev - 1);
                setBattery(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timerInterval);
        } else {
            onClose();
        }
    }, [countdown, onClose]);

    return (
        <div className='phone-container'>
            <p className='time'>{time.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}</p>
            <p className='camera'>.</p>
            <p className='battery'>{battery}%</p>
            <img src="./src/HQ Pictures/Console phone icon.png" alt="console" className='console-icon' onClick={() => handleConsole()} />
            <img src="./src/HQ Pictures/Tipszmiksz phone icon.png" alt="mix" className='mix-icon' onClick={() => handleTipszmix()} />
            <img src="./src/HQ Pictures/Angeles casino phone icon.png" alt="angeles" className='angeles-icon' onClick={() => handleTipszmix()} />
            <img src="./src/HQ Pictures/Tipszmiksz phone icon.png" alt="mix" className='mix-icon2' onClick={() => handleTipszmix()} />
        </div>
    );
};

export default Phone;
