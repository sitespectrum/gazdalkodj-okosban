const Menu = ({onClose}) => {
    return (
        <div className="menu">
            <button className="menu-close" onClick={onClose}>Bezárás</button>
        </div>
    )
}

export default Menu