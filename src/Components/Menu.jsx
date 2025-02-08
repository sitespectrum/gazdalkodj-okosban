const Menu = ({ onClose }) => {
    return (
        <>
            <div className="ss-hero-container">
                <div className="ss-hero">
                    <img src="/src/Logos/ss.png" className="ss-logo" />
                </div>
            </div>
            <div className="menu">
                <div className="menu-content">
                    <h1>Gazdálkodj Okosban</h1>
                    <button onClick={() => onClose()}>Kezdés</button>
                </div>
            </div>
        </>
    )
}

export default Menu