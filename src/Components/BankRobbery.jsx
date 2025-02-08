import React, { useState, useEffect } from "react";
import { formatMoney } from "./CurrentPlayerPanel";

const Bank = ({ onClose, currentPlayer, addPlayerMoney, sendToJail }) => {
    const [isRobbing, setIsRobbing] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [clickCount, setClickCount] = useState(0);
    const [escapeVisible, setEscapeVisible] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (isRobbing && countdown !== null) {
            let timer = setTimeout(() => {
                setCountdown((prev) => prev - 1);
            }, 500);

            if (countdown === 1) {
                setEscapeVisible(true);
            } else if (countdown === 0) {
                handleFail();
            }

            return () => clearTimeout(timer);
        }
    }, [isRobbing, countdown]);

    const handleStartRobbery = () => {
        setIsRobbing(true);
        setCountdown(Math.floor(Math.random() * 6) + 20);
        setClickCount(0);
        setEscapeVisible(false);
    };

    const handleClick = () => {
        if (isRobbing) {
            setClickCount((prev) => prev + 1);
        }
    };

    const handleEscape = () => {
        if (isRobbing && escapeVisible) {
            addPlayerMoney(currentPlayer, clickCount * 10000);
            setGameOver(true);
        }
    };

    const handleFail = () => {
        if (!gameOver) {
            setEscapeVisible(false);
            sendToJail(currentPlayer);
            setGameOver(true);
        }
    };

    return (
        <div className="bankrobbery">
            {!isRobbing ? (
                <>
                    <p className="robbery-question">Akarsz bankot rabolni?</p>
                    <button className="robbery-yes" onClick={handleStartRobbery}>Igen</button>
                    <button className="robbery-no" onClick={onClose}>Nem</button>
                </>
            ) : !gameOver ? (
                <>
                    <h1 className="robbery">Bankrablás!</h1>
                    <p className="description">Kattints minél többször a pénzszerzéshez!</p>
                    <button className="robBtn" onClick={handleClick}>💰 Rablás ({clickCount})</button>
                    {escapeVisible && <button className="escape" onClick={handleEscape}>🚨 Menekülés!</button>}
                </>
            ) : (
                <>
                    <h1 className="robbery">Bankrablás vége!</h1>
                    {escapeVisible ? (
                        <p className="success">Sikeresen megszereztél {formatMoney(clickCount * 10000)}-ot!</p>
                    ) : (
                        <p className="fail">Lebuktál! Börtönbe mész.</p>
                    )}
                    <button className="robbery-close" onClick={onClose}>Bezárás</button>
                </>
            )}
        </div>
    );
};

export default Bank;