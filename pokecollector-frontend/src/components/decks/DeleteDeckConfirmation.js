import React from "react";



import "../../css/decks/deletedeckconfirmation.css";

const DeleteDeckConfirmation = ({ deckName, handleDelete, handleChange }) => {

    return (
        <div className="DeleteDeckConfirmation" >
            <form className="DeleteDeckConfirmation-form" >
                <label htmlFor="deleteConfirm">Delete '{deckName}' forever?</label>
                <input type="text" id="deleteConfirm" name="deleteConfirm" placeholder="Type delete here..." onChange={handleChange}></input>
                <button className="DeleteDeckConfirmation-button" onClick={handleDelete}>Delete</button>
            </form>
        </div>
    )
};

export default DeleteDeckConfirmation;