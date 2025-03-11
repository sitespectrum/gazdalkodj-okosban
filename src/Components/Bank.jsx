import React from "react"
import { moneyContext } from "../main"

const Bank = ({onClose}) => 
{
    return (
        <div className="bank">
            <h1>Bank</h1>
            <button className="close-bank" onClick={onClose}>Bezárás</button>
        </div>
    )
}

export default Bank