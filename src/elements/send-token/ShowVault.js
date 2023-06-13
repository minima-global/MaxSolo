import React, { useState } from 'react';

const ShowVault = ({ loading, showVault, errorText, onButtonClick, stateChanger, ...rest}) => {

    const [vaultPassword, setVaultPassword] = useState("");
    const [showHidePassword, changeShowHidePassword] = useState(false);
    const passShowIcon = !showHidePassword? "icon-on" : "icon-off"

    const LockIcon = () =>{
      return(
        <svg width="38" height="50" viewBox="0 0 38 50" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.61719 49.334C2.64497 49.334 1.81858 48.9937 1.13802 48.3131C0.457465 47.6326 0.117188 46.8062 0.117188 45.834V20.5173C0.117188 19.5451 0.457465 18.7187 1.13802 18.0381C1.81858 17.3576 2.64497 17.0173 3.61719 17.0173H7.70052V11.4173C7.70052 8.34509 8.77969 5.72982 10.938 3.57148C13.0964 1.41315 15.7116 0.333984 18.7839 0.333984C21.8561 0.333984 24.4714 1.41315 26.6297 3.57148C28.788 5.72982 29.8672 8.34509 29.8672 11.4173V17.0173H33.9505C34.9227 17.0173 35.7491 17.3576 36.4297 18.0381C37.1102 18.7187 37.4505 19.5451 37.4505 20.5173V45.834C37.4505 46.8062 37.1102 47.6326 36.4297 48.3131C35.7491 48.9937 34.9227 49.334 33.9505 49.334H3.61719ZM3.61719 45.834H33.9505V20.5173H3.61719V45.834ZM18.7839 37.6673C20.0283 37.6673 21.088 37.2395 21.963 36.384C22.838 35.5284 23.2755 34.4979 23.2755 33.2923C23.2755 32.1257 22.838 31.0659 21.963 30.1131C21.088 29.1604 20.0283 28.684 18.7839 28.684C17.5394 28.684 16.4797 29.1604 15.6047 30.1131C14.7297 31.0659 14.2922 32.1257 14.2922 33.2923C14.2922 34.4979 14.7297 35.5284 15.6047 36.384C16.4797 37.2395 17.5394 37.6673 18.7839 37.6673ZM11.2005 17.0173H26.3672V11.4173C26.3672 9.31732 25.6283 7.52843 24.1505 6.05065C22.6727 4.57287 20.8839 3.83398 18.7839 3.83398C16.6839 3.83398 14.895 4.57287 13.4172 6.05065C11.9394 7.52843 11.2005 9.31732 11.2005 11.4173V17.0173ZM3.61719 45.834V20.5173V45.834Z" />
        </svg>
      )
    }

    const handleOnClick = (e) => {
      e.preventDefault();
      if(vaultPassword == "") return;
      stateChanger(vaultPassword);
      setVaultPassword("");
      setTimeout(() => {
        stateChanger('');
        changeShowHidePassword(false);
      }, 1000);
    };

    const onCancel = () =>{
      stateChanger("");
      onButtonClick();
      setVaultPassword("");
      changeShowHidePassword(false);
    }

    if (loading) {
      return (
        <div className={`send-tokens-window-vault ${showVault ? "" : "hide"}`}>
          <div className='send-tokens-window-pending-icon'>
            <svg className="hourglass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 206" preserveAspectRatio="none">
              <path className="middle" d="M120 0H0v206h120V0zM77.1 133.2C87.5 140.9 92 145 92 152.6V178H28v-25.4c0-7.6 4.5-11.7 14.9-19.4 6-4.5 13-9.6 17.1-17 4.1 7.4 11.1 12.6 17.1 17zM60 89.7c-4.1-7.3-11.1-12.5-17.1-17C32.5 65.1 28 61 28 53.4V28h64v25.4c0 7.6-4.5 11.7-14.9 19.4-6 4.4-13 9.6-17.1 16.9z"/>
              <path className="outer" d="M93.7 95.3c10.5-7.7 26.3-19.4 26.3-41.9V0H0v53.4c0 22.5 15.8 34.2 26.3 41.9 3 2.2 7.9 5.8 9 7.7-1.1 1.9-6 5.5-9 7.7C15.8 118.4 0 130.1 0 152.6V206h120v-53.4c0-22.5-15.8-34.2-26.3-41.9-3-2.2-7.9-5.8-9-7.7 1.1-2 6-5.5 9-7.7zM70.6 103c0 18 35.4 21.8 35.4 49.6V192H14v-39.4c0-27.9 35.4-31.6 35.4-49.6S14 81.2 14 53.4V14h92v39.4C106 81.2 70.6 85 70.6 103z"/>
            </svg>
          </div>
        </div>
      )
    };

    return (
        <div className={`send-tokens-window-vault ${showVault ? "" : "hide"}`}>
          <div className='send-tokens-window-vault-icon'>
            {showVault ? <LockIcon /> : ""}
          </div>
          <div className='send-tokens-window-vault-header'>Your node is locked</div>
          <div className='send-tokens-window-vault-copy'>Please enter your password below to complete your transaction.</div>
          <form>
            <i
              className={showHidePassword ? "icon-off" : "icon-on"}
              onClick={() => changeShowHidePassword(!showHidePassword)}
            >
            </i>
            <input
                type={showHidePassword ? "text" : "password"}
                name='password'
                value={vaultPassword}
                onInput={e => setVaultPassword(e.target.value)}
            />
            <div className='info-input'>{errorText}</div>
            <button onClick={handleOnClick} disabled={vaultPassword === ""} className="minima-btn btn-fill-blue-medium">Submit</button>
          </form>
          <button onClick={onCancel} className="minima-btn btn-fill-black-medium">Cancel</button>
        </div>
    )
}

export default ShowVault;
