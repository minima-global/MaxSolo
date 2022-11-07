import React from 'react';

const ShowSuccess = ({tokenAmount, tokenTitle, showSuccess, onButtonClick}) => {

    const CheckMark = () =>{
      return(
        <svg className={`checkmark ${showSuccess ? "start" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
          <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
      )
    }

    return (
        <div className={`send-tokens-window-success ${showSuccess ? "" : "hide"}`}>
          <div className='send-tokens-window-success-icon'>
            {showSuccess ? <CheckMark /> : ""}
          </div>
          <div className='send-tokens-window-success-header'>Sucessfully sent</div>
          <div className='send-tokens-window-success-amount'>{tokenAmount}</div>
          <div className='send-tokens-window-success-token'>{tokenTitle}</div>
          <div className='send-tokens-window-success-copy'>Please wait a few minutes for your transaction to be confirmed on the blockchain.</div>
          <button onClick={onButtonClick} className="minima-btn btn-fill-blue-medium">Return to chat</button>
        </div>       
    )
}

export default ShowSuccess;